import {IResponse, IRequest, ICommandInfos, ICli} from ".";

export interface ICommand {
    canHandleRequest(request: IRequest): boolean;
    handleRequest(request: IRequest, cli: ICli): Promise<IResponse>;
    getInfos(): ICommandInfos;
}