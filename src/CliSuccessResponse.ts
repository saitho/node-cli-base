import {ICliResponse} from "./ICliResponse";

export class CliSuccessResponse implements ICliResponse {
    constructor(message: string = null) {
        this.message = message;
    }
    public message: string;
}