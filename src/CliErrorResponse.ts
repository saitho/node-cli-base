import {ICliResponse} from "./ICliResponse";

export class CliErrorResponse implements ICliResponse {
    constructor(message: string) {
        this.message = message;
    }
    public message: string;
}