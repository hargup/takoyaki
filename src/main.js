/**
 * Takoyaki Application Endpoint
 * ==============================
 *
 * File simply loading the client application.
 */
import React from 'react';
import {render} from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {Provider} from 'react-redux';
import Application from './components/Application';
import reducer from './modules';
import localStorageMiddleware from './middlewares/local-storage';
import {actions as globalActions} from './modules/global';

// Requiring style
import '../style/app.scss';

// Mount node
const MOUNT_NODE = document.getElementById('app');

// Creating redux store
const STORE = createStore(
  reducer,
  applyMiddleware(thunk, localStorageMiddleware)
);
window.STORE = STORE;

STORE.dispatch(globalActions.init());

// Function rendering the application
function renderApplication(Component) {
  const block = (
    <Provider store={STORE}>
      <Component />
    </Provider>
  );

  render(block, MOUNT_NODE);
}

// First render
renderApplication(Application);

// Handling HMR
if (module.hot) {

  // Reloading components
  module.hot.accept('./components/Application', () => {
    const NextApplication = require('./components/Application').default;
    renderApplication(NextApplication);
  });

  // Reloading reducers
  module.hot.accept('./modules', () => {
    const nextReducer = require('./modules').default;
    STORE.replaceReducer(nextReducer);
  });
}
