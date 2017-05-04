import React from 'react';
import { Link } from 'react-router';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';
import Slider from './slider/slider.jsx';
import Topic from './topic/topic.jsx';
//import Glyphicon from 'react-bootstrap/lib/Glyphicon';

import './HomePage.less';

class HomePage extends React.Component {

  render() {

    const CSS_NAME = "l-home-page";
    const css = {
      name: CSS_NAME,
      jumbotron: CSS_NAME + "__jumbotron",
      title: CSS_NAME + "__title",
      slogan: CSS_NAME + "__slogan",
      topic: CSS_NAME + "__topic",
      news: CSS_NAME + "__news"
    };

    return (
      <div className={css.name}>

        <Jumbotron className={css.jumbotron}>
          <Grid>
            <Row>
              <Col sm={6}>
                <h1 className={css.title}>
                  <span>САНКТ-ПЕТЕРБУРГСКИЙ ГОСУДАРСТВЕННЫЙ</span>
                  <span>ТЕХНИЧЕСКИЙ УНИВЕРСИТЕТ</span>
                </h1>
              </Col>
              <Col sm={6}>
                <Slider data={this.props.slider} />
              </Col>
            </Row>
          </Grid>
        </Jumbotron>

        <div className={css.slogan}>
          <Grid><img alt="" src="/images/piter_the_great.jpg" className="img-responsive" /></Grid>
        </div>

        <Grid className={css.topic}>
          <Topic data={this.props.topic} />
        </Grid>

        <div className={css.news}>
          <Grid>
            <Row>
              <Col sm={4}>
                <h3><Link to="/news">Новости</Link></h3>
                <ul className="list-unstyled">
                  {this.props.news.map(
                    item =>
                      <li key={item.id}>
                        <hr />
                        <p className="small">{item.date}</p>
                        <p><Link to={`/news/${item.id}`}>{item.title}</Link></p>
                      </li>
                  )}
                </ul>
              </Col>
              <Col sm={4}>
                <h3>Фотолента</h3>
              </Col>
              <Col sm={4}>
                <h3>Информация подразделений</h3>
              </Col>
            </Row>
          </Grid>
        </div>

      </div>
    );
  }
}

HomePage.propTypes = {
  slider: React.PropTypes.array.isRequired,
  topic: React.PropTypes.array.isRequired,
  news: React.PropTypes.array.isRequired
};

export default HomePage;
