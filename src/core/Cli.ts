import {ICli, ICommand, ICommandInfos, IRequest, IResponse} from "../interfaces";
import {Options, ErrorResponse} from ".";
import * as buildOptions from 'minimist-options';
import * as yargsParser from "yargs-parser";
import * as path from 'path';
import {PackageInfo} from "../interfaces/ICli";
import * as fs from "fs";
import {EventEmitter} from "events";
import {ICommandWithSubcommands} from "../interfaces/ICommand";
import {Request} from "./Request";

function findPackageJson(startDir: string|null): string|null {
    let dir = path.resolve(startDir || process.cwd());
    do {
        const pkgFile = path.join(dir, "package.json");

        if (!fs.existsSync(pkgFile)) {
            dir = path.join(dir, "..");
            continue;
        }
        return pkgFile;
    } while (dir !== path.resolve(dir, ".."));
    return null;
}

export class Cli implements ICli {
    protected binaryName: string = '';
    protected options: Options;
    protected commands: ICommand[] = [];
    protected eventEmitter = new EventEmitter();

    constructor(binaryName: string) {
        this.binaryName = binaryName;
    }

    getEventEmitter(): EventEmitter
    {
        return this.eventEmitter;
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
        const parentFile: string|null = module.parent?.filename
        let info = null
        const packageJson = findPackageJson(parentFile)
        if (packageJson) {
            info = JSON.parse(fs.readFileSync(packageJson, 'utf8')) || null
        }
        this.eventEmitter.emit('cli:package-info:modify', info)
        if (!info) {
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
        const minimistOptions = buildOptions.default({
            arguments: 'string',
            ...this.options
        });
        // @ts-ignore
        const argv = yargsParser(process.argv.slice(2), minimistOptions);

        const input = argv._ as string[];
        delete argv._;

        return new Request(input, argv);
    }

    async run() {
        const request = this.buildRequest();

        const pkg = this.getPackageInfo();
        process.title = pkg?.bin ? Object.keys(pkg.bin)[0] : pkg?.name;

        let response: IResponse;

        const checkCommand = (cmd: ICommand|ICommand&ICommandWithSubcommands, request: IRequest, level = 0): boolean => {
            let commandName = request.input[level]
            if (cmd?.getInfos().name === commandName) {
                if ('getSubcommands' in cmd && cmd.getSubcommands().size) {
                    level++
                    for (const c of cmd.getSubcommands()) {
                        if (checkCommand(c[1], request, level)) {
                            return true
                        }
                    }
                }
                return cmd.canHandleRequest(request);
            }
        }

        const matchingCommands = this.commands.filter((command) => {
            if (request.input.length == 0) {
                return false;
            }
            return checkCommand(command, request)
        });
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
            console.log(response?.message || 'Command execution finished successfully.');
        }
    }
}