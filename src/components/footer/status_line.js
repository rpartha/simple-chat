import { connect } from 'react-redux';
import React, { Component } from 'react';

import { Styles } from '../../constants';

class StatusLine extends Component {

    render() {
        return <div style={this.props.isError ? Styles.errorStatusStyle : Styles.statusStyle}>
            {this.props.status}
        </div>;
    }
}

const mapStateToProps = (state) => ({
    isError: state.statusState.isError,
    status: state.statusState.status,
    recipient: state.messageState.recipient,
    recipientLost: state.messageState.recipientLost

});

export default connect(mapStateToProps)(StatusLine);