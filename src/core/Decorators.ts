import {Command} from "./Command";

// Class decorator
export function command(name: string, description: string) {
    return function (constructor: Function) {
        constructor.prototype.commandName = name
        constructor.prototype.commandDescription = description
    }
}

export function description(description: string) {
    return function (target: Command, propertyKey: string, descriptor: PropertyDescriptor) {
        const obj = target.getSubcommandsObj(propertyKey);
        obj.setDescription(description);
        target.setSubcommandsObj(propertyKey, obj);
    };
}

export function name(name: string) {
    return function (target: Command, propertyKey: string, descriptor: PropertyDescriptor) {
        const obj = target.getSubcommandsObj(propertyKey);
        obj.setName(name);
        obj.funcName = descriptor.value.name
        target.setSubcommandsObj(propertyKey, obj);
    };
}

export function argument(name: string, description: string, type: string, required = false) {
    return function (target: Command, propertyKey: string, descriptor: PropertyDescriptor) {
        const obj = target.getSubcommandsObj(propertyKey);
        obj.addArgument(name, description, type, required);
        target.setSubcommandsObj(propertyKey, obj);
    };
}
