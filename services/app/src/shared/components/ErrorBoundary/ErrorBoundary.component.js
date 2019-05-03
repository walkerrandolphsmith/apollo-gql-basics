import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ErrorMessage from './ErrorMessage.component';

const UNKNOWN = 'unknown';

const propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    username: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
  }),
  version: PropTypes.string,
};

const defaultProps = {
  user: null,
  version: UNKNOWN,
  stage: UNKNOWN,
};

class ConnectedErrorBoundary extends Component {
  componentDidCatch(error, info) {}

  render() {
    return <ErrorMessage />;
  }
}

ConnectedErrorBoundary.propTypes = propTypes;
ConnectedErrorBoundary.defaultProps = defaultProps;

export default ConnectedErrorBoundary;
