import {ICli, AbstractCommand, IRequest, IResponse, SuccessResponse} from "..";

export class VersionCommand extends AbstractCommand {
    commandName = 'version';
    commandDescription = 'Displays version number of this tool';

    protected async process(request: IRequest, cli: ICli): Promise<IResponse> {
        return new SuccessResponse(`${cli.getPackageInfo().version}`);
    }
}