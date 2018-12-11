import React from "react";
import { connect } from "react-redux";
//to be able to emit a message from client to server we need to import the function
import initSocket from "./socket";

class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.sendMessage = this.sendMessage.bind(this);
    }

    sendMessage(e) {
        //emiting a message from client to server first part
        let socket = initSocket();

        if (e.which === 13) {
            //console.log("user's message:", e.target.value);
            //emiting a message from client to server 2part
            socket.emit("chatMessage", e.target.value);
        }
    }

    componentDidUpdate() {
        if (!this.elem) {
            return null;
        }
        this.elem.scrollTop = this.elem.scrollHeight;
    }

    render() {
        //console.log("this.props.messages:", this.props.messages);
        if (!this.props.messages) {
            return null;
        }

        let arrOfMessages = this.props.messages.map((elem, messageId) => {
            //elem is every message in my array
            //console.log("elem:", elem);
            //render de animals arrays
            return (
                <div key={messageId}>
                    <p>{elem.messages}</p>
                    {elem.last} {elem.first}{" "}
                    <img
                        id="picfriendschat"
                        src={elem.profilepicurl || "/unknown.jpeg"}
                    />
                </div>
            );
        });

        return (
            <div className="container">
                <div
                    className="chat-container"
                    ref={elem => (this.elem = elem)}
                >
                    {arrOfMessages}
                </div>
                <div id="message">
                    <h3>Send message</h3>
                    <textarea
                        className="chatbox"
                        name="chat"
                        onKeyDown={this.sendMessage}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    //console.log("state in mapStateToProps", state);
    return {
        messages: state.addMessages
    };
};

export default connect(mapStateToProps)(Chat);

// <p>{arrOfMessages}</p>
