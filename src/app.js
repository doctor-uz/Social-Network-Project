import React from "react";
import axios from "./axios";
import Logo from "./logo";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import { BrowserRouter, Route } from "react-router-dom";
import Profile from "./profile";
import OtherPersonProfile from "./otherpersonprofile";
import Friends from "./friends";
import Onlineusers from "./onlineusers";
import Chat from "./chat";
import { Link } from "react-router-dom";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false
        };
        this.showUploader = this.showUploader.bind(this);
        this.hideUploader = this.hideUploader.bind(this);
        this.updateImage = this.updateImage.bind(this);
        this.setBio = this.setBio.bind(this);
    }

    showUploader() {
        this.setState({
            uploaderIsVisible: true
        });
    }

    hideUploader() {
        this.setState({
            uploaderIsVisible: false
        });
    }

    updateImage(cUrl) {
        this.setState({
            profilepicurl: cUrl
        });
    }

    setBio(text) {
        this.setState({
            bio: text
        });
    }

    //#2 then componentDidMount runs
    componentDidMount() {
        // console.log("component didmount yooooo!!!!!!!");
        axios
            .get("/user")
            .then(({ data }) => {
                // console.log("resp in axios /get then: ", data);
                this.setState(data);
            })
            .then(() => {
                // console.log("this is my app axios data: ", this.state);
            });
    }

    //#1 first it renders
    render() {
        // console.log("render of state ", this.state);
        return (
            <div>
                <div className="nav">
                    <Logo className="logo" />

                    <ProfilePic
                        className="profilepic"
                        first={this.state.first}
                        last={this.state.last}
                        profilePicUrl={
                            this.state.profilepicurl
                                ? this.state.profilepicurl
                                : "/unknown.jpeg"
                        }
                        showUploader={this.showUploader}
                    />
                </div>
                <div id="body">
                    <BrowserRouter>
                        <div>
                            <Route
                                exact
                                path="/"
                                render={() => {
                                    return (
                                        <Profile
                                            id={this.state.id}
                                            first={this.state.first}
                                            last={this.state.last}
                                            profilePicUrl={
                                                this.state.profilepicurl
                                            }
                                            bio={this.state.bio}
                                            setBio={this.setBio}
                                            showUploader={this.showUploader}
                                        />
                                    );
                                }}
                            />
                            <Route
                                path="/user/:id"
                                render={props => {
                                    return (
                                        <OtherPersonProfile
                                            {...props}
                                            key={props.match.url}
                                            first={this.state.first}
                                            last={this.state.last}
                                            email={this.state.email}
                                            bio={this.state.bio}
                                        />
                                    );
                                }}
                            />
                            <Route path="/friends/" component={Friends} />
                            <Route path="/online/" component={Onlineusers} />
                            <Route path="/chat/" component={Chat} />
                        </div>
                    </BrowserRouter>
                </div>

                {this.state.uploaderIsVisible && (
                    <Uploader
                        updateImage={this.updateImage}
                        hideUploader={this.hideUploader}
                    />
                )}
            </div>
        );
    }
}
