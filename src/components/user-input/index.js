import { connect } from 'react-redux';
import React, { Component } from 'react';

import { Styles } from '../../constants';

import { userChanged } from '../../store/message/actions';

class UserInput extends Component {
    handleUserChange = event => this.props.userChanged(event.target.value);

    render() {
        return <div style={Styles.fieldStyle}>
            <label style={Styles.labelStyle} htmlFor="userInput">Your Name</label>
            <input type="text" name="userInput" onChange={this.handleUserChange} disabled={this.props.connected}/>
        </div>;

    }
}

const mapStateToProps = (state) => ({
    connected: state.socketState.connected,
});

const mapDispatchToProps = (dispatch) => ({
    userChanged: user => dispatch(userChanged(user))
});

//Export props-mapped Higher-Ordered-Component
export default connect(mapStateToProps, mapDispatchToProps)(UserInput);