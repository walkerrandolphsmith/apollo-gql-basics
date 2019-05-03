import { combineResolvers } from 'graphql-resolvers';

import { isAuthenticated, isMessageOwner } from './authorization';
import { cursorPagination } from './pagination';
import pubsub, { EVENTS } from 'src/subscription';

export default {
  Query: {
    message: async (parent, { id }, { models }) => {
      return await models.Message.findById(id);
    },
    messages: async (parent, { cursor, limit }, { models }) =>
      cursorPagination(parent, { cursor, limit }, models.Message),
  },
  Mutation: {
    createMessage: combineResolvers(
      isAuthenticated,
      async (parent, { text }, { me, models, translate }) => {
        if (!text) {
          const errorMessage = translate('message.empty');
          throw new Error(errorMessage);
        }
        const message = await models.Message.create({
          text,
          userId: me.id,
        });

        pubsub.publish(EVENTS.MESSAGE.CREATED, {
          messageCreated: { message },
        });

        return message;
      }
    ),

    deleteMessage: combineResolvers(
      isAuthenticated,
      isMessageOwner,
      async (parent, { id }, { models }) => {
        return await models.Message.deleteOne({ id });
      }
    ),

    updateMessage: async (parent, { id, text }, { models }) => {
      return await models.Message.update({ text }, { id });
    },
  },
  Message: {
    author: async (message, args, { loaders }) =>
      loaders.user.load(message.userId),
  },
  Subscription: {
    messageCreated: {
      subscribe: (parent, args, context) =>
        pubsub.asyncIterator(EVENTS.MESSAGE.CREATED),
    },
  },
};
