import {ICliRequest} from "./ICliRequest";
import {ICliResponse} from "./ICliResponse";
import {Cli} from "./Cli";
import {ICommandInfos} from "./ICommandInfos";

export interface ICliCommand {
    canHandleRequest(request: ICliRequest): boolean;
    handleRequest(request: ICliRequest, cli: Cli): Promise<ICliResponse>;

    getInfos(): ICommandInfos;
}