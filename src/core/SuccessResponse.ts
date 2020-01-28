import {IResponse} from "../interfaces";

export class SuccessResponse implements IResponse {
    constructor(message: string = null) {
        this.message = message;
    }
    public message: string;
}