import React from "react";
import { connect } from "react-redux";

class OnlineUsers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        if (!this.props.user) {
            return null;
        }

        return (
            <div className="online-container">
                <h3 className="friends">Online friends ...</h3>
                {this.props.user &&
                    this.props.user.map(online => {
                        return (
                            <div className="friendbox1" key={online.id}>
                                <img
                                    id="picfriends"
                                    src={
                                        online.profilepicurl || "/unknown.jpeg"
                                    }
                                />
                                <span className="dot" />
                                <p className="friendname">
                                    {online.first} {online.last}
                                </p>
                            </div>
                        );
                    })}
            </div>
        );
    }
}

function mapStateToProps(state) {
    console.log("this are states:", state && state);
    var list = state.onlineUsers;
    return {
        user: list
    };
}

export default connect(mapStateToProps)(OnlineUsers);
