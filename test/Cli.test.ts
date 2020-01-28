import {Cli, IResponse, IRequest, AbstractCommand, SuccessResponse} from "../src";

describe("Cli", () => {
    it("register command and run it", async () => {
        const cli = new Cli('typo3-extension-release');
        cli.addCommand(new class extends AbstractCommand {
            commandName = 'test';
            commandDescription = 'just a test';
            protected async process(request: IRequest, cli: Cli): Promise<IResponse> {
                return new SuccessResponse("Test successful");
            }
        });
        process.argv = [
            'node',
            'typo3-extension-release test',
            'test'
        ];
        console.log = jest.fn();
        await cli.run();
        expect(console.log).toHaveBeenCalledWith('Test successful');
    });

    it("error when command is not found", async () => {
        const cli = new Cli('typo3-extension-release');
        cli.addCommand(new class extends AbstractCommand {
            commandName = 'test';
            commandDescription = 'just a test';
            protected async process(request: IRequest, cli: Cli): Promise<IResponse> {
                return new SuccessResponse("Test successful");
            }
        });
        process.argv = [
            'node',
            'typo3-extension-release othercommand',
            'othercommand'
        ];
        console.error = jest.fn();
        await cli.run();
        expect(console.error).toHaveBeenCalledWith('Command execution failed with the following error:\n\n' +
            'The requested command "othercommand" was not found.');
    });

    it("error when multiple commands match", async () => {
        const cli = new Cli('typo3-extension-release');
        const testCommand = new class extends AbstractCommand {
            commandName = 'test';
            commandDescription = 'just a test';
            protected async process(request: IRequest, cli: Cli): Promise<IResponse> {
                return new SuccessResponse("Test successful");
            }
        };
        cli.addCommand(testCommand);
        cli.addCommand(testCommand);
        process.argv = [
            'node',
            'typo3-extension-release test',
            'test'
        ];
        console.error = jest.fn();
        await cli.run();
        expect(console.error).toHaveBeenCalledWith('Command execution failed with the following error:\n\n' +
            'Multiple commands matching this call were found.');
    });
});