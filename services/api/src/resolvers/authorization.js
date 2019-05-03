import { ForbiddenError } from 'apollo-server';
import { combineResolvers, skip } from 'graphql-resolvers';

import { ADMIN } from 'src/roles';

export const isAuthenticated = (parent, args, { me, translate }) => {
  if (me) return skip;
  const errorMessage = translate('authorization.isMessageOwner');
  throw new ForbiddenError(errorMessage);
};

const hasAdminRole = (parent, args, { me: { role }, translate }) => {
  if (role === ADMIN) return skip;
  const errorMessage = translate('authorization.isAdmin');
  throw new ForbiddenError(errorMessage);
};

export const isAdmin = combineResolvers(isAuthenticated, hasAdminRole);

export const isMessageOwner = async (
  parent,
  { id },
  { models, me, translate }
) => {
  const message = await models.Message.findById(id);

  if (message.userId !== me.id) {
    const errorMessage = translate('authorization.isMessageOwner');
    throw new ForbiddenError(errorMessage);
  }

  return skip;
};
