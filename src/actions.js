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
