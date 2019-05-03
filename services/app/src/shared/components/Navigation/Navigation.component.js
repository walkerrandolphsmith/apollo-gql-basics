import React from 'react';
import { Link } from 'react-router-dom';
import {
  FEED,
  ROOT,
  SIGN_IN,
  SIGN_UP,
  SIGN_OUT,
  PROFILE,
} from 'src/shared/constants/routes';

const propTypes = {};

const defaultProps = {};

const Navigation = props => {
  const isLoggedIn = props.me && props.me.me && props.me.me.id;
  return (
    <nav role="navigation">
      {!isLoggedIn && <Link to={ROOT}>Home</Link>}
      {isLoggedIn && <Link to={FEED}>Feed</Link>}
      {!isLoggedIn && <Link to={SIGN_UP}>Sign Up</Link>}
      {!isLoggedIn && <Link to={SIGN_IN}>Sign In</Link>}
      {isLoggedIn && <Link to={SIGN_OUT}>Sign Out</Link>}
      {isLoggedIn && <Link to={PROFILE}>Profile</Link>}
    </nav>
  );
};

Navigation.propsTypes = propTypes;
Navigation.defaultProps = defaultProps;

export default Navigation;
