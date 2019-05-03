import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash.noop';

const propTypes = {
  handleSignIn: PropTypes.func,
};

const defaultProps = {
  handleSignIn: noop,
};

const SignIn = props => {
  return <button onClick={props.handleSignIn}>Sign In</button>;
};

SignIn.propsTypes = propTypes;
SignIn.defaultProps = defaultProps;

export default SignIn;
