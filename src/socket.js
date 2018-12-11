import * as io from "socket.io-client";
import {
    onlineUsers,
    userJoined,
    userLeft,
    addMessages,
    singleMessage
} from "./actions";

let socket;

export default function initSocket(store) {
    if (!socket) {
        socket = io.connect();
        //most of our client socket
        //code will go here

        //on() accepts 2 arguments
        //1 arg: is the name of the mesg we are expecting from the server
        //2 arg: callback function that will run when the client hears the 'catnip' event
        socket.on("onlineUsers", listOfOnlineUsers => {
            // console.log("message in catnip event: ", listOfOnlineUsers);
            //dispatch
            store.dispatch(onlineUsers(listOfOnlineUsers));
        });

        socket.on("userJoined", userWhoJoined => {
            store.dispatch(userJoined(userWhoJoined));
        });

        socket.on("userLeft", userWhoLeft => {
            store.dispatch(userLeft(userWhoLeft));
            console.log("socket.js userWho left is: ", userWhoLeft);
        });

        socket.on("messages", data => {
            console.log("data:", data);
            store.dispatch(addMessages(data));
        });

        socket.on("singleMessage", data => {
            store.dispatch(singleMessage(data));
            console.log("socket.js single message: ", data);
        });
    }

    return socket;
}
