import React, { Component } from 'react';

import { Styles } from '../../constants';

export class Chat extends Component { 
    render() {
        return <li style={(this.props.message.from === this.props.user) ? Styles.senderStyle : Styles.recipientStyle}>
            <strong>{this.props.message.from}: </strong> {this.props.message.text}
        </li>;
    }
}