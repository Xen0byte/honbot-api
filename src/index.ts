import {
  Request,
  ResponseToolkit,
  Server,
  ServerOptions,
  ServerRoute,
  Plugin,
} from 'hapi';
import * as Raven from 'raven';

import { serverRoutes } from './hapiroutes';
import config from '../config';

const sentry = Raven.config(config.dsn, {
  autoBreadcrumbs: true,
  captureUnhandledRejections: true,
}).install();

const options: ServerOptions = {
  host: 'localhost',
  port: config.port,
  cache: [
    {
      name: 'redisCache',
      engine: require('catbox-redis'),
      host: '127.0.0.1',
      partition: 'honbot',
    },
  ],
};

const ravenPlugin: any = {
  name: 'hapi-raven',
  register: require('hapi-raven').register,
  options: {
    dsn: false,
  },
};

const goodPlugin: any = {
  plugin: require('good'),
  options: {
    ops: {
      interval: 1000,
    },
    reporters: {
      // TODO: silence console reporter for tests
      myConsoleReporter: [
        {
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{ log: '*', response: '*' }],
        },
        {
          module: 'good-console',
        },
        'stdout',
      ],
    },
  },
};

export const server = new Server(options);

export const register = server.register([ravenPlugin, goodPlugin]);
server.route(serverRoutes);

if (!module.parent) {
  register
    .then(() => server.start())
    .then()
    .then(ser => {
      console.log('Server running at:', server.info.uri);
      return server;
    })
    .catch(err => console.log(err));
}
