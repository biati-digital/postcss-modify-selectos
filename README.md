# PostCSS Modify Selectors

Post CSS plugin to modify CSS selectors, you can replace, modify or simply add a prefix and suffix. You can match a selector using a simple string compare, a regular expression and even a function.

## Installation

```bash
$ npm i modify-selectors --save-dev
```


## Usage

```javascript
const postcss = require("postcss");

postcss([
    require("modify-selectors")({
        enable: true,
        replace: [
            {
                match: 'body',
                with: '.replacedBody',
            },
            {
                match: /wrapper|wrapperContainer/,
                with: '.container',
            }
        ],
        modify: [],
        prefix: [],
        modify: [],
    })
]).process(cssCode).then((result) => {
    console.log(result.css);
});
```

## Match a selector

When your CSS file is processed PostCSS loops all selectors in the file so you can modify them. Please take a looks at the examples below to learn how to check for selectors.

```css
/*Imagine you have the following CSS code*/
html {
    color: red;
}
body {
    font-size: 12px;
}
.container {
    max-width: 960px;
}
```

```javascript
match: '*', // it matches every single selector
match: 'body', // match the body selector
match: /html|body/, // you can use a regular expression, this will match html and body
match: (selector) => {
    // you can use a function to verify the selector, if it returns true, the selector will be processed
    return selector.includes(':hover');
},
```


## Replace

You can replace selectors completely, for example:

```javascript
postcss([
    require("modify-selectors")({
        enable: true,
        replace: [
            {
                match: 'body',
                with: '.replacedBody', //body will be replaced with .replacedBody
            },
            {
                match: 'textarea',
                with: 'textarea.small', //textarea will be replaced with textarea.small
            }
        ],
    })
]).process(cssCode).then((result) => {
    console.log(result.css);
});
```


## Modify

You can modify selectors, for example:

```javascript
postcss([
    require("modify-selectors")({
        enable: true,
        modify: [
            {
                match: '*', // run in every selector
                with: (selector) => {
                    return selector.replace('::before', '::after')
                },
            },
            {
                match: (selector) => {
                   // or run in selectors with :hover
                   return selector.includes(':hover');
                },
                with: (selector) => {
                    return selector.replace('::before', '::after')
                },
            },
        ],
    })
]).process(cssCode).then((result) => {
    console.log(result.css);
});
```



## Prefix

```javascript
postcss([
    require("modify-selectors")({
        enable: true,
        prefix: [
            {
                match: '*',
                with: '.myapp', // every selector will be prefixed with .myapp, for example: .myapp h1, .myapp p, etc.
            },
        ],
    })
]).process(cssCode).then((result) => {
    console.log(result.css);
});
```


## Suffix

```javascript
postcss([
    require("modify-selectors")({
        enable: true,
        suffix: [
            {
                match: '*',
                with: ' > *', // every selector will be suffixed with > *, for example: ul li > *
            },
        ],
    })
]).process(cssCode).then((result) => {
    console.log(result.css);
});
```
