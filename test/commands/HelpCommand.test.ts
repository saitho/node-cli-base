import {mock, instance, when} from 'ts-mockito';
import {Cli, SuccessResponse, HelpCommand} from "../../src";
import {Request} from "../../src/core/Request";

describe("HelpCommand", () => {
    it("shows available commands and options", async () => {
        const mockCli = mock(Cli);
        when(mockCli.getBinaryName()).thenReturn('test-binary');
        when(mockCli.getPackageInfo()).thenReturn({
            description: 'Package-description',
            version: '',
            name: '',
            bin: ''
        });
        when(mockCli.getAvailableCommands()).thenReturn([
            {name: 'test1', description: 'First test command'},
            {name: 'test2', description: 'Second test command'},
        ]);
        when(mockCli.getOptions()).thenReturn({
            'dry-run': {
                type: 'boolean',
                default: false,
                alias: 'd',
                description: 'Simulates changes without writing them'
            },
            'sanitize': {
                type: 'boolean',
                default: true,
                description: 'Do not sanitize output'
            }
        });

        const command = new HelpCommand();
        const request = new Request(['help'], null)
        const response = await command.handleRequest(request, instance(mockCli));

        const expectedOutput = `Package-description

  Usage
   $ test-binary [command]
    
  Available commands
   test1: First test command
   test2: Second test command

  Available options:
   --dry-run, -d  Simulates changes without writing them
   --no-sanitize  Do not sanitize output
`;

        expect(response).toBeInstanceOf(SuccessResponse);
        expect(response.message).toEqual(expectedOutput);
    });

    it("shows available commands and no options when none are configured", async () => {
        const mockCli = mock(Cli);
        when(mockCli.getBinaryName()).thenReturn('test-binary');
        when(mockCli.getPackageInfo()).thenReturn({
            description: 'Package-description',
            version: '',
            name: '',
            bin: ''
        });
        when(mockCli.getAvailableCommands()).thenReturn([
            {name: 'test1', description: 'First test command'},
            {name: 'test2', description: 'Second test command'},
        ]);
        when(mockCli.getOptions()).thenReturn({});

        const command = new HelpCommand();
        const request = new Request(['help'], null)
        const response = await command.handleRequest(request, instance(mockCli));

        const expectedOutput = `Package-description

  Usage
   $ test-binary [command]
    
  Available commands
   test1: First test command
   test2: Second test command
`;

        expect(response).toBeInstanceOf(SuccessResponse);
        expect(response.message).toEqual(expectedOutput);
    });
});