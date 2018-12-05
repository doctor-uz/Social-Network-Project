import React from "react";
import axios from "./axios";

export default class FriendButton extends React.Component {
    constructor() {
        super();
        this.state = {
            buttontext: "",
            click: ""
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        e.preventDefault();

        if (this.state.click == "makefriend") {
            axios.post("/makefriend/" + this.props.otherUserId).then(data => {
                console.log("handleclick of friendships: ", data);
                this.setState({
                    click: "cancelfriend",
                    buttontext: "cancel friend request"
                });
            });
        }

        if (this.state.click == "cancelfriend") {
            axios.post("/cancelfriend/" + this.props.otherUserId).then(data => {
                console.log("handleclick of friendships: ", data);
                this.setState({
                    click: "makeFriend",
                    buttontext: "Make friend request"
                });
            });
        }
    }

    componentDidMount() {
        // var self = this;
        axios.get("/friendship/" + this.props.otherUserId).then(data => {
            console.log("data in componentDIDMount: ", data);
            if (data.data.rows.length) {
                console.log("there is data inside an array");
            } else {
                this.setState({
                    buttontext: "Send Friend Request",
                    click: "makefriend"
                });
            }
        });
    }

    render() {
        return (
            <div className="button">
                <button onClick={this.handleClick}>
                    {this.state.buttontext}
                </button>
            </div>
        );
    }
}
