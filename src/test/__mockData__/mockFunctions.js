import { faker } from '@faker-js/faker';

const rowCount = 142;
const metricCount = 10;
const metricKeys = [...Array(metricCount)].map((item, i) => `metric_${i}`);
const countries = faker.helpers.uniqueArray(faker.address.country, rowCount);
const continents = ['Asia', 'Europe', 'Africa', 'Americas', 'Oceania'];

const generateMetricValues = () => {
  const obj = {};
  metricKeys.forEach((metric) => {
    obj[metric] = faker.datatype.number({ min: -2, max: 4, precision: 0.01 });
  });

  return obj;
};

const makeFakerArray = (length, generator) => Array.from({ length }, generator);

const generateBreaks = (count, range) =>
  Array.from({ length: count }, (_, i) => (i * range[1] - range[0] / (count - 1) + range[0]).toFixed(2));

const generateDist = () => {
  const distObj = {};
  countries.forEach((country) => {
    distObj[country] = 1;
  });

  return distObj;
};

const generateDisplayObjMetrics = () => {
  const obj = {};
  const groups = faker.helpers.uniqueArray(faker.music.genre, 3);
  metricKeys.forEach((metric) => {
    const numberRange = [faker.datatype.number({ min: -10, max: 0 }), faker.datatype.number({ min: 1, max: 10 })];
    obj[metric] = {
      name: metric,
      desc: faker.lorem.paragraph(),
      type: 'numeric',
      group: faker.helpers.arrayElement(groups),
      defLabel: faker.datatype.boolean(),
      defActive: faker.datatype.boolean(),
      filterable: faker.datatype.boolean(),
      log: null,
      range: numberRange,
      nnna: rowCount,
      breaks: generateBreaks(faker.datatype.number({ min: 3, max: 12 }), numberRange),
      delta: 0.5,
    };
  });

  return obj;
};

const generateDisplayObjCogDistns = () => {
  const obj = {};
  metricKeys.forEach((metric) => {
    const numberRange = [faker.datatype.number({ min: -10, max: 0 }), faker.datatype.number({ min: 1, max: 10 })];
    obj[metric] = {
      type: 'numeric',
      dist: {
        raw: {
          breaks: generateBreaks(faker.datatype.number({ min: 3, max: 12 }), numberRange),
          freq: makeFakerArray(faker.datatype.number({ min: 3, max: 13 }), faker.datatype.number),
        },
      },
      log_default: faker.datatype.boolean(),
    };
  });

  return obj;
};

export const createCogData = () =>
  countries.map((country) => ({
    country,
    continent: faker.helpers.arrayElement(continents),
    ...generateMetricValues(),
    panelKey: country,
  }));

export const createConfig = () => ({
  display_base: 'displays',
  data_type: 'json',
  cog_server: {
    type: 'json',
    info: {
      base: 'displays',
    },
  },
  split_layout: faker.datatype.boolean(),
  has_legend: faker.datatype.boolean(),
  require_token: false,
  disclaimer: faker.datatype.boolean(),
});

export const createDisplayList = (options) => [
  {
    group: 'common',
    name: 'gapminder_life_expectancy',
    desc: 'This is the description of the data.',
    n: 142,
    order: 1,
    height: faker.datatype.number({ min: 320, max: 3000 }),
    width: faker.datatype.number({ min: 320, max: 3000 }),
    updated: faker.date.past(),
    keySig: faker.random.alphaNumeric(32),
    ...options,
  },
];

export const createDisplayObj = (options) => ({
  group: 'common',
  name: 'gapminder_life_expectancy',
  desc: 'This is the description of the data.',
  mdDesc: faker.lorem.paragraph(),
  mdTitle: faker.lorem.sentence(),
  showMdDesc: faker.datatype.boolean(),
  updated: faker.date.past(),
  n: rowCount,
  height: faker.datatype.number({ min: 320, max: 3000 }),
  width: faker.datatype.number({ min: 320, max: 3000 }),
  order: 1,
  has_legend: faker.datatype.boolean(),
  has_inputs: faker.datatype.boolean(),
  input_type: {},
  input_email: {},
  input_csv_vars: {},
  input_api: {},
  gaID: {},
  split_layout: faker.datatype.boolean(),
  split_aspect: {},
  keySig: faker.random.alphaNumeric(32),
  cogInterface: {
    name: 'gapminder_life_expectancy',
    group: 'common',
    type: 'JSON',
  },
  panelInterface: {
    type: 'image',
  },
  imgSrcLookup: {},
  cogInfo: {
    country: {
      name: 'country',
      desc: 'conditioning variable',
      type: 'factor',
      group: 'condVar',
      defLabel: faker.datatype.boolean(),
      defActive: faker.datatype.boolean(),
      filterable: faker.datatype.boolean(),
      log: null,
      levels: countries,
    },
    continent: {
      name: 'continent',
      desc: faker.lorem.sentence(),
      type: 'factor',
      group: 'condVar',
      defLabel: faker.datatype.boolean(),
      defActive: faker.datatype.boolean(),
      filterable: faker.datatype.boolean(),
      log: null,
      levels: continents,
    },
    ...generateDisplayObjMetrics(),
    panelKey: {
      name: 'panelKey',
      desc: faker.lorem.sentence,
      type: 'key',
      group: 'panelKey',
      defLabel: faker.datatype.boolean(),
      defActive: true,
      filterable: false,
      log: null,
    },
  },
  cogDistns: {
    country: {
      type: 'factor',
      dist: generateDist(),
      has_dist: true,
      max: 1,
    },
    continent: {
      type: 'factor',
      dis: {
        Africa: 52,
        Asia: 33,
        Europe: 30,
        Americas: 25,
        Oceania: 2,
      },
      has_dist: true,
      max: 52,
    },
    ...generateDisplayObjCogDistns(),
    panelKey: {
      type: 'key',
      dist: {},
    },
  },
  state: {
    layout: {
      nrow: 3,
      ncol: 6,
      arrange: 'row',
    },
    label: ['country'],
    sort: [
      {
        order: 1,
        name: 'country',
        dir: 'asc',
      },
    ],
  },
  cogGroups: {
    condVar: ['country'],
    common: ['continent'],
    [faker.music.songName()]: metricKeys.slice(0, Math.round(metricKeys.length / 2)),
    [faker.music.songName()]: metricKeys.slice(Math.round(metricKeys.length / 2), metricKeys.length),
    panelKey: ['panelKey'],
  },
  ...options,
});

export const createPanelData = () => faker.image.cats(300, 300, true);
