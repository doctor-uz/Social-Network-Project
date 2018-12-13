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
            <p className="myname">
                {props.first} {props.last}
            </p>
        </div>
    );
}
