import {Opts as MinimistOptions} from "minimist";
import {BaseOption as MinimalistBaseOption, OptionType} from "minimist-options";

interface BaseOption<TypeOptionType extends OptionType, DefaultOptionType>
    extends MinimalistBaseOption<TypeOptionType, DefaultOptionType> {
    readonly description: string;
}

type MinimistOption = NonNullable<
    | MinimistOptions['stopEarly']
    | MinimistOptions['unknown']
    | MinimistOptions['--']
    >;

export type Options<ArrayOptionContentType = unknown> = {
    [key: string]:
        | OptionType
        | BaseOption<'string', string>
        | BaseOption<'boolean', boolean>
        | BaseOption<'number', number>
        | BaseOption<'array', ReadonlyArray<ArrayOptionContentType>>
        | MinimistOption;  // Workaround for https://github.com/microsoft/TypeScript/issues/17867
};