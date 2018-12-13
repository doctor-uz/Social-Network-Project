import React from "react";
import Registration from "./registration";
import Login from "./login";
//react router: HashRouter, BrowserRouter
import { HashRouter, Route } from "react-router-dom";
import Logo from "./logo";

export default function Welcome() {
    return (
        <div>
            <div className="nav">
                <Logo className="logo" />
                <dir className="welcomediv">
                    <h5 className="welcome">Welcom to DR+</h5>
                </dir>
            </div>
            <div className="welcome-container1">
                <div className="welcome-container">
                    <HashRouter>
                        <div>
                            <Route exact path="/" component={Registration} />
                            <Route path="/login" component={Login} />
                        </div>
                    </HashRouter>
                </div>
            </div>
        </div>
    );
}
