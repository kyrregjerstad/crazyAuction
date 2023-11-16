import { API_AUCTION_LISTINGS_URL } from '../constants';

export const getSingleListing = async ({ id }: { id: string }) =>
  fetch(`${API_AUCTION_LISTINGS_URL}/${id}?_seller=true&_bids=true`).then(
    (data) => {
      if (!data.ok) {
        throw new Error('An error occurred while fetching the data.');
      }
      return data.json();
    },
  );
