import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Styles, UI } from '../../constants';
import { portChanged } from '../../store/socket/actions';

class PortSelector extends Component {
    handlePortChange = event => this.props.dispatch(portChanged(event.target.value));

    render() {
        return <div style={Styles.fieldStyle}>
            <label style={Styles.labelStyle} htmlFor="selectPort">Server Port</label>
            <select name="selectPort" onChange={this.handlePortChange} disabled={this.props.connected}>
                {UI.PORTS.map( (port, index) => <option value={port} key={index}>{port}</option>)}
            </select>
        </div>;
    }
}

const mapStateToProps = (state) => ({
    connected: state.socketState.connected,
    status: state.socketState.status
});

const mapDispatchToProps = (dispatch) => ({
    dispatch: dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(PortSelector);