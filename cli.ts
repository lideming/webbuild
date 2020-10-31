#!/usr/bin/node
import { cwd } from "process";
import { build, Config } from "./builder";

import(cwd() + '/buildconfig.js').then(c => {
    const config = c.default as Config;
    return build(config);
});