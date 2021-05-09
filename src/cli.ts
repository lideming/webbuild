#!/usr/bin/node
import { cwd } from "process";
import { stat } from "fs/promises";
import { build, Config } from "./builder";

const configPath = cwd() + '/buildconfig.js';

async function main() {
    switch (process.argv[2]) {
        case undefined:
        case "build":
            await cliBuild(false);
            break;
        case "watch":
            await cliBuild(true);
            break;
        default:
            console.error(`Unknown sub-command "${process.argv[2]}"`);
            help();
    }
}

async function cliBuild(watchMode: boolean) {
    let configFileExists = false;
    try {
        configFileExists = (await stat(configPath)).isFile();
    } catch (e) { }

    let config = {};
    if (configFileExists) {
        config = (await import(configPath)).default;
    }

    if (!(config instanceof Array))
        config = [config]
    await Promise.all((config as any[]).map(x => build(x, watchMode))) as any;
}

function help() {
    console.info(`
Usage: webbuild <sub-command>

Sub-commands:
    build   - Build the project under the current directory
    watch   - Build it and watch for changes
    `.trim())
}

main();
