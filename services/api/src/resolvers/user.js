import jwt from 'jsonwebtoken';
import { combineResolvers } from 'graphql-resolvers';
import { isAdmin } from 'src/resolvers/authorization';
import { builtinModules } from 'module';

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username, role } = user;
  const payload = { id, email, username, role };
  return await jwt.sign(payload, secret, { expiresIn });
};

export default {
  Query: {
    me: async (parent, args, { me, models }) => {
      if (!me) {
        return null;
      }
      return await models.User.findById(me.id);
    },
    user: async (parent, { id }, { models }) => {
      return await models.User.findById(id);
    },
    users: async (parent, args, { models }) => {
      return await models.User.find({});
    },
  },
  Mutation: {
    signUp: async (parent, args, context) => {
      const { username, email, password } = args;

      const { models, secret } = context;

      const user = await models.User.create({
        username,
        email,
        password,
      });

      return { token: createToken(user, secret, '30m') };
    },
    signIn: async (parent, args, context) => {
      const { login, password } = args;

      const { models, secret, translate } = context;

      const user = await models.User.findOne({ username: login });

      const errorMessage = translate('user.badCredentials');

      if (!user) {
        throw new Error(errorMessage);
      }

      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        throw new Error(errorMessage);
      }

      return { token: createToken(user, secret, '30m') };
    },
    signOut: async (parent, params, { models }) => {
      return null;
    },
    deleteUser: combineResolvers(
      isAdmin,
      async (parent, { id }, { models }) => {
        return await models.User.deleteOne({
          id,
        });
      }
    ),
  },
  User: {
    name: async user => `${user.nameFirst} ${user.nameLast}`,
    messages: async (user, args, { models }) => {
      return await models.Message.findAll({
        userId: user.id,
      });
    },
  },
};
