import * as Sequelize from 'sequelize';

import config from '../config';
import {
  MatchAttributes,
  PlayerAttributes,
  TrueskillAttributes,
  HeropickAttributes,
  FailedAttributes,
} from './interfaces';

export const sequelize = new Sequelize({
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 10,
    min: 1,
    idle: 1000,
  },
  logging: false,
});

type MatchInstance = Sequelize.Instance<MatchAttributes>;
export const Matches = sequelize.define<MatchInstance, MatchAttributes>('matches', {
  id: { type: Sequelize.INTEGER, primaryKey: true },
  date: { type: Sequelize.DATE },
  length: { type: Sequelize.INTEGER },
  version: { type: Sequelize.STRING(12) },
  map: { type: Sequelize.STRING(25) },
  server_id: { type: Sequelize.INTEGER },
  mode: { type: Sequelize.STRING(25) },
  type: { type: Sequelize.STRING(20) },

  setup_no_repick: { type: Sequelize.INTEGER },
  setup_no_agi: { type: Sequelize.INTEGER },
  setup_drp_itm: { type: Sequelize.INTEGER },
  setup_no_timer: { type: Sequelize.INTEGER },
  setup_rev_hs: { type: Sequelize.INTEGER },
  setup_no_swap: { type: Sequelize.INTEGER },
  setup_no_int: { type: Sequelize.INTEGER },
  setup_alt_pick: { type: Sequelize.INTEGER },
  setup_veto: { type: Sequelize.INTEGER },
  setup_shuf: { type: Sequelize.INTEGER },
  setup_no_str: { type: Sequelize.INTEGER },
  setup_no_pups: { type: Sequelize.INTEGER },
  setup_dup_h: { type: Sequelize.INTEGER },
  setup_ap: { type: Sequelize.INTEGER },
  setup_br: { type: Sequelize.INTEGER },
  setup_em: { type: Sequelize.INTEGER },
  setup_cas: { type: Sequelize.INTEGER },
  setup_rs: { type: Sequelize.INTEGER },
  setup_nl: { type: Sequelize.INTEGER },
  setup_officl: { type: Sequelize.INTEGER },
  setup_no_stats: { type: Sequelize.INTEGER },
  setup_ab: { type: Sequelize.INTEGER },
  setup_hardcore: { type: Sequelize.INTEGER },
  setup_dev_heroes: { type: Sequelize.INTEGER },
  setup_verified_only: { type: Sequelize.INTEGER },
  setup_gated: { type: Sequelize.INTEGER },
  setup_rapidfire: { type: Sequelize.INTEGER },
}, {
  updatedAt: false,
});

type PlayersInstance = Sequelize.Instance<PlayerAttributes>;
export const Players = sequelize.define<PlayersInstance, PlayerAttributes>('players', {
    account_id: { type: Sequelize.INTEGER },
    nickname: { type: Sequelize.STRING(20) },
    lowercaseNickname: { type: Sequelize.STRING(20) },
    clan_id: { type: Sequelize.INTEGER },
    hero_id: { type: Sequelize.INTEGER },
    position: { type: Sequelize.INTEGER },
    items: { type: Sequelize.ARRAY(Sequelize.INTEGER) },
    team: { type: Sequelize.INTEGER },
    level: { type: Sequelize.INTEGER },
    win: { type: Sequelize.BOOLEAN },
    concedes: { type: Sequelize.INTEGER },
    concedevotes: { type: Sequelize.INTEGER },
    buybacks: { type: Sequelize.INTEGER },
    discos: { type: Sequelize.INTEGER },
    kicked: { type: Sequelize.INTEGER },
    mmr_change: { type: Sequelize.DECIMAL },
    herodmg: { type: Sequelize.INTEGER },
    kills: { type: Sequelize.INTEGER },
    assists: { type: Sequelize.INTEGER },
    deaths: { type: Sequelize.INTEGER },
    goldlost2death: { type: Sequelize.INTEGER },
    secs_dead: { type: Sequelize.INTEGER },
    cs: { type: Sequelize.INTEGER },
    bdmg: { type: Sequelize.INTEGER },
    razed: { type: Sequelize.INTEGER },
    denies: { type: Sequelize.INTEGER },
    exp_denied: { type: Sequelize.INTEGER },
    consumables: { type: Sequelize.INTEGER },
    wards: { type: Sequelize.INTEGER },
    bloodlust: { type: Sequelize.INTEGER },
    doublekill: { type: Sequelize.INTEGER },
    triplekill: { type: Sequelize.INTEGER },
    quadkill: { type: Sequelize.INTEGER },
    annihilation: { type: Sequelize.INTEGER },
    ks3: { type: Sequelize.INTEGER },
    ks4: { type: Sequelize.INTEGER },
    ks5: { type: Sequelize.INTEGER },
    ks6: { type: Sequelize.INTEGER },
    ks7: { type: Sequelize.INTEGER },
    ks8: { type: Sequelize.INTEGER },
    ks9: { type: Sequelize.INTEGER },
    ks10: { type: Sequelize.INTEGER },
    ks15: { type: Sequelize.INTEGER },
    smackdown: { type: Sequelize.INTEGER },
    humiliation: { type: Sequelize.INTEGER },
    nemesis: { type: Sequelize.INTEGER },
    retribution: { type: Sequelize.INTEGER },
    used_token: { type: Sequelize.INTEGER },
    time_earning_exp: { type: Sequelize.INTEGER },
    teamcreepkills: { type: Sequelize.INTEGER },
    teamcreepdmg: { type: Sequelize.INTEGER },
    teamcreepexp: { type: Sequelize.INTEGER },
    teamcreepgold: { type: Sequelize.INTEGER },
    neutralcreepkills: { type: Sequelize.INTEGER },
    neutralcreepdmg: { type: Sequelize.INTEGER },
    neutralcreepexp: { type: Sequelize.INTEGER },
    neutralcreepgold: { type: Sequelize.INTEGER },
    actions: { type: Sequelize.INTEGER },
    gold: { type: Sequelize.INTEGER },
    exp: { type: Sequelize.INTEGER },
    kdr: { type: Sequelize.FLOAT },
    gpm: { type: Sequelize.FLOAT },
    xpm: { type: Sequelize.FLOAT },
    apm: { type: Sequelize.FLOAT },
  }, {
    timestamps: false,
    indexes: [
      { unique: false, fields: ['account_id'] },
      { fields: ['lowercaseNickname'] },
      { fields: ['matchId'] },
    ],
  },
);

Players.belongsTo(Matches);
Matches.hasMany(Players);

type TrueskillInstance = Sequelize.Instance<TrueskillAttributes>;
export const Trueskill = sequelize.define<TrueskillInstance, TrueskillAttributes>('trueskills', {
    account_id: { type: Sequelize.INTEGER, primaryKey: true },
    mu: { type: Sequelize.FLOAT, defaultValue: 25 },
    sigma: { type: Sequelize.FLOAT, defaultValue: (25 / 3) },
    games: { type: Sequelize.INTEGER, defaultValue: 1 },
  }, {
    timestamps: false,
  },
);

type HeropickInstance = Sequelize.Instance<HeropickAttributes>;
export const Heropick = sequelize.define<HeropickInstance, HeropickAttributes>('heropicks', {
    date: { type: Sequelize.DATE, unique: 'compositeIndex' },
    hero_id: { type: Sequelize.INTEGER, unique: 'compositeIndex' },
    loss: { type: Sequelize.INTEGER, defaultValue: 0 },
    win: { type: Sequelize.INTEGER, defaultValue: 0 },
  }, {
    timestamps: false,
    indexes: [
      { fields: ['date'] },
    ],
  },
);

type FailedInstance = Sequelize.Instance<FailedAttributes>;
export const Failed = sequelize.define<FailedInstance, FailedAttributes>('fails', {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    attempts: { type: Sequelize.INTEGER, defaultValue: 0 },
  }, {
    indexes: [
      { fields: ['attempts'] },
    ],
  },
);
