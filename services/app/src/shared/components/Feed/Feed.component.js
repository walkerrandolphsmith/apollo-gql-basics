import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Messages from 'src/shared/components/Messages';
import CandidateMessage from 'src/shared/components/CandidateMessage';

const Feed = () => (
  <Fragment>
    <CandidateMessage />
    <Messages />
  </Fragment>
);

Messages.propsTypes = {};
Messages.defaultProps = {};

export default Feed;
