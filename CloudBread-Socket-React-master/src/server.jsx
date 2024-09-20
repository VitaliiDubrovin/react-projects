/* eslint no-console: 0 */
import { resolve } from 'path';
import express from 'express';
import React from 'react';
import { match, RouterContext, createMemoryHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import createStore from 'redux/createStore';
import reducer from 'redux/reducer';
import fetchComponent from 'redux/fetchComponent';
import routes from 'routes';
import Html from 'components/Html';
import { initDOM, setStore } from 'lib/context';
import api from 'api';
import assets from './assets.json';

const ROOT = resolve(__dirname, '.');
const app = express();
app.use(express.static(`${ROOT}/public`));

if (__DEV__) {
  app.use((req, res, next) => {
    console.log(req.url);
    return next();
  });
}

app.use('/api', api);

app.get('*', (req, res) => {
  const memoryHistory = createMemoryHistory(req.path);
  const store = createStore(memoryHistory, reducer);
  const history = syncHistoryWithStore(memoryHistory, store);
  setStore(store);
  match({ history, routes, location: req.url }, async (error, redirectLocation, renderProps) => {
    try {
      if (error) {
        res.status(500).send(error.message);
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        initDOM(req);
        await fetchComponent(store.dispatch, renderProps.components, renderProps.params);
        const content = renderToString((
          <Provider store={store}>
            <RouterContext {...renderProps} />
          </Provider>
        ));
        res.status(200).send(
          `<!doctype html>` + // eslint-disable-line
          renderToStaticMarkup((
            <Html
              store={store}
              assets={assets}
            >
              {content}
            </Html>
          ))
        );
      } else {
        res.status(404).send('Not found');
      }
    } catch (err) {
      console.log(err.stack);
      res.status(500).send('server error');
    }
  });
});

const server = app.listen(process.env.PORT || __PORT__, () => {
  const { port } = server.address();
  console.log(`The server is listening at http://localhost:${port}`);
  if (__DEV__) {
    console.log('__DEV_START__');
  }
});

export const io = require('socket.io')(server);
