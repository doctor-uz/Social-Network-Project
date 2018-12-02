import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        console.log("handle change", e.target.files[0]);
        this.setState({
            [e.target.name]: e.target.files[0]
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log("handle submit runing!");
        var formData = new FormData();
        formData.append("file", this.state.file);

        var self = this;
        axios
            .post("/upload", formData)
            .then(function(resp) {
                console.log("resp data: ", resp.data);
                self.props.updateImage(resp.data.rows[0].profilepicurl);
                self.props.hideUploader();
            })
            .catch(err => {
                this.setState({ error: true });
                console.log("error while uploading image: ", err);
            });
    }

    render() {
        return (
            <div className="uploader">
                <h1>Upload a new avatar</h1>
                <h2 onClick={this.props.hideUploader}>close</h2>
                <form onSubmit={this.handleSubmit}>
                    <input
                        name="file"
                        onChange={this.handleChange}
                        type="file"
                        accept="image/*"
                    />
                    <button>upload</button>
                </form>
            </div>
        );
    }
}
