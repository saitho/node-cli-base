import {Options as MinimistOptions} from "minimist-options";

export interface IRequest {
    input: string[];
    flags: MinimistOptions;
    getArgument(name: string): string;
}