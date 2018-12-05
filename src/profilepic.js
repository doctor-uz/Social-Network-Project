import React from "react";

export default function ProfilePic(props) {
    // console.log("props is: ", props);
    return (
        <div className="firstlast">
            <img
                id="profilepic"
                src={props.profilePicUrl}
                onClick={props.showUploader}
            />
            <h3 id="firstlast">
                {props.first} {props.last}
            </h3>
        </div>
    );
}
