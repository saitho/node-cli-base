import {ICommandInfos} from "./ICommandInfos";
import {Options} from "../core";

export type PackageInfo = {
    name: string;
    description: string;
    version: string;
    bin: string | Partial<Record<string, string>>;
}

export interface ICli {
    getBinaryName(): string;
    getAvailableCommands(): ICommandInfos[];
    getPackageInfo(): PackageInfo|null;
    getOptions(): Options;
}