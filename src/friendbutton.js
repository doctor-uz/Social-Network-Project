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
        // var self = this;
        axios.get("/friendship/" + this.props.otherUserId).then(data => {
            console.log("component did mount friendship data: ", data);
            if (data.data.rows.length == 0) {
                console.log("get friends data.rows[0]:", data.data.rows);
                this.setState({
                    buttontext: "Make friend request"
                });
            } else if (
                data.data.rows[0].receiverid == this.props.otherUserId &&
                data.data.rows[0].accepted == false
            ) {
                this.setState({
                    buttontext: "Cancel friend request"
                });
            } else if (!data.data.rows[0].accepted) {
                this.setState({
                    buttontext: "AcceptFriendRequest"
                });
            } else if (data.data.rows[0].accepted) {
                this.setState({
                    buttontext: "deletefriend"
                });
            }
        });
    }

    handleClick(e) {
        e.preventDefault();

        if (this.state.buttontext == "Make friend request") {
            // let self = this;
            axios.post("/makefriend/" + this.props.otherUserId).then(() => {
                // console.log("handleclick of friendships: ", data);

                this.setState({
                    buttontext: "Cancel friend request"
                });
            });
        }

        if (this.state.buttontext == "Cancel friend request") {
            // let self = this;
            axios.post("/cancelfriend/" + this.props.otherUserId).then(() => {
                // console.log("handleclick of friendships: ", data);

                this.setState({
                    buttontext: "Make friend request"
                });
            });
        }

        if (this.state.buttontext == "AcceptFriendRequest") {
            let self = this;
            return axios
                .post("/acceptfriend/" + this.props.otherUserId)
                .then(() => {
                    self.setState({
                        buttontext: "deletefriend"
                    });
                });
        }
        if (this.state.buttontext == "deletefriend") {
            let self = this;
            return axios
                .post("/deletefriend/" + this.props.otherUserId)
                .then(() => {
                    self.setState({
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
