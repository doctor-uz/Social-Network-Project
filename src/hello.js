import React from "react";

import AquaBox from "./aquabox";
import Greetee from "./greetee";

export default class Hello extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name
        };
        this.changeName = this.changeName.bind(this);
    }
    changeName(name) {
        this.setState({
            name
        });
    }
    render() {
        return (
            <div>
                <h1>
                    Hello,
                    <AquaBox>
                        <Greetee name={this.state.name} />
                    </AquaBox>
                    !
                </h1>
                <AquaBox>sneakers</AquaBox>
                <GreeteeChanger changeName={this.changeName} />
            </div>
        );
    }
}

function GreeteeChanger(props) {
    return <input onChange={e => props.changeName(e.target.value)} />;
}
