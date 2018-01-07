/**
 * MIT License http://www.opensource.org/licenses/mit-license.php
 * 
 * @author Kirk Bulis (kbulis)
 * 
 */
const loaderUtils = require('loader-utils');
const path = require('path');

/**
 * filter
 * 
 * Takes module source as text, finds "url()" patterns, then
 * replaces local paths with their corresponding data-to-base64
 * uri content representations.
 * 
 * Not a loader, rather a naiive, straightforward text filter.
 * 
 * @param {string} source 
 */
module.exports = function filter(source) {
  let parsing = locate(source), result = source;
  let options = loaderUtils.getOptions(this);

  for (let i = 0, n = parsing.urls.length; i < n; ++i) {
    const pos = parsing.urls[i];

    if (pos.start < pos.final) {
      let url = source.substring(pos.start, pos.final);

      if (url.startsWith('http') === false && url.startsWith('data') === false) {
        if (url.indexOf('?') > 0) {
          url = url.substr(0, url.indexOf('?'));
        }
  
        if (url.indexOf('#') > 0) {
          url = url.substr(0, url.indexOf('#'));
        }

        try {
          const translated = typeof(options.translate) === 'function' ? options.translate(url) : url;
          
          if (translated) {
            let mimeType = '';

            if (options.mimeTypes) {
              mimeType = options.mimeTypes[path.extname(translated)] || mimeType;
            }

            result = result.substr(0, pos.start) + 'data:' + mimeType + ';base64,' + this.fs.readFileSync(require.resolve(translated)).toString('base64') + result.substr(pos.final);

            this.addDependency(translated);
          }
        }
        catch (eX) {
          throw eX;
        }
      }
    }
  }

  return result;
}

/*
 * locate
 *
 * Works through module text to locate all url parameters
 * by position. Urls are captured and pushed into a stack.
 * This makes it easy to replace in the source via splice.
 * 
 * @param {string} source 
 */
function locate(source) {
  let m = 'c', s = -1, p = -1, output = { urls: [] };

  for (let i = 0, n = source.length; i < n; ++i) {
    let c = source[i];

    if (m === 'c') {
      if (c === 'u') {
        m = 'u';
        s = i;
      }
    }
    else
    if (m === 'u') {
      if (c === 'r') {
        m = 'r';
      }
      else {
        m = 'c';
        i = s;
        s = -1;
      }
    }
    else
    if (m === 'r') {
      if (c === 'l') {
        m = 'l';
      }
      else {
        m = 'c';
        i = s;
        s = -1;
      }
    }
    else
    if (m === 'l') {
      if (c === '(') {
        m = '(';
        p = i;
      }
      else {
        m = 'c';
        i = s;
        s = -1;
      }
    }
    else
    if (m === '(') {
      if (c === ')') {
        output.urls.unshift({
          start: p + 1,
          final: i,
        })

        m = 'c';
        p = -1;
        s = -1;
      }
    }
  }

  return output;
}
