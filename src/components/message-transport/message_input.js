import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Styles } from '../../constants';
import { outgoingMessageChanged } from '../../store/message/actions';

class MessageInput extends Component {
    handleOutgoingMessageChange = event => {
        this.props.dispatch(outgoingMessageChanged(event.target.value));
    };

    render() {
        return <span>
            <label style={Styles.labelStyle} htmlFor="messageInput">Message</label>
            <input type="text" name="messageInput"
                   value={this.props.outgoingMessage}
                   onChange={this.handleOutgoingMessageChange}/>
        </span>;
    }
}

const mapStateToProps = (state) => ({outgoingMessage: state.messageState.outgoingMessage || ''});

const mapDispatchToProps = (dispatch) => ({
    dispatch: dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(MessageInput);