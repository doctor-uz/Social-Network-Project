import React from "react";

import ProfilePic from "./profilepic";

import Bio from "./bio";

export default function Profile(props) {
    return (
        <div className="bigpic">
            <ProfilePic
                showUploader={props.showUploader}
                profilePicUrl={props.profilePicUrl || "/unknown.jpeg"}
            />
            {props.first} {props.last}
            <Bio bio={props.bio} setBio={props.setBio} />
        </div>
    );
}
