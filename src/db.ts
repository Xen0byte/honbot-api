import * as debug from 'debug';
import { Db, MongoClient } from 'mongodb';

import config from '../config';

const log = debug('honbot');

const db: Promise<Db> = new Promise((resolve, reject) => {
  log('Connecting to database');
  resolve(MongoClient.connect(config.db));
});

export default db;