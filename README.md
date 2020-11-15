# `webbuild`

A build toolchain for Web frontend projects, based on Rollup and TypeScript.

It supports TypeScript with ES modules by default.

## Install

### Install to the project

```shell
$ npm i @yuuza/webbuild --save-dev
```

Add `scripts` in `package.json` to enable `npm run build`

```json
"scripts": {
    "build": "webbuild"
}
```

### Install as global tool

```shell
$ npm i -g @yuuza/webbuild
```

## Configure

It uses the `buildconfig.js` file as the configuration.

Example (also the default):
```js
module.exports = {
    input: './main.ts',
    output: {
        file: './bundle.js',
        minify: false,
    }
};
```

## Start build

```shell
$ npm run build
```
or
```shell
$ webbuild
```