export const ROOT = '/';
export const SIGN_IN = '/signin';
export const SIGN_UP = '/signup';
export const SIGN_OUT = '/signout';
export const PROFILE = '/profile';
export const FEED = '/feed';

import Profile from 'src/shared/components/Profile';
import Feed from 'src/shared/components/Feed';
import SignIn from 'src/shared/components/SignIn';
import SignUp from 'src/shared/components/SignUp';
import SignOut from 'src/shared/components/SignOut';

export const routes = [
  {
    path: ROOT,
    exact: true,
    Component: SignIn,
  },
  {
    path: FEED,
    Component: Feed,
  },
  {
    path: PROFILE,
    Component: Profile,
  },
  {
    path: SIGN_IN,
    Component: SignIn,
  },
  {
    path: SIGN_UP,
    Component: SignUp,
  },
  {
    path: SIGN_OUT,
    Component: SignOut,
  },
];
