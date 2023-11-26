import fs from 'fs/promises';

export async function fetchAllUsers() {
  try {
    let allData: any[] = [];
    let offset = 0;
    const limit = 100; // Adjust if needed
    let hasMore = true;

    const options = {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OTM5LCJuYW1lIjoicmVkaXMiLCJlbWFpbCI6InJlZGlzQG5vcm9mZi5ubyIsImF2YXRhciI6bnVsbCwiY3JlZGl0cyI6MTAwMCwid2lucyI6W10sImlhdCI6MTcwMDk0ODU3MX0.dGZAGPs5x_bhziN4fGWiKF_czwjoxCV9KpHrMk7TSRg`,
      },
    };

    while (hasMore) {
      const response = await fetch(
        `https://api.noroff.dev/api/v1/auction/profiles?_listings=true&limit=${limit}&offset=${offset}`,
        options,
      );
      const pageData = await response.json();

      allData = allData.concat(pageData);

      if (pageData.length < limit) {
        hasMore = false;
      } else {
        offset += limit;
      }
    }

    await fs.writeFile(
      'allUsers.json',
      JSON.stringify(allData, null, 2),
      'utf-8',
    );

    return allData;
  } catch (error) {
    return new Response('Error fetching data', { status: 500 });
  }
}

export async function fetchAllAuctionListings() {
  try {
    let allData: any[] = [];
    let offset = 0;
    const limit = 100; // Adjust if needed
    let hasMore = true;

    while (hasMore) {
      console.log('Fetching page', offset / limit);

      const response = await fetch(
        `https://api.noroff.dev/api/v1/auction/listings?_seller=true&_bids=true&limit=${limit}&offset=${offset}`,
      );
      const pageData = (await response.json()) as any[];

      allData = allData.concat(pageData);

      if (pageData.length < limit) {
        hasMore = false;
      } else {
        offset += limit;
      }
    }

    await fs.writeFile(
      'allAuctionListings.json',
      JSON.stringify(allData, null, 2),
      'utf-8',
    );

    return allData;
  } catch (error) {
    return new Response('Error fetching data', { status: 500 });
  }
}
