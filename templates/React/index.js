import React from 'react'
import { render } from 'react-dom'
import ReactDOMServer from 'react-dom/server'
import Template from './template'
import { StaticRouter } from 'react-router'
import { BrowserRouter } from 'react-router-dom'

import Routes from './routes'

if (typeof document !== 'undefined') {
  const outlet = document.getElementById('outlet')
  render(
    <BrowserRouter>
      <Routes />
    </BrowserRouter>,
  outlet)
}

/////

export default (locals, callback) => {
  const location = (locals.path.indexOf('/index') === -1) ? locals.path.split('.')[0] : '/';
  const context = {}

  const html = ReactDOMServer.renderToStaticMarkup(
    <Template>
      <StaticRouter
        location={location}
        context={context}>
        <Routes />
      </StaticRouter>
    </Template>
  )
  callback(null, '<!DOCTYPE html>' + html)
}
