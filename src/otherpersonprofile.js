import React from "react";
// import { Link } from "react-router-dom";
import axios from "./axios";
// import ProfilePic from "./profilepic";

export default class OtherPersonProfile extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        //axios
        axios
            .get(`/user/${this.props.match.params.id}/info`)
            .then(({ data }) => {
                console.log("SPICED: ", data);

                if (
                    data.data.rows.length == 0 ||
                    data.userId == `${this.props.match.params.id}`
                ) {
                    this.props.history.push("/");
                } else {
                    this.setState(data.data.rows[0]);
                }
            })
            .catch(res => {
                this.props.history.push("/");
                console.log("error in email: ", res);
            });
        //redirect user to / Route
    }

    render() {
        return (
            <div className="opp-container">
                <img
                    id="otherpersonpic"
                    src={
                        this.state.profilepicurl
                            ? this.state.profilepicurl
                            : "/unknown.jpeg"
                    }
                />
                <h1>OPP running!!!!</h1>
                <br /> <br />
                {this.state.first} {this.state.last}
                <br /> <br />
                {this.state.email}
                <br /> <br />
                {this.state.bio}
                <br /> <br />
                {this.state.created_at}
                <br /> <br />
            </div>
        );
    }
}
