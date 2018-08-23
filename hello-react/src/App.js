import React, { Component } from 'react';
import styles from './App.scss';
import classNames from 'classnames/bind';
import Button from './Button'


const cx = classNames.bind(styles);

class App extends Component {
  render() {
    

    return(

      <Button>버튼</Button>
    );

  }
}

export default App;
