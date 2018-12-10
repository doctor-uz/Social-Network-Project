import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
//import Logo from "./logo";
import App from "./app";
import { composeWithDevTools } from "redux-devtools-extension";

//with Redux
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
// import componseWithDevTools from "redux-devtools-extension";
import reducer from "./reducer";
import { Provider } from "react-redux";

import initSocket from "./socket";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

let component;
if (location.pathname === "/welcome") {
    //render welcome
    component = <Welcome />;
} else {
    component = (initSocket(store),
    (
        <Provider store={store}>
            <App />
        </Provider>
    ));
}

//ReactDOM.render should only be called ones
//do not try to write this code in any other location
//because that is wrong

ReactDOM.render(component, document.querySelector("main"));
