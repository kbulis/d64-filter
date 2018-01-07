[![npm][npm]][npm-url] [![deps][deps]][deps-url]

# d64-filter
Simple "url()" pattern matcher with data-as-base64 (d64) uri replacement.

## Install
Include with "npm install" or "yarn add":

```bash
yarn add d64-filter --dev
```

## Usage
Don't use this as a loader, rather incorporate in your webpack.config.js rules
when you want a simple, naiive, straightforward text replacement of every local
"url(...)" with the file's contents as a data-uri base64 string.

```javascript
// webpack.config.js

module.exports = {

  // ...

  module: {
    rules: [
      // ...

      {
        test: /semantic.min.css$/,
        use: [
          'raw-loader',
          {
            loader: 'd64-filter',
            options: {
              translate: function(url) {
                return 'semantic-ui-css/' + url;
              },
              mimeTypes: {
                '.eot': 'font/eot',
                '.jpeg': 'image/jpeg',
                '.jpg': 'image/jpeg',
                '.otf': 'font/otf',
                '.png': 'image/png',
                '.svg': 'image/svg',
                '.ttf': 'font/ttf',
                '.woff': 'font/woff',
                '.woff2': 'font/woff2',
              }
            }
          }
        ]
      },

      // ...
    ]
  }
}
```

The translate function allows you to scrutinize the current local module url
and return with a translated url to be resolved for file reading. Note that
if the source module's url() starts with "http" or "data", we don't replace
it with its content.

[npm]: https://img.shields.io/npm/v/d64-filter.svg
[npm-url]: https://npmjs.com/package/d64-filter

[deps]: https://david-dm.org/kbulis/d64-filter.svg
[deps-url]: https://david-dm.org/kbulis/d64-filter
