import { API_AUCTION_LISTINGS_URL } from '../constants';

export const getAllListings = async () =>
  fetch(
    `${API_AUCTION_LISTINGS_URL}?_seller=true&_bids=true&sort=created`,
  ).then((data) => {
    if (!data.ok) {
      throw new Error('An error occurred while fetching the data.');
    }
    return data.json();
  });
