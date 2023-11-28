import {Cli, SuccessResponse, VersionCommand} from "../../src";
import {mock, instance, when} from 'ts-mockito';
import {Request} from "../../src/core/Request";

describe("VersionCommand", () => {
    it("shows version from package.json", async () => {
        const mockCli = mock(Cli);
        when(mockCli.getPackageInfo()).thenReturn({
            version: '1.2.3-test',
            description: '',
            name: '',
            bin: ''
        });

        const command = new VersionCommand();
        const request = new Request(['version'], null)
        const response = await command.handleRequest(request, instance(mockCli));
        expect(response).toBeInstanceOf(SuccessResponse);
        expect(response.message).toEqual('1.2.3-test');
    });
});