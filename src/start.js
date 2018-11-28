import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";
import Logo from "./logo";

// import Hello from "./hello";

//ReactDOM.render should only be called ones
//do not try to write this code in any other location
//because that is wrong

let component;
if (location.pathname == "/welcome") {
    //render welcome
    component = <Welcome />;
}

if (location.pathname == "/") {
    //render welcome
    component = <Logo />;
}

ReactDOM.render(component, document.querySelector("main"));
