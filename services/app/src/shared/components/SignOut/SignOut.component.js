import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash.noop';

const propTypes = {
  handleSignOut: PropTypes.func,
};

const defaultProps = {
  handleSignOut: noop,
};

const SignOut = props => {
  return <button onClick={props.handleSignOut}>Sign Out</button>;
};

SignOut.propsTypes = propTypes;
SignOut.defaultProps = defaultProps;

export default SignOut;
