import { connect } from 'react-redux';
import React, { Component } from 'react';

import { Styles, UI } from '../../constants';

import { recipientChanged } from '../../store/message/actions';


class RecipientSelector extends Component {
    handleRecipientChange = event => this.props.recipientChanged(event.target.value);

    render() {
        return (this.props.users.length)
            ? <div style={Styles.fieldStyle}>
                <label style={Styles.labelStyle} htmlFor="selectRecipient">Recipient</label>
                <select name="selectRecipient"
                        value={this.props.recipient}
                        onChange={this.handleRecipientChange}>
                    <option disabled value={UI.NO_RECIPIENT} key="-1">{UI.NO_RECIPIENT}</option>
                    {this.props.users.map( (user, index) =>
                        <option key={index} value={user}>{user}</option>)}
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
    recipientChanged: recipient => dispatch(recipientChanged(recipient))
});

export default connect(mapStateToProps, mapDispatchToProps)(RecipientSelector);