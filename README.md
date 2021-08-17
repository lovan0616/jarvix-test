# front-end

## Requirements
- NodeJS: v14.17.3
- PNPM: v6.10.3

## Be aware of
- i18n 語系檔內的新增字串時避免以空格字元結尾，在轉換為 `.properties` 的過程有可能丟失
## Project setup
```
pnpm install
```

### Compiles and hot-reloads for development
```
pnpm run serve
```

Apply `webpack-bundle-analyzer` plugin.
```
pnpm run serve -- --analyzer
```

### Compiles and minifies for production
```
pnpm run build
```

Apply `webpack-bundle-analyzer` plugin.
```
pnpm run build -- --analyzer
```

### Run your unit tests
```
pnpm run test:unit
```

### Run your end-to-end tests
```
pnpm run test:e2e
```

### Lints and fixes files
```
pnpm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
