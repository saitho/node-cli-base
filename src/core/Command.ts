import {AbstractCommand} from "./AbstractCommand";
import {ICli, IRequest, IResponse} from "../interfaces";
import {SubCommand} from "./SubCommand";
import {ICommandWithSubcommands} from "../interfaces/ICommand";
import {ErrorResponse} from "./ErrorResponse";

export const SubMethods = Symbol('SubMethods'); // just to be sure there won't be collisions

export type CommandOption = {
    name: string;
    description: string;
    type: string;
    required: boolean;
}

export class Command extends AbstractCommand implements ICommandWithSubcommands {

    public async process(request: IRequest, cli: ICli): Promise<IResponse> {
        return new ErrorResponse(`process not implemented.`);
    }

    async handleRequest(request: IRequest, cli: ICli): Promise<IResponse> {
        const args = request.input.slice(1) // index 0 is current command name
        // Handle subcommands
        if (args.length && this.hasSubcommand(args[0])) {
            return this.callSubcommand(args[0], request, args.slice(1), cli)
        }
        return this.process(request, cli);
    }

    getSubcommands(): Map<string, SubCommand> {
        return this[SubMethods] || new Map<string, SubCommand>()
    }

    callSubcommand(name: string, request: IRequest, args: string[], cli: ICli): Promise<IResponse> {
        const subcommand = this.findSubcommand(name)
        const subRequest = {...request}
        subRequest.input = subRequest.input.slice(1) // 0 = command name
        if (!subcommand || !subcommand.canHandleRequest(subRequest)) {
            return new Promise<IResponse>((resolve, reject) => {
                reject('Unable to handle subcommand request.')
            })
        }

        subRequest.getArgument = (name: string): string|null => {
            for (const i in subcommand.getArguments()) {
                const option = subcommand.getArguments()[i]
                if (option.name === name) {
                    return subRequest?.input[1+Number(i)] || null
                }
            }
            return null
        }

        return this[subcommand.funcName](subRequest, args, cli)
    }

    findSubcommand(name: string): SubCommand|null {
        for (let subcommand of this.getSubcommands()) {
            if (subcommand[1].getInfos().name === name) {
                return subcommand[1]
            }
        }
        return null
    }

    hasSubcommand(name: string): boolean {
        return this.findSubcommand(name) !== null
    }

    getSubcommandsObj(propertyKey: string): SubCommand {
        // Todo: Use command object instead
        this[SubMethods] = this[SubMethods] || new Map<string, SubCommand>();

        if (!this[SubMethods].has(propertyKey)) {
            this[SubMethods].set(propertyKey, new SubCommand())
        }

        return this[SubMethods].get(propertyKey)
    }

    setSubcommandsObj(propertyKey: string, obj: SubCommand): void {
        this[SubMethods].set(propertyKey, obj);
    }
}