import React from "react";
import Registration from "./registration";
import Login from "./login";
//react router: HashRouter, BrowserRouter
import { HashRouter, Route } from "react-router-dom";

export default function Welcome() {
    return (
        <div className="welcome-container">
            <h1>Welcome!</h1>

            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>
        </div>
    );
}
