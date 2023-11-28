import {AbstractCommand} from "./AbstractCommand";
import {ICli, IRequest, IResponse} from "../interfaces";

export class SubCommand extends AbstractCommand {
    public funcName: string;

    public setDescription(description: string): void
    {
        this.commandDescription = description;
    }
    public setName(name: string): void
    {
        this.commandName = name;
    }

    async handleRequest(request: IRequest, cli: ICli): Promise<IResponse> {
        return new Promise<IResponse>((resolve, reject) => {
            reject('Unable to handle request. Use "callSubcommand" method on parent command.')
        })
    }
}