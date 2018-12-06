import React from "react";
import axios from "./axios";

export default class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            buttontext: ""
        };
        this.handleClick = this.handleClick.bind(this);
        this.rejectRequest = this.rejectRequest.bind(this);
    }

    componentDidMount() {
        var self = this;
        axios.get("/friendship/" + this.props.otherUserId).then(({ data }) => {
            console.log("component did mount friendship data: ", data);
            if (data.rows.length) {
                if (data.rows[0].accepted) {
                    self.setState({
                        click: "deletefriend",
                        buttontext: "End Friendship"
                    });
                } else {
                    if (self.props.otherUserId == data.rows[0].receiver) {
                        self.setState({
                            click: "cancelfriend",
                            buttontext: "Cancel Friend Request"
                        });
                    } else {
                        self.setState({
                            click: "acceptfriend",
                            buttontext: "Accept Friend Request"
                        });
                    }
                }
            } else {
                self.setState({
                    click: "makefriend",
                    buttonText: "Make Friend Request"
                });
            }
        });
    }

    handleClick(e) {
        e.preventDefault();

        if (this.state.click == "makefriend") {
            let self = this;
            axios.post("/makefriend/" + this.props.otherUserId).then(data => {
                // console.log("handleclick of friendships: ", data);
                data.success &&
                    self.setState({
                        click: "cancelfriend",
                        buttontext: "cancel friend request"
                    });
            });
        }

        if (this.state.click == "cancelfriend") {
            let self = this;
            axios.post("/cancelfriend/" + this.props.otherUserId).then(data => {
                // console.log("handleclick of friendships: ", data);
                data.success &&
                    self.setState({
                        click: "makeFriend",
                        buttontext: "Make friend request"
                    });
            });
        }

        if (this.state.click == "acceptfriend") {
            let self = this;
            return axios
                .post("/acceptfriend/" + this.props.otherUserId)
                .then(({ data }) => {
                    data.success &&
                        self.setState({
                            click: "deletefriend",
                            buttontext: "End Friendship"
                        });
                });
        }
        if (this.state.click == "deletefriend") {
            let self = this;
            return axios
                .post("/deletefriend/" + this.props.otherUserId)
                .then(({ data }) => {
                    data.success &&
                        self.setState({
                            click: "deletefriend",
                            buttontext: "Make Friend Request"
                        });
                });
        }
    }

    rejectRequest() {
        let self = this;
        return axios
            .post("/rejectfriend/" + this.props.otherUserId)
            .then(({ data }) => {
                data.success &&
                    self.setState({
                        click: "makefriend",
                        buttontext: "Make Friend Request"
                    });
            });
    }

    render() {
        return (
            <div>
                <button className="button" onClick={this.handleClick}>
                    {this.state.buttontext}
                </button>
                {this.state.click == "acceptfriend" && (
                    <button onClick={this.rejectRequest}>
                        Reject Friend Request
                    </button>
                )}
            </div>
        );
    }
}
