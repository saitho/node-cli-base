import {Cli, SuccessResponse} from "../../src";
import {VersionCommand} from "../../src/commands/VersionCommand";
import {mock, instance, when} from 'ts-mockito';

describe("VersionCommand", () => {
    it("shows version from package.json", async () => {
        const mockCli = mock(Cli);
        when(mockCli.getPackageInfo()).thenReturn({
            version: '1.2.3-test'
        });

        const command = new VersionCommand();
        const response = await command.handleRequest({
            input: ['version'],
            flags: null
        }, instance(mockCli));
        expect(response).toBeInstanceOf(SuccessResponse);
        expect(response.message).toEqual('1.2.3-test');
    });
});