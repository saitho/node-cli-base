import {ICli, ICommand, ICommandInfos, IRequest, IResponse} from "../interfaces";

export abstract class AbstractCommand implements ICommand {
    protected abstract commandName: string;
    protected abstract commandDescription: string;
    protected arguments = [];

    getInfos(): ICommandInfos {
        return {
            name: this.commandName,
            description: this.commandDescription,
        };
    }

    canHandleRequest(request: IRequest): boolean {
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

    protected abstract process(request: IRequest, cli: ICli): Promise<IResponse>;

    handleRequest(request: IRequest, cli: ICli): Promise<IResponse> {
        return this.process(request, cli);
    }
}