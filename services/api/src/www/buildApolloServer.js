import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import DataLoader from 'dataloader';
//import AWS from 'aws-sdk';

import schema from 'src/schema';
import resolvers from 'src/resolvers';
import loaders from 'src/loaders';
import { models } from 'src/models';
import { buildMailer } from 'src/mailer';
import { buildLocalizer } from 'src/localizations';
import { errorReporter } from 'src/errorReporter';

import {
  API_HOST as HOST,
  API_PORT as PORT,
  JWT_SECRET,
  APOLLO_ENGINE_APIKEY,
} from 'src/env';

export const buildApolloServer = () => {
  const formatError = error => {
    // hook to perform last minute error formatting.
    return {
      ...error,
    };
  };

  const getUserFromJWT = async (jwtToken, errorMessage) => {
    try {
      return await jwt.verify(jwtToken, JWT_SECRET);
    } catch (e) {
      throw new AuthenticationError(errorMessage);
    }
  };

  const getUserFromAccessToken = async (accessToken, errorMessage) => {
    const token = accessToken.replace('Bearer ', '');

    try {
      // TODO: lookup token in db
    } catch (e) {
      throw new AuthenticationError(errorMessage);
    }
  };

  const getMe = async (req, translate) => {
    const jwtToken = req.headers['x-token'];
    const accessToken = req.headers['Authorization'];

    const errorMessage = translate('authroization.expired');

    if (accessToken) {
      return getUserFromAccessToken(accessToken, errorMessage);
    }

    if (jwtToken) {
      return getUserFromJWT(jwtToken, errorMessage);
    }
  };

  // AWS.config.update({
  //   accessKeyId: S3_APIKEY,
  //   secretAccessKey: S3_SECRET,
  // });
  // const s3 = new AWS.S3();

  const context = async ({ req, connection }) => {
    // GQL subscription
    if (connection) {
      return { models };
    }

    // GQL queries and mutations
    if (req) {
      const langCode = 'en';

      const translate = buildLocalizer()(langCode);

      const me = await getMe(req, translate);

      const mailer = buildMailer({
        host: HOST,
        port: PORT,
        translate,
      });

      const loadersByModel = {
        user: new DataLoader(keys => loaders.user.batchUsers(keys, models)),
        message: new DataLoader(keys =>
          loaders.message.batchMessages(keys, models)
        ),
      };

      return {
        secret: JWT_SECRET,
        models,
        me,
        loaders: loadersByModel,
        translate,
        mailer,
        //s3,
        errorReporter,
      };
    }
  };

  const handleSubscriptionConnection = (connectionParams, webSocket) => {
    if (connectionParams.authToken) {
    }

    console.log('Missing auth token');
  };
  return new ApolloServer({
    typeDefs: schema,
    resolvers,
    context,
    // subscriptions: {
    //   onConnect: handleSubscriptionConnection,
    // },
    formatError,
    engine: {
      apiKey: APOLLO_ENGINE_APIKEY,
    },
  });
};
