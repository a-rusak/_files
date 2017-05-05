import React from 'react'
import Slider from './../admission/slider'
import News from './news'
import Catalog from './../admission/catalog'
import data from './home.json'

const Home = () => (
  <main className="main-content" id="mainContent" role="main">
    <Slider />
    <News tabs={data.news.tabs} news={data.news.news} announcements={data.news.announcements} />
    <Catalog />
  </main>
)

export default Home