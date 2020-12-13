#ts-logger

An experimental logger library for NodeJS written in TypeScript (__working progress__).

## Use

```sh
$ npm install ts-logger
```

## Development

* Clone this repo `git clone https://github.com/cubodehelio/ts-logger.git`.
* Install deps: `npm install`
* typings install

## Transpile

Using `tsconfig.json` in the project root

```sh
$ node_modules/typescript/bin/tsc -p .
```


## Development in Visual Studio Code

+ Install `typings` globally in your system: `npm install typings -g`
+ Install the TypeScript definitions for the project running `typings install` command in the root.
+ Once in VSC you can build (and watch for changes) the code with `ctrl+shift+b` (`ctrl+shift+h` to see the output).

By now the vsc build task just fires `tcs -p .` command in the project root, which reads settings from `tsconfig.json` file.

-------------------------------------------------------------------------------

## TODO

+ Extend `ExpressRequest` type from node IncommingMessage (?).
+ Extend `ExpressResponse` type from node ServerResponse (?).
+ Make Grunt based build system for transpilation, release, etc..
+ Should the traspilation be made with babel?