import React from 'react'
import BEMHelper from 'react-bem-helper';
import {data} from './data.json'
import './slider.less'

const classes = new BEMHelper({name: 'admission-slider', prefix: 'c-'});

const Slider = () => (
  <div {...classes('', '', 'swiper-container')}>
    <div className="swiper-wrapper">
      {data.map((item, index) => (
        <div
          {...classes('slide', '', ['swiper-slide', 'swiper-lazy'])}
          key={index}
          data-background={`/images/admission/slider/${item.src}.jpg`}>
          <div className="l-container">
            <Slide data={item}/>
          </div>
          <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
        </div>
      ))}
    </div>
    <div className="swiper-pagination swiper-pagination-white"></div>
    <div className="swiper-button-prev swiper-button-white"></div>
    <div className="swiper-button-next swiper-button-white"></div>
  </div>
)

const Slide = (data) => (
  <div className="l-grid">
    <div {...classes('str', '', ['l-grid__flex', 'l-grid__flex--col'])}>
      <section {...classes('str-top', '', 'l-grid__element')}>
        <h1 {...classes('title')}>
          <a href={data.data.href} dangerouslySetInnerHTML={markup(data.data.title)}></a>
        </h1>
      </section>
      <section {...classes('str-bottom', '', 'l-grid__element')}>
        <div {...classes('info', '', 'l-grid__content')}>

          <div
            {...classes('summary')}
            dangerouslySetInnerHTML={markup(data.data.summary)}></div>

          {data.data.details.length > 0 && <Details data={data.data.details}/>}

          <p {...classes('button')}>
            <a
              href={data.data.href}
              className="c-button c-button--border c-button--accent-blue">{data.data.button}</a>
          </p>

        </div>
      </section>
    </div>
  </div>
)

const Details = (data) => (
  <ul {...classes('details')}>
    {data.data.map((item, index) => (
      <li {...classes('details-item')} key={index}>
        <strong>{item.label}</strong>: <span>{item.text}</span>
      </li>
    ))}
  </ul>
)

const markup = (data) => {
  return {__html: data}
}

export default Slider
