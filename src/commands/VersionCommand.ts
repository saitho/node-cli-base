import {ICli, IRequest, IResponse, SuccessResponse, ICommandProcess} from "..";
import {Command} from "../core/Command";

export class VersionCommand extends Command implements ICommandProcess {
    commandName = 'version';
    commandDescription = 'Displays version number of this tool';

    public async process(request: IRequest, cli: ICli): Promise<IResponse> {
        return new SuccessResponse(`${cli.getPackageInfo().version}`);
    }
}