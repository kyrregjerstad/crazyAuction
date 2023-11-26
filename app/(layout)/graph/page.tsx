import Graph from './Graph';

import { ListingFull } from '@/lib/schemas/listing';
import { User } from '@/lib/schemas/user';
import { promises as fs } from 'fs';

// const redis = Redis.fromEnv();

export const revalidate = 0; // disable cache

type Bid = {
  id: string;
  amount: number;
  created: string;
  bidderName: string;
};

type TransformedUserListing = {
  id: string;
  title: string;
  tags: string[];
  created: string;
  endsAt: string;
  bids: Bid[];
  winningBid: Bid | null;
  seller: User;
};

export type TransformedUser = {
  name: string;
  avatar: string | null;
  credits: number;
  wins: string[];
  listings: TransformedUserListing[];
};

export type NodeType = {
  id: string;
  name: string;
  label: string;
  avatar: string | null;
  credits: number;
  wins: string[];
  listings: TransformedUserListing[];
  neighbors: NodeType[];
  links: LinkType[];
};

export type LinkType = {
  source: string;
  target: string;
  amount: number;
  created: string;
  bidderName: string;
};

const GraphPage = async () => {
  const allAuctionsFile = await fs.readFile(
    './public/allAuctions.json',
    'utf-8',
  );
  const allUsersFile = await fs.readFile('./public/allUsers.json', 'utf-8');

  const allAuctions = JSON.parse(allAuctionsFile) as ListingFull[];
  const allUsers = JSON.parse(allUsersFile) as TransformedUser[];

  const nodes: NodeType[] = allUsers.map((user) => ({
    id: user.name,
    name: user.name,
    label: user.name,
    avatar: user.avatar,
    credits: user.credits,
    wins: user.wins,
    listings: user.listings,
    neighbors: [] as NodeType[],
    links: [] as LinkType[],
  }));

  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  const links: LinkType[] = allAuctions
    .flatMap(
      (auction) =>
        auction.bids?.map((bid) => {
          const sourceNode = nodeMap.get(auction.seller.name);
          const targetNode = nodeMap.get(bid.bidderName);

          if (!sourceNode || !targetNode) return undefined;

          const link = {
            source: auction.seller.name,
            target: bid.bidderName,
            amount: bid.amount,
            created: bid.created,
            bidderName: bid.bidderName,
          };

          // Add to neighbors and links
          sourceNode.neighbors.push(targetNode);
          targetNode.neighbors.push(sourceNode);
          sourceNode.links.push(link);
          targetNode.links.push(link);

          return link;
        }),
    )
    .filter((link): link is LinkType => link !== undefined);

  const data = {
    nodes,
    links,
  };

  return <Graph data={data} />;
};

export default GraphPage;
