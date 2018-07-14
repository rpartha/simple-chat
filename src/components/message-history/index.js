import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { Styles, UI } from '../../constants';
import { Chat } from './chat.js';

class MessageHistory extends Component {
    constructor(props) {
        super(props);
        this.messagesEnd = React.createRef();
    }

    scrollToBottom = () => ReactDOM.findDOMNode(this.messagesEnd.current).scrollIntoView({ behavior: 'smooth' });

    componentDidUpdate() {
        const messages = this.getMessages();
        if (this.props.connected && messages.length) this.scrollToBottom();
    }

    getMessages = () => {
        return (this.props.threads[this.props.recipient]) ? this.props.threads[this.props.recipient] : [];
    };

    render() {
        const messages = this.getMessages();
        return (this.props.connected && this.props.recipient !== UI.NO_RECIPIENT)
            ? <div style={Styles.historyContainerStyle}>
                <ul style={Styles.historyStyle}>
                    {messages.map((message, index) =>
                        <Chat user={this.props.user}
                                        message={message}
                                        key={index}
                                        ref={(index === messages.length -1) ? this.messagesEnd : null}/>)}
                </ul>
              </div>
            : null;
    }
}

const mapStateToProps = (state) => ({
    connected: state.socketState.connected,
    user: state.messageState.user,
    threads: state.messageState.threads,
    recipient: state.messageState.recipient
});

const mapDispatchToProps = (dispatch) => ({
    dispatch: dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(MessageHistory);