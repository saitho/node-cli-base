import {ICliCommand} from "./ICliCommand";
import {ICliResponse} from "./ICliResponse";
import {CliOptions} from "./TCliOptions";
import {CliErrorResponse} from "./CliErrorResponse";
import {ICommandInfos} from "./ICommandInfos";
import * as buildOptions from 'minimist-options';
import * as yargsParser from "yargs-parser";
import * as path from 'path';
import * as readPkg from 'read-pkg-up';
import {ICliRequest} from "./ICliRequest";

export class Cli {
    protected binaryName: string = '';
    protected options: CliOptions;
    protected commands: ICliCommand[] = [];

    constructor(binaryName: string) {
        this.binaryName = binaryName;
    }

    public getBinaryName(): string {
        return this.binaryName;
    }

    public getAvailableCommands(): ICommandInfos[] {
        return this.commands.map((command: ICliCommand) => command.getInfos());
    }

    public setOptions(options: CliOptions): this {
        this.options = options;
        return this;
    }

    public getOptions(): CliOptions {
        return this.options;
    }

    public addCommand(command: ICliCommand): this {
        this.commands.push(command);
        return this;
    }

    public getPackageInfo(): readPkg.PackageJson {
        return readPkg.sync({
            cwd: path.dirname(module.parent.filename),
            normalize: false
        }).packageJson;
    }

    protected buildRequest(): ICliRequest {
        const minimistoptions = buildOptions.default({
            arguments: 'string',
            ...this.options
        });
        const argv = yargsParser(process.argv.slice(2), minimistoptions);

        const input = argv._;
        delete argv._;

        return {
            input: input,
            flags: argv
        };
    }

    async run() {
        const request = this.buildRequest();

        const pkg = this.getPackageInfo();
        process.title = pkg.bin ? Object.keys(pkg.bin)[0] : pkg.name;

        let response: ICliResponse;
        const command = this.commands.filter((command) => command.canHandleRequest(request));
        if (command.length == 0) {
            response = new CliErrorResponse(`The requested command "${request.input[0]}" was not found.`);
        } else if (command.length > 1) {
            response = new CliErrorResponse('Multiple commands matching this call were found.');
        } else {
            try {
                response = await command[0].handleRequest(request, this);
            } catch (e) {
                response = new CliErrorResponse(e);
            }
        }

        if (response instanceof CliErrorResponse) {
            console.error('Command execution failed with the following error:\n\n' + response.message);
        } else {
            console.log(response.message || 'Command execution finished successfully.');
        }
    }
}