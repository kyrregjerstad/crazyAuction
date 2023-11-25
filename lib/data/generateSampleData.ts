import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { nanoid } from 'nanoid';
import { ListingFull } from '../schemas/listing';
dayjs.extend(relativeTime);

const IN_ONE_WEEK = 1000 * 60 * 60 * 24 * 7;
const IN_TWO_DAYS = 1000 * 60 * 60 * 24 * 2;
const IN_ONE_DAY = 1000 * 60 * 60 * 24;
const IN_ONE_HOUR = 1000 * 60 * 60;
const IN_TEN_MINUTES = 1000 * 60 * 10;
const IN_ONE_MINUTE = 1000 * 60;

export const AuctionEndsIn = {
  oneWeek: new Date(Date.now() + IN_ONE_WEEK).toISOString(),
  twoDays: new Date(Date.now() + IN_TWO_DAYS).toISOString(),
  oneDay: new Date(Date.now() + IN_ONE_DAY).toISOString(),
  oneHour: new Date(Date.now() + IN_ONE_HOUR).toISOString(),
  tenMinutes: new Date(Date.now() + IN_TEN_MINUTES).toISOString(),
  oneMinute: new Date(Date.now() + IN_ONE_MINUTE).toISOString(),
} as const;

export const generateSampleData = (overrides: Partial<ListingFull> = {}) => {
  const defaults: ListingFull = {
    id: nanoid(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    tags: Array.from({ length: 5 }, () => faker.commerce.productAdjective()),
    media: Array.from(
      { length: 3 },
      () => 'https://source.unsplash.com/random/900x700/?painting',
    ),
    created: new Date(IN_ONE_WEEK * -1).toISOString(),
    updated: new Date(IN_ONE_DAY * -1).toISOString(),
    endsAt: 'in 10 days',
    seller: {
      name: faker.internet.userName(),
      email: faker.internet.email(),
      avatar: faker.internet.avatar(),
    },
    bids: Array.from({ length: 4 }, generateBid),
    _count: {
      bids: 4,
    },
  };

  return {
    ...defaults,
    ...overrides,
  };
};

const randomDate = (start: Date, end: Date) =>
  dayjs(start)
    .add(Math.random() * dayjs(end).diff(dayjs(start)), 'millisecond')
    .toISOString();

const generateBid = () => ({
  id: nanoid(),
  amount: Math.floor(Math.random() * 500 + 1),
  bidderName: faker.internet.userName(),
  created: randomDate(new Date(2020, 0, 1), new Date()),
});
