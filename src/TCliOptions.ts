import {Opts as MinimistOptions} from "minimist";
import {BaseOption, OptionType} from "minimist-options";

interface CliBaseOption<TypeOptionType extends OptionType, DefaultOptionType>
    extends BaseOption<TypeOptionType, DefaultOptionType> {
    readonly description: string;
}

type MinimistOption = NonNullable<
    | MinimistOptions['stopEarly']
    | MinimistOptions['unknown']
    | MinimistOptions['--']
    >;

export type CliOptions<ArrayOptionContentType = unknown> = {
    [key: string]:
        | OptionType
        | CliBaseOption<'string', string>
        | CliBaseOption<'boolean', boolean>
        | BaseOption<'number', number>
        | BaseOption<'array', ReadonlyArray<ArrayOptionContentType>>
        | MinimistOption;  // Workaround for https://github.com/microsoft/TypeScript/issues/17867
};