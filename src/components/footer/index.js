import React, { Component } from 'react';

import { Styles } from '../../constants';

import ConnectButton from './connect_button.js';
import StatusLine from './status_line.js';

// Footer with status line and connect button
class Footer extends Component {
    render() {
        return <div style={Styles.footerStyle}>
            <StatusLine/>
            <ConnectButton/>
        </div>
    }
}

export default Footer;