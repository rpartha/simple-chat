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

const mapDispatchToProps = (dispatch) => ({
    dispatch: dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(StatusLine);