import { connect } from 'react-redux';
import React, { Component } from 'react';

import { Styles } from '../../constants';

import { sendMessage } from '../../store/message/actions';

class SendButton extends Component {
    handleClick = () => {
        this.props.sendMessage(this.props.outgoingMessage);
    };
    
    isEnabled = () => (!!this.props.outgoingMessage);

    render() {
        return <button style={this.isEnabled() ? Styles.buttonStyle : Styles.disabledButtonStyle}
                       onClick={this.handleClick}
                       disabled={!this.isEnabled()}>Send</button>;
    }
}

const mapStateToProps = (state) => ({
    connected: state.socketState.connected,
    port: state.socketState.port,
    user: state.messageState.user,
    outgoingMessage: state.messageState.outgoingMessage
});

const mapDispatchToProps = (dispatch) => ({
    sendMessage: message => dispatch(sendMessage(message))
});

export default connect(mapStateToProps, mapDispatchToProps)(SendButton);