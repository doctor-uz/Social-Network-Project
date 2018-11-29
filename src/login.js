import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        // console.log("handle Change running!", e.target.value);
        // console.log("name of input: ", e.target.name);

        this.setState(
            {
                [e.target.name]: e.target.value
            },
            () => console.log("this state in handle change: ", this.state)
        );
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log("handle submit runnig", this.state);
        axios.post("/login", this.state).then(resp => {
            console.log("resp in then of POST /registration", resp);

            //if allesgut
            //redirecting user to route
            if (resp.data.success) {
                location.replace("/");
            } else {
                this.setState({ error: true });
                console.log("Error in handleSubmit");
            }
        });
    }

    render() {
        return (
            <div>
                <h1>login!!!!!!!!!</h1>
                {this.state.error && (
                    <div className="error">Error, please try again!</div>
                )}
                <Link to="/">Click here to registration</Link>

                <form onSubmit={this.handleSubmit}>
                    <input
                        onChange={this.handleChange}
                        name="email"
                        type="text"
                        placeholder="email"
                    />
                    <input
                        onChange={this.handleChange}
                        name="password"
                        type="password"
                        placeholder="password"
                    />
                    <button>Log in</button>
                </form>
            </div>
        );
    }
}
