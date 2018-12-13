import React from "react";
import { connect } from "react-redux";
//we import like that to use like this: receiveFriendsAndWannabes();
import { receiveFriendsAndWannabes, unfriend, acceptfriend } from "./actions";
// import { Link } from 'react-router-dom';

//DO NOT EXPORT THIS COMPONENT!!!!!
class Friends extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        this.props.dispatch(receiveFriendsAndWannabes());
    }

    render() {
        const { friends, wannabes } = this.props;
        if (!friends) {
            return null;
        }
        console.log("render of Friends, ", friends);
        if (!wannabes) {
            return null;
        }

        return (
            <div className="lists-container">
                <h3 className="friends">Friends</h3>
                <div className="lists">
                    {friends.map(friend => {
                        return (
                            <div key={friend.id} className="friendbox">
                                <img
                                    className="friendpic"
                                    id="picfriends"
                                    src={
                                        friend.profilepicurl || "/unknown.jpeg"
                                    }
                                />
                                <p className="friendname">
                                    {friend.first} {friend.last}
                                </p>
                                <button
                                    className="friendbutton"
                                    onClick={() =>
                                        this.props.dispatch(unfriend(friend.id))
                                    }
                                >
                                    End friendship
                                </button>
                            </div>
                        );
                    })}
                </div>
                <h3 className="friends">Wannabes</h3>
                <div className="lists">
                    {wannabes.map(wannabe => {
                        return (
                            <div key={wannabe.id} lassName="friendbox">
                                <img
                                    className="friendpic"
                                    id="picfriends"
                                    src={
                                        wannabe.profilepicurl || "/unknown.jpeg"
                                    }
                                />
                                <p className="friendname">
                                    {wannabe.first} {wannabe.last}
                                </p>
                                <button
                                    className="friendbutton"
                                    onClick={() =>
                                        this.props.dispatch(
                                            acceptfriend(wannabe.id)
                                        )
                                    }
                                >
                                    Accept friend request
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    var list = state.friendsAndWannabes;
    console.log("mapStateToProps LIST: ", list);
    return {
        //one prop
        friends:
            list &&
            list.filter(
                //the ones who aren't friends get filtered out
                user => user.accepted == true
            ),
        //second prop
        wannabes: list && list.filter(user => !user.accepted)
    };
}

export default connect(mapStateToProps)(Friends);

//On each friend element we need onClick that dispatches the unfriend action. pass id of friend
//on each wannabe element we need onClick (read rest of info from David's list)

//NOT SURE IF THIS NEXT THING GOES IN THIS FILE BUT I THINK SO!!!
//redux state:
// {
//     friendsAndWannabes: [
//         {
//             accepted: true
//         },
//         {
//             accepted: false
//         }
//     ]
// }
