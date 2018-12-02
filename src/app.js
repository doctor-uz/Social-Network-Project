import React from "react";
import axios from "./axios";
import Logo from "./logo";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false
        };
        this.showUploader = this.showUploader.bind(this);
        this.hideUploader = this.hideUploader.bind(this);
        this.updateImage = this.updateImage.bind(this);
    }

    showUploader() {
        this.setState(
            {
                uploaderIsVisible: true
            },
            () => console.log("state showUploader: ", this.state.profilePicUrl)
        );
    }

    hideUploader() {
        this.setState(
            {
                uploaderIsVisible: false
            },
            () => console.log("state showUploader: ", this.state.profilePicUrl)
        );
    }

    updateImage(cUrl) {
        this.setState({
            profilePicUrl: cUrl
        });
    }

    //#2 then componentDidMount runs
    componentDidMount() {
        // console.log("component didmount yooooo!!!!!!!");
        axios.get("/user").then(({ data }) => {
            // console.log("resp in /get then: ", data);
            this.setState(data.rows[0]);
        });
    }

    //#1 first it renders
    render() {
        console.log("render of state ", this.state);
        return (
            <div>
                <Logo />
                <h1>Welcome, {this.state.first}!</h1>
                <ProfilePic
                    first={this.state.first}
                    last={this.state.last}
                    profilePicUrl={
                        this.state.profilePicUrl
                            ? this.state.profilePicUrl
                            : "/unknown.jpeg"
                    }
                    showUploader={this.showUploader}
                />
                {this.state.uploaderIsVisible && (
                    <Uploader
                        hideUploader={this.hideUploader}
                        updateImage={this.updateImage}
                    />
                )}
            </div>
        );
    }
}
