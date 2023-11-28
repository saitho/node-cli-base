import {IRequest, IResponse, SuccessResponse, ICli} from "..";
import {name, command, description, argument} from "../core/Decorators";
import {Command} from "../core/Command";

@command('test', 'Testing command annotations :)')
export class TestCommand extends Command {
    @name('test1')
    @description('Test description 1')
    @argument('arg1', 'arg1', 'string', true)
    public async func1(request: IRequest, cli: ICli): Promise<IResponse> {
        return new SuccessResponse('Response from func1 - arg1: ' + request.getArgument('arg1'));
    }
}