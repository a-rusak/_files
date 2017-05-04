# Файлы с примерами кода из разных проектов
1. `/build` - автоматизация сборки статики.
    1. [`Gruntfile.js`](/build/Gruntfile.js) - nunjucks, svgstore;
    1. [`gulpfile.js`](/build/gulpfile.js) - AngularJS SPA, environments, templatecache, cachbusting;
    1. [`webpack1.config.js`](/build/webpack1.config.js) - React SPA;
    1. [`webpack1.config.js`](/build/webpack2.config.js) - v.2, nunjucks, lazy load, chunkhash, svg-sprite.

1. `/CSS` - BEM with namespaces[1].
    1. [`figure-list.less`](/CSS/figure-list.less);
    1. [`grid.less`](/CSS/grid.less);
    1. [`main-nav.less`](/CSS/main-nav.less).

1. `/ES2015` - Modern JavaScript.
    1. [`index.js`](/ES2015/index.js);
    1. [`a11y.js`](/ES2015/a11y.js) - toggle accessibility mode: toggle contrast scheme, control text size, turn on/off photos;
    1. [`calculator.js`](/ES2015/calculator.js) - simple form for calculate points;
    1. [`lightbox.js`](/ES2015/lightbox.js) - photogallery with lazy load.

1. `/templates`
    1. [`Nunjucks`](/templates/Nunjucks) - templates used for build `HTML`;
    1. [`React`](/templates/React) - use Stateless Functional Components[2] as templates to build `HTML` with Static Site Generator Plugin.

1. [`/React`](/React) - SPA prototype, API mocked with `Express` app.

1. `/AngularJS`
    1. [`company-name.js`](/AngularJS/company-name.js) - custom control for edit company name right before doing the payment
    1. [`register.js`](/AngularJS/register.js) - Register wizard page


[1] [More Transparent UI Code with Namespaces](https://csswizardry.com/2015/03/more-transparent-ui-code-with-namespaces/)

[2] [React Stateless Functional Components: Nine Wins You Might Have Overlooked](https://hackernoon.com/react-stateless-functional-components-nine-wins-you-might-have-overlooked-997b0d933dbc)