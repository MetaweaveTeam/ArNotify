# arNotify


## Getting started

1. `$ npm i`
2. `$ npm run dev`

## Theme guidelines

### Fonts

- text: Arial
- txid: monospace
- wallet key: monospace

### Colors

buttons & links:

- primary: #bc00ff
- secondary: #f817b5

Backgrounds & text:

- white: #ffffff
- white alt: #f9f9f9
- white alt 2: #f3f4ff
- black: #000000
- black alt: #18152e
- black alt 2: #0c0e33

## Resources and configurations

- SDK generated with [`npm init vue`](https://github.com/vuejs/create-vue/tags)
- dev server: [Vite](https://vitejs.dev/config/)

### Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.
