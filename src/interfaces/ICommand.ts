import {IResponse, IRequest, ICommandInfos, ICli} from ".";
import {SubCommand} from "../core/SubCommand";

export interface ICommand {
    canHandleRequest(request: IRequest): boolean;
    handleRequest(request: IRequest, cli: ICli): Promise<IResponse>;
    getInfos(): ICommandInfos;
}

export interface ICommandWithSubcommands {
    getSubcommands(): Map<string, SubCommand>;
    hasSubcommand(name: string): boolean;
    callSubcommand(name: string, request: IRequest, args: string[], cli: ICli): Promise<IResponse>;
}