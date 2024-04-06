import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import routes from './routes/route';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolver';

dotenv.config();

const startServer = async () => {
  const app: Express = express();
  const port = process.env.PORT;
  const cors = require('cors');
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();
  app.use(express.json());
  app.use('/graphql', expressMiddleware(server));
  app.use(
    cors({ origin: process.env.DOTA_SITE}),
  );
  app.use(express.json());
  app.use(routes);
  const portNumber = process.env.PORT || 5000;
  app.listen(portNumber, () => {
    console.log("Server started on port", portNumber);
  });
};

startServer();
