import React, { Component } from 'react';

import { Styles } from '../../constants';

import UserInput from '../user-input';
import PortSelector from '../port-selector';
import MessageHistory from '../message-history';
import MessageTransport from '../message-transport';
import RecipientSelector from '../recipient-selector';

import Footer from '../footer';
class Client extends Component {
    //Render component
    render() {
        return <div style={Styles.clientStyle}>
            <UserInput/>
            <PortSelector/>
            <RecipientSelector/>
            <MessageTransport/>
            <MessageHistory/>
            <Footer/>
        </div>;
    }
}

export default Client;