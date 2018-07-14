import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Styles, UI } from '../../constants';
import { recipientChanged } from '../../store/message/actions';


class RecipientSelector extends Component {
    handleRecipientChange = event => this.props.dispatch(recipientChanged(event.target.value));

    render() {
        return (this.props.users.length)
            ? <div style={Styles.fieldStyle}>
                <label style={Styles.labelStyle} htmlFor="selectRecipient">Recipient</label>
                <select name="selectRecipient" onChange={this.handleRecipientChange}>
                    <option disabled value={UI.NO_RECIPIENT} selected={this.props.recipient === UI.NO_RECIPIENT} key="-1">{UI.NO_RECIPIENT}</option>
                    {this.props.users.map( (user, index) =>
                        <option key={index} selected={this.props.recipient === user} value={user}>{user}</option>)}
                </select>
              </div>
            : null;
    }
}

const mapStateToProps = (state) => ({
    recipient: state.messageState.recipient,
    users: state.messageState.users

});

const mapDispatchToProps = (dispatch) => ({
    dispatch: dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(RecipientSelector);