import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  handleChange: PropTypes.func,
};

const defaultProps = {
  handleChange: () => {},
};

const UploadAvatar = props => {
  return <input type="file" required onChange={props.handleChange} />;
};

UploadAvatar.propTypes = propTypes;
UploadAvatar.defaultProps = defaultProps;

export default UploadAvatar;
