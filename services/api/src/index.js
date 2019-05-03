import http from 'http';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { applyErrorReporter } from 'src/www/applyErrorReporter';
import { buildApolloServer } from 'src/www/buildApolloServer';
//import { applyPassport } from 'src/www/applyPassport';
import { API_HOST as HOST, API_PORT as PORT, MONGO_URI } from 'src/env';

mongoose.Promise = global.Promise;
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('Mongo connected'))
  .catch(error => console.log('Error connecting to mongo', error));

const app = express();

applyErrorReporter(app);

app.use(cors());

//applyPassport(app);

const server = buildApolloServer();

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const handleSuccess = () => {
  console.log(
    `🚀 API Server is available on : http://${HOST}:${PORT}${
      server.graphqlPath
    }`
  );
  console.log(
    `🚀 Subscriptions ready at ws://${HOST}:${PORT}${server.subscriptionsPath}`
  );
};

httpServer.listen({ port: PORT }, handleSuccess);
