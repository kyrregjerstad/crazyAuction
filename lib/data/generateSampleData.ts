import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { nanoid } from 'nanoid';
import { ListingFull } from '../schemas/listingSchema';
dayjs.extend(relativeTime);

export const TimeIntervals = {
  oneWeek: 1000 * 60 * 60 * 24 * 7,
  twoDays: 1000 * 60 * 60 * 24 * 2,
  oneDay: 1000 * 60 * 60 * 24,
  twelveHours: 1000 * 60 * 60 * 12,
  oneHour: 1000 * 60 * 60,
  tenMinutes: 1000 * 60 * 10,
  oneMinute: 1000 * 60,
  tenSeconds: 1000 * 10,
  fiveSeconds: 1000 * 5,
  oneSecond: 1000,
} as const;

export const AuctionEnds = {
  upcoming: {
    oneWeek: new Date(Date.now() + TimeIntervals.oneWeek).toISOString(),
    twoDays: new Date(Date.now() + TimeIntervals.twoDays).toISOString(),
    oneDay: new Date(Date.now() + TimeIntervals.oneDay).toISOString(),
    oneHour: new Date(Date.now() + TimeIntervals.oneHour).toISOString(),
    tenMinutes: new Date(Date.now() + TimeIntervals.tenMinutes).toISOString(),
    oneMinute: new Date(Date.now() + TimeIntervals.oneMinute).toISOString(),
    tenSeconds: new Date(Date.now() + TimeIntervals.tenSeconds).toISOString(),
    fiveSeconds: new Date(Date.now() + TimeIntervals.fiveSeconds).toISOString(),
    oneSecond: new Date(Date.now() + TimeIntervals.oneSecond).toISOString(),
  },
  past: {
    oneWeek: new Date(Date.now() - TimeIntervals.oneWeek).toISOString(),
    twoDays: new Date(Date.now() - TimeIntervals.twoDays).toISOString(),
    oneDay: new Date(Date.now() - TimeIntervals.oneDay).toISOString(),
    oneHour: new Date(Date.now() - TimeIntervals.oneHour).toISOString(),
    tenMinutes: new Date(Date.now() - TimeIntervals.tenMinutes).toISOString(),
    oneMinute: new Date(Date.now() - TimeIntervals.oneMinute).toISOString(),
    tenSeconds: new Date(Date.now() - TimeIntervals.tenSeconds).toISOString(),
    fiveSeconds: new Date(Date.now() - TimeIntervals.fiveSeconds).toISOString(),
    oneSecond: new Date(Date.now() - TimeIntervals.oneSecond).toISOString(),
  },
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
    created: new Date(TimeIntervals.oneWeek * -1).toISOString(),
    updated: new Date(TimeIntervals.oneDay * -1).toISOString(),
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
