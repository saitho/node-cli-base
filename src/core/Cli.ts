import {ICli, ICommand, ICommandInfos, IRequest, IResponse} from "../interfaces";
import {Options, ErrorResponse} from ".";
import * as buildOptions from 'minimist-options';
import * as yargsParser from "yargs-parser";
import * as path from 'path';
import {PackageInfo} from "../interfaces/ICli";
import * as fs from "fs";

function findPackageJson(startDir: string): string|null {
    let dir = path.resolve(startDir || process.cwd());
    do {
        const pkgfile = path.join(dir, "package.json");

        if (!fs.existsSync(pkgfile)) {
            dir = path.join(dir, "..");
            continue;
        }
        return pkgfile;
    } while (dir !== path.resolve(dir, ".."));
    return null;
}

export class Cli implements ICli {
    protected binaryName: string = '';
    protected options: Options;
    protected commands: ICommand[] = [];

    constructor(binaryName: string) {
        this.binaryName = binaryName;
    }

    public getBinaryName(): string {
        return this.binaryName;
    }

    public getAvailableCommands(): ICommandInfos[] {
        return this.commands.map((command: ICommand) => command.getInfos());
    }

    public setOptions(options: Options): this {
        this.options = options;
        return this;
    }

    public getOptions(): Options {
        return this.options;
    }

    public addCommand(command: ICommand): this {
        this.commands.push(command);
        return this;
    }

    public getPackageInfo(): PackageInfo|null {
        const packageJson = findPackageJson(module.parent.filename)
        if (!packageJson) {
            return null
        }
        const info = JSON.parse(fs.readFileSync(packageJson, 'utf8'))
        if (info === undefined) {
            return null;
        }
        return {
            name: info.name,
            description: info.description,
            version: info.version,
            bin: info.bin
        };
    }

    protected buildRequest(): IRequest {
        const minimistoptions = buildOptions.default({
            arguments: 'string',
            ...this.options
        });
        // @ts-ignore
        const argv = yargsParser(process.argv.slice(2), minimistoptions);

        const input = argv._ as string[];
        delete argv._;

        return {
            input: input,
            flags: argv
        };
    }

    async run() {
        const request = this.buildRequest();

        const pkg = this.getPackageInfo();
        process.title = pkg?.bin ? Object.keys(pkg.bin)[0] : pkg?.name;

        let response: IResponse;
        const matchingCommands = this.commands.filter((command) => command.canHandleRequest(request));
        if (matchingCommands.length == 0) {
            response = new ErrorResponse(`The requested command "${request.input[0]}" was not found.`);
        } else if (matchingCommands.length > 1) {
            response = new ErrorResponse('Multiple commands matching this call were found.');
        } else {
            try {
                response = await matchingCommands[0].handleRequest(request, this);
            } catch (e) {
                response = new ErrorResponse(e);
            }
        }

        if (response instanceof ErrorResponse) {
            console.error('Command execution failed with the following error:\n\n' + response.message);
        } else {
            console.log(response.message || 'Command execution finished successfully.');
        }
    }
}