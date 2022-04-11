import 'babel-polyfill';
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';

import Contents from './Contents.jsx';

const element = (
  <Router>
    <Contents />
  </Router>
);

ReactDOM.render(element, document.getElementById('contents'));
