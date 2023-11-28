import {IResponse, IRequest, ICli} from ".";

export interface ICommandProcess {
    process(request: IRequest, cli: ICli): Promise<IResponse>;
}