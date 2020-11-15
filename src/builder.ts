import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import cssLoader from './cssLoader';
import fs from 'fs/promises';
import { cwd } from 'process';
import { InputOption, OutputOptions, rollup, watch, RollupOptions, RollupBuild } from 'rollup';
import { terser } from 'rollup-plugin-terser';

export interface Config extends Partial<Omit<RollupOptions, 'output'>> {
    output?: string | OutputConfig | OutputConfig[];
}

export interface OutputConfig extends Partial<OutputOptions> {
    minify?: boolean;
}

export async function build(config: Config, watchMode = false) {
    const input = config.input ?? './main.ts';

    const plugins = config.plugins ?? [];
    plugins.unshift(
        nodeResolve(),
        typescript({
            target: 'es2015', module: 'es2015', moduleResolution: 'node'
        }),
        cssLoader(),
    );

    let output = config.output ?? {};
    if (typeof output === 'string') {
        output = { file: output };
    }
    if (!(output instanceof Array)) {
        output = [output];
    }
    output = output.map(o => {
        const { minify, ...rest } = o;
        const plugins = rest.plugins ?? [];
        if (minify) plugins.push(terser());
        return { file: './bundle.js', format: 'umd', ...rest, plugins };
    });

    const finalConfig: RollupOptions = { context: 'this', ...config, input, plugins, output };
    const result = await rollup(finalConfig);

    await writeBundle(output, result);
    if (watchMode) {
        // TODO: TypeScript watching is broken
        const watcher = watch(finalConfig);
        watcher.addListener("event", (ev) => {
            console.info("watcher event", ev.code);
            // if (ev.code == "BUNDLE_END") {
            //     writeBundle(output as any, ev.result).then(() => {
            //         console.log("Bundle completed");
            //     });
            // }
        });
    }
};
async function writeBundle(outputConfig: OutputConfig[], result: RollupBuild) {
    await Promise.all(outputConfig.map(o => result.write(o)));
}

