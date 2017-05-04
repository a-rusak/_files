/* eslint no-unused-vars: "off" */
import 'Styles/common.less';

import 'Components/main-content/main-content.less';
import 'Components/breadcrumbs/breadcrumbs.less';
import 'Components/card/card.less';
import 'Components/page-nav/page-nav.less';
import 'Components/figure/figure.less';

//import 'babel-polyfill';
import 'WebComponents/greedy-nav';
import { LightboxWidget } from 'WebComponents/lightbox';
import { A11y } from 'WebComponents/a11y';

const a11y = new A11y();
a11y.init();

import Promise from 'babel-runtime/core-js/promise'; 
if (!window.Promise) {
  window.Promise = Promise;
}

const lightbox = new LightboxWidget();
lightbox.init();

const iconsContext = require('bundle-loader?lazy&name=entry-icons!./icons');
window.addEventListener("load", () => {
  iconsContext(() => {});
});