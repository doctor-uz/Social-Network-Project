import * as io from "socket.io-client";
import { onlineUsers, userJoined, userLeft } from "./actions";

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
    }

    return socket;
}
