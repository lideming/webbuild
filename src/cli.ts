#!/usr/bin/node
import { cwd } from "process";
import { stat } from "fs/promises";
import { build, Config } from "./builder";

const configPath = cwd() + '/buildconfig.js';

stat(configPath).then((s) => {
    return s.isFile();
}, (e) => {
    if (e.code === 'ENOENT') {
        return false;
    }
}).then(s => {
    if (s) {
        return import(configPath).then(x => x.default)
    }
    return {};
}).then(c => {
    const config = c as Config;
    return build(config);
})