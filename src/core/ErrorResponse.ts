import {IResponse} from "../interfaces";

export class ErrorResponse implements IResponse {
    constructor(message: string) {
        this.message = message;
    }
    public message: string;
}