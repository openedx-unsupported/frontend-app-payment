import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunkMiddleware from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { createLogger } from 'redux-logger';

import createRootReducer from '../data/reducers';
import rootSaga from '../data/sagas';

export default function configureStore(initialState = {}) {
  const history = createBrowserHistory();

  const loggerMiddleware = createLogger({
    collapsed: true,
  });
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    createRootReducer(),
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware, sagaMiddleware, loggerMiddleware)), // eslint-disable-line
  );

  sagaMiddleware.run(rootSaga);

  return { store, history };
}
