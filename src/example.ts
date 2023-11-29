import {Cli, HelpCommand, VersionCommand} from "./index";

new Cli('typo3-extension-release')
    .setOptions({
        'dry-run': {
            type: 'boolean',
            default: false,
            alias: 'd',
            description: 'Simulates changes without writing them'
        }
    })
    .addCommand(new HelpCommand()) // adds help command
    .addCommand(new VersionCommand()) // adds version command
    .run()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });