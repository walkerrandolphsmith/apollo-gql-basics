import React from 'react';
import PropTypes from 'prop-types';

const messagePropType = PropTypes.shape({
  id: PropTypes.string,
  text: PropTypes.string,
  user: PropTypes.shape({
    username: PropTypes.string,
  }),
});

const propTypes = {
  messages: PropTypes.shape({
    edges: PropTypes.arrayOf(messagePropType),
  }),
};

const defaultProps = {
  messages: {
    edges: [],
  },
};

const Messages = props => {
  const messages = props.messages.edges.map(message => (
    <div key={message.id}>
      <div>{message.text}</div>
      {/* <div>- {message.user.username}</div> */}
    </div>
  ));

  return messages;
};

Messages.propsTypes = propTypes;
Messages.defaultProps = defaultProps;

export default Messages;
