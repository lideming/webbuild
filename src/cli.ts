#!/usr/bin/node
import { cwd } from "process";
import { stat } from "fs/promises";
import { build, Config } from "./builder";

const configPath = cwd() + '/buildconfig.js';

async function main() {
    let watchMode = false;

    switch (process.argv[2]) {
        case undefined:
        case "build":
            break;
        case "watch":
            watchMode = true;
            break;
        default:
            throw new Error(`Unknown sub-command "${process.argv[2]}"`);
    }


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

main();
