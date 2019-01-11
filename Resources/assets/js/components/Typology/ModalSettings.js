import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Rodal from 'rodal';

import 'rodal/lib/rodal.css';

class ModalSettings extends React.Component {

    constructor(props) {
        super(props);
        this.state = { visible: false };
    }

    show() {
        this.setState({ visible: true });
    }

    hide() {
        this.setState({ visible: false });
    }

    render() {
        return (
            <div>
                <button onClick={this.show.bind(this)}>show</button>
                <Rodal visible={this.state.visible} onClose={this.hide.bind(this)} width="600">
                    <div>Content</div>
                </Rodal>
            </div>
        )
    }
}

if (document.getElementById('component-typology-modal-settings')) {
    ReactDOM.render(<ModalSettings />, document.getElementById('component-typology-modal-settings'));
}
