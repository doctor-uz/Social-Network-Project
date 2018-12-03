import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {};
        this.state = {
            showEditor: false
        };
        this.showEditor = this.showEditor.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        // this.hideTextarea = this.hideTextarea.bind(this);
    }

    showEditor(e) {
        e.preventDefault();
        this.setState({
            bio: this.props.bio,
            showEditor: true
        });
    }

    handleChange(e) {
        console.log("handle Change running!", e.target.value);
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
        const self = this;
        console.log("handle submit runnig", this.state);
        axios
            .post("/bio", this.state)
            .then(resp => {
                console.log("resp in then of POST /bio", resp);

                self.props.setBio(resp.data.rows[0].bio);
                self.setState({
                    showEditor: false
                });
            })
            .catch(err => {
                console.log("error in post", err);
            });
    }

    render() {
        return (
            <div>
                {this.state.showEditor ? (
                    <form onSubmit={this.handleSubmit}>
                        <textarea
                            defaultValue={this.props.bio}
                            onChange={this.handleChange}
                            name="bio"
                        />
                        <button>submit</button>
                    </form>
                ) : (
                    <div>
                        {this.props.bio ? (
                            <div>
                                {this.props.bio}{" "}
                                <Link onClick={this.showEditor} to="/">
                                    Edit
                                </Link>
                            </div>
                        ) : (
                            <div>
                                <Link onClick={this.showEditor} to="/">
                                    Add bio
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}
