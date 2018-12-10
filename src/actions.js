import axios from "./axios";

export async function receiveFriendsAndWannabes() {
    const { data } = await axios.get("/friendslist");
    return {
        type: "RECEIVE_FRIENDS_WANNABES",
        friendsAndWannabes: data
    };
}

export async function unfriend(userId) {
    await axios.post("/deleteFriend/" + userId);
    return {
        type: "UNFRIEND",
        deletefriend: userId
    };
}

export async function acceptfriend(userId) {
    console.log("before accept:");
    await axios.post("/acceptfriend/" + userId);
    console.log("after");
    return {
        type: "ACCEPT_FRIEND_REQUEST",
        acceptfriend: userId
    };
}

export async function onlineUsers(listOfOnlineUsers) {
    return {
        type: "ONLINE_USERS",
        onlineUsers: listOfOnlineUsers
    };
}

export async function userJoined(userWhoJoined) {
    return {
        type: "USER_JOINED",
        userJoined: userWhoJoined
    };
}

export async function userLeft(userWhoLeft) {
    return {
        type: "USER_LEFT",
        userLeft: userWhoLeft
    };
}
