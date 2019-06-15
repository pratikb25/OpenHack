import React, { Component } from 'react';
import Main from './component/Main';
import {BrowserRouter} from 'react-router-dom';
import './App.css';
// const composePlugin = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const Middleware= [thunk];

// const store = createStore(reducer, compose(applyMiddleware(...Middleware),window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()));
class App extends Component {
  render() {
    return (
      // <Provider store={store}>
      <BrowserRouter>
      <div>
        {/* App Component Has a Child Component called Main*/}
        <Main />
      </div>
    </BrowserRouter>
    
    // </Provider>
    );
  }
}

export default App;
