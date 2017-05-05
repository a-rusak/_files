# Файлы с примерами кода из разных проектов
1. `/build` - автоматизация сборки статики.
    * [`Gruntfile.js`](/build/Gruntfile.js) - nunjucks, svgstore;
    * [`gulpfile.js`](/build/gulpfile.js) - AngularJS SPA, environments, templatecache, cachbusting;
    * [`webpack1.config.js`](/build/webpack1.config.js) - React SPA;
    * [`webpack2.config.js`](/build/webpack2.config.js) - v.2, nunjucks, lazy load, chunkhash, svg-sprite.

1. `/CSS` - BEM with namespaces<sup>[1]</sup>.
    * [`figure-list.less`](/CSS/figure-list.less);
    * [`grid.less`](/CSS/grid.less);
    * [`main-nav.less`](/CSS/main-nav.less).

1. `/ES2015` - Modern JavaScript.
    * [`index.js`](/ES2015/index.js);
    * [`a11y.js`](/ES2015/a11y.js) - toggle contrast scheme, control text size, turn on/off photos;
    * [`calculator.js`](/ES2015/calculator.js) - simple form for calculate points;
    * [`lightbox.js`](/ES2015/lightbox.js) - photogallery with lazy load.

1. `/templates`
    * [`Nunjucks`](/templates/Nunjucks) - templates used for build `HTML`;
    * [`React`](/templates/React) - use Stateless Functional Components<sup>[2]</sup> as templates to build `HTML` with Static Site Generator Webpack Plugin<sup>[3]</sup>.

1. [`/React`](/React) - SPA prototype, API mocked with `Express` app.

1. `/AngularJS`
    * [`company-name.js`](/AngularJS/company-name.js) - custom control for edit company name right before doing the payment
    * [`register.js`](/AngularJS/register.js) - Register wizard page


[1]: https://csswizardry.com/2015/03/more-transparent-ui-code-with-namespaces/

[2]: https://hackernoon.com/react-stateless-functional-components-nine-wins-you-might-have-overlooked-997b0d933dbc

[3]: https://github.com/markdalgleish/static-site-generator-webpack-plugin