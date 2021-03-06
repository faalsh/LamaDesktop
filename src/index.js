import React from 'react';
import ReactDOM from 'react-dom';
import App from './web/containers/App'
import {Provider} from 'react-redux'
import store from './common/store'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  , document.getElementById('root'))
