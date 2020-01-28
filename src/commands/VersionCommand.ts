import {Cli, AbstractCommand, IRequest, IResponse, SuccessResponse} from "..";

export class VersionCommand extends AbstractCommand {
    commandName = 'version';
    commandDescription = 'Displays version number of this tool';

    protected async process(request: IRequest, cli: Cli): Promise<IResponse> {
        return new SuccessResponse(`${cli.getPackageInfo().version}`);
    }
}