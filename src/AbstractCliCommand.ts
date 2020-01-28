import {ICliCommand} from "./ICliCommand";
import {ICliRequest} from "./ICliRequest";
import {ICliResponse} from "./ICliResponse";
import {Cli} from "./Cli";
import {ICommandInfos} from "./ICommandInfos";

export abstract class AbstractCliCommand implements ICliCommand {
    protected abstract commandName: string;
    protected abstract commandDescription: string;
    protected arguments = [];

    getInfos(): ICommandInfos {
        return {
            name: this.commandName,
            description: this.commandDescription,
        };
    }

    canHandleRequest(request: ICliRequest): boolean {
        if (request.input.length == 0) {
            return false;
        }
        if (request.input[0] !== this.commandName) {
            return false;
        }

        const suppliedArguments = request.input.length-1;
        const requiredArguments = this.arguments.filter((arg) => arg.required).length;
        if (requiredArguments > suppliedArguments) {
            console.log(`Command ${this.commandName} not invoked because it requires ${requiredArguments} arguments. ${suppliedArguments} supplied.`);
            return false;
        }
        // Todo: check arguments in detail

        return true;
    }

    protected abstract process(request: ICliRequest, cli: Cli): Promise<ICliResponse>;

    handleRequest(request: ICliRequest, cli: Cli): Promise<ICliResponse> {
        return this.process(request, cli);
    }
}