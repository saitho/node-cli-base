import {ICommandInfos} from "./ICommandInfos";
import * as readPkg from 'read-pkg-up';

export interface ICli {
    getBinaryName(): string;
    getAvailableCommands(): ICommandInfos[];
    getPackageInfo(): readPkg.PackageJson;
}