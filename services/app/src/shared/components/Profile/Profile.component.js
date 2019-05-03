import React from 'react';
import PropTypes from 'prop-types';
import { dataUri } from './defaultCode';
import { Helmet } from 'react-helmet';

import UploadAvatar from 'src/shared/components/UploadAvatar';

const propTypes = {
  username: PropTypes.string,
};

const defaultProps = {
  username: 'walker',
};

const Profile = props => {
  return (
    <div>
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <header>
        <h3>{props.username}</h3>
      </header>
      <p>{props.email}</p>
    </div>
  );
};

Profile.propTypes = propTypes;
Profile.defaultProps = defaultProps;

export default Profile;
