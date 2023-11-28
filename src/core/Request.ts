import {IRequest} from "../interfaces";
import {Options as MinimistOptions} from "minimist-options";

export class Request implements IRequest
{
    flags: MinimistOptions;
    input: string[] = [];

    constructor(input: string[], flags: MinimistOptions) {
        this.input = input
        this.flags = flags
    }

    getArgument(name: string): string|null {
        if (name in this.input) {
            return this.input[name] || null
        }
        return null
    }
}