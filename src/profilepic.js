import React from "react";

export default function ProfilePic(props) {
    console.log("props is: ", props);
    return (
        <div>
            <img
                onClick={props.showUploader}
                src={props.profilePicUrl}
                alt={`${props.first} ${props.last}`}
                id="profilepic"
            />
        </div>
    );
}
