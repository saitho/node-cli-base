import {ICli, ICommand, ICommandInfos, IRequest, IResponse} from "../interfaces";
import * as console from "console";
import {CommandOption} from "./Command";

export abstract class AbstractCommand implements ICommand {
    protected commandName: string;
    protected commandDescription: string;
    protected arguments: CommandOption[] = [];

    public addArgument(name: string, description: string, type: string, required = false): void
    {
        this.arguments.push({name: name, description: description, type: type, required: required})
    }

    public getArguments(): CommandOption[] {
        return this.arguments
    }

    getInfos(): ICommandInfos {
        return {
            name: this.commandName,
            description: this.commandDescription,
        };
    }

    canHandleRequest(request: IRequest): boolean {
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

    async handleRequest(request: IRequest, cli: ICli): Promise<IResponse> {
        return new Promise<IResponse>((resolve, reject) => {
            reject('Unable to handle request.')
        })
    }
}