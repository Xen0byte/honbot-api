import debug from 'debug';
import * as _ from 'lodash';
import * as Sentry from '@sentry/node';
import { differenceInMinutes, subHours } from 'date-fns';

import config from '../config';
import { findNewest, grabAndSave } from './matches';
import sleep from './sleep';
import { Failed } from './entity/Failed';
import { getConnection } from './db';

const log = debug('honbot');

const STARTING_MATCH_ID = 149396730;
const BATCH_SIZE = 25;
let notExit = true;

async function findNewMatches() {
  const [newestMatchId, newestMatchDate, diff] = await findNewest();
  if (diff > 25) {
    await sleep(1800000, 'made no forward progress');
  }

  if (newestMatchId) {
    const minutes = differenceInMinutes(new Date(), new Date(newestMatchDate));
    const hours = Math.round(minutes / 60);
    log(`Newest: ${newestMatchId} - Age: ${hours} hours`);
    if (minutes < 180) {
      await sleep(1800000, 'matches too recent');
      if (notExit) {
        findNewMatches().catch(e => catchError(e));
        return;
      }
    }
  }

  const newest = newestMatchId ? newestMatchId : STARTING_MATCH_ID;
  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  const matchIds = _.range(newest + 1, newest + BATCH_SIZE).map(String);
  log('Finding new matches!');
  await grabAndSave(matchIds, true);
  await sleep(3000, 'findNewMatches sleep');
  if (notExit) {
    findNewMatches().catch(e => catchError(e));
  }
}

async function findAllMissing() {
  let cur = 0;
  const hourAgo = subHours(new Date(), 1);
  const conn = await getConnection();
  const missing = await conn.createQueryBuilder().select('failed').from(Failed, 'failed')
    .where('failed.id > :cur', { cur })
    .andWhere('failed.attempts < 5')
    .andWhere('failed.updatedAt < :hourAgo', { hourAgo })
    .limit(25)
    .orderBy('failed.id')
    .getMany();
  if (!missing.length) {
    // wait 30 minutes
    await sleep(3600000, 'no missing found, reset cursor');
    cur = 0;
    if (notExit) {
      findAllMissing().catch(e => catchError(e));
      return;
    }
  }

  const missingIds = missing.map(x => x.id);
  log('Attempting old matches!');
  await grabAndSave(missingIds, false);
  cur = missingIds[missingIds.length - 1];
  await sleep(10000, 'findAllMissing sleeping');
  if (notExit) {
    findAllMissing().catch(e => catchError(e));
  }
}

process.on('SIGINT', () => {
  notExit = false;
  setTimeout(() => {
    // 300ms later the process kill it self to allow a restart
    process.exit(0);
  }, 2000);
});

function catchError(err: Error) {
  log(err);
  Sentry.captureException(err);
  process.exit(0);
}

if (!module.parent) {
  Sentry.init({ dsn: config.dsn });
  findNewMatches().catch(e => catchError(e));
  findAllMissing().catch(e => catchError(e));
}
