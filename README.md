# @saithodev/cli-base

[![Build Status](https://github.com/saitho/node-cli-base/actions/workflows/test.yml)](https://github.com/saitho/node-cli-base/actions/workflows/test.yml/badge.svg)
[![npm version](https://img.shields.io/npm/v/@saithodev/cli-base.svg)](https://www.npmjs.com/package/@saithodev/cli-base)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=saitho_node-cli-base&metric=coverage)](https://sonarcloud.io/dashboard?id=node-cli-base)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

This package provides a basic API for creating CLI-based packages.

## Example

The following example will add two commands "help" and "version".

index.ts
```typescript
import {Cli, HelpCommand, VersionCommand} from "@saithodev/cli-base";

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
```

Compile sources and test it with `dist/index.js help` and `dist/index.js version`.

For details on how to implement custom commands, take a closer look at the example and the command classes used there.