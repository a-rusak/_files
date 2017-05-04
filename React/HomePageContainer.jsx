import React from 'react';
import axios from 'axios';
//import Loader from './../common/loader.jsx';
import HomePage from './HomePage.jsx';

class HomePageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slider: [],
      topic: [],
      news: []
    };
  }

  componentDidMount() {
    Object.keys(this.state).map(key => {
      axios.get(`/api/${key}`)
        .then(response => {
          const obj = {};
          obj[key] = response.data.data;
          this.setState(obj);
        });
    });
  }

  render() {
    return (<HomePage {...this.state} />);
  }
}

export default HomePageContainer;
