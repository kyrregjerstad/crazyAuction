// @ts-nocheck
'use client';
// @ts-ignore
import ForceGraph2D, {
  type ForceGraphMethods,
  type NodeObject,
  type LinkObject,
} from 'react-force-graph-2d';

import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from 'react';
import { LinkType, NodeType } from './page';

type ExtendedNodeObject = NodeObject & NodeType;
type ExtendedLinkObject = LinkObject & LinkType;

type GraphData = {
  nodes: NodeType[];
  links: LinkType[];
};

type Props = {
  data: GraphData;
};

const Graph = ({ data }: Props) => {
  const ref =
    useRef<ForceGraphMethods<ExtendedNodeObject, ExtendedLinkObject>>();

  const [charge, setCharge] = useState(-120);
  const [linkDistance, setLinkDistance] = useState(230);
  const [d3VelocityDecay, setD3VelocityDecay] = useState(0.1);
  const [d3AlphaDecay, setD3AlphaDecay] = useState(0.08);
  const [maxDistanceFromCenter, setMaxDistanceFromCenter] = useState(1000);
  const [nodeSize, setNodeSize] = useState(12);

  useEffect(() => {
    ref.current?.d3Force('charge')?.strength(charge);
    ref.current?.d3Force('charge')?.distanceMax(maxDistanceFromCenter);
    ref.current?.d3Force('link')?.distance(linkDistance);

    ref.current?.d3ReheatSimulation();
  }, [
    charge,
    linkDistance,
    d3VelocityDecay,
    d3AlphaDecay,
    maxDistanceFromCenter,
  ]);

  const memoizedData = useMemo(() => {
    const nodesById = new Map(
      data.nodes.map((node) => [
        node.id,
        { ...node, neighbors: [], links: [] },
      ]),
    );

    data.links.forEach((link) => {
      const a = nodesById.get(link.source) as NodeType | undefined;
      const b = nodesById.get(link.target) as NodeType | undefined;

      if (a && b) {
        a.neighbors.push(b);
        b.neighbors.push(a);
        a.links.push(link);
        b.links.push(link);
      }
    });

    return { nodes: Array.from(nodesById.values()), links: data.links };
  }, [data]);

  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [hoverNode, setHoverNode] = useState<NodeObject | null>(null);

  const updateHighlight = () => {
    setHighlightNodes(highlightNodes);
    setHighlightLinks(highlightLinks);
  };

  const handleNodeHover = (node: ExtendedNodeObject | null) => {
    highlightNodes.clear();
    highlightLinks.clear();
    if (node) {
      highlightNodes.add(node);
      node.neighbors?.forEach((neighbor) => highlightNodes.add(neighbor));
      node.links?.forEach((link) => highlightLinks.add(link));
    }

    setHoverNode(node || null);
    updateHighlight();
  };

  const renderNode = useCallback(
    (node: ExtendedNodeObject, ctx: CanvasRenderingContext2D) => {
      // add ring just for highlighted nodes
      const { x, y, credits } = node;
      if (!x || !y) return;

      // const baseNodeSize = nodeSize * credits
      // const nodeSize = Math.max(baseNodeSize, 5);

      const nodeSideMultiplied = (nodeSize * credits) / 1000;

      ctx.beginPath();
      ctx.arc(x, y, nodeSideMultiplied, 0, 2 * Math.PI, false);
      ctx.fillStyle = node === hoverNode ? '#ff086f' : '#ea0062';
      ctx.fill();
    },
    [hoverNode, nodeSize],
  );

  const renderLink = useCallback(
    (
      link: ExtendedLinkObject,
      ctx: CanvasRenderingContext2D,
      globalScale: number,
    ) => {
      const start = link.source;
      const end = link.target;

      if (!start || !end) return;

      ctx.beginPath();
      // ctx.moveTo(start.x, start.y);
      // ctx.lineTo(end.x, end.y);
      ctx.strokeStyle = '#ffffffa0';
      // ctx.lineWidth = Math.max(globalScale / 2, 0.5);
      ctx.lineWidth = 0.15;
      ctx.stroke();
    },
    [],
  );

  return (
    <div className='relative w-full max-w-full overflow-hidden'>
      <div className='absolute right-0 top-0 z-50 flex flex-col bg-background p-4'>
        <label htmlFor='charge'>Charge</label>
        <input
          className='w-48'
          type='range'
          min={-1000}
          max={1000}
          name='charge'
          id='charge'
          value={charge}
          onChange={(e) => setCharge(parseInt(e.currentTarget.value))}
        />
        <div>{charge}</div>
        <label htmlFor='distance'>Distance</label>
        <input
          className='w-48'
          type='range'
          min={0}
          max={5000}
          name='distance'
          id='distance'
          value={linkDistance}
          onChange={(e) => setLinkDistance(parseInt(e.currentTarget.value))}
        />
        <div>{linkDistance}</div>
        <label htmlFor='velocity'>Velocity</label>
        <input
          className='w-48'
          type='range'
          min={0}
          max={1}
          step={0.01}
          name='velocity'
          id='velocity'
          value={d3VelocityDecay}
          onChange={(e) =>
            setD3VelocityDecay(parseFloat(e.currentTarget.value))
          }
        />
        <div>{d3VelocityDecay}</div>
        <label htmlFor='decay'>Decay</label>
        <input
          className='w-48'
          type='range'
          min={0}
          max={1}
          step={0.01}
          name='decay'
          id='decay'
          value={d3AlphaDecay}
          onChange={(e) => setD3AlphaDecay(parseFloat(e.currentTarget.value))}
        />
        <div>{d3AlphaDecay}</div>
        <label htmlFor='maxDistance'>Max Distance</label>
        <input
          className='w-48'
          type='range'
          min={0}
          max={1000}
          name='maxDistance'
          id='maxDistance'
          value={maxDistanceFromCenter}
          onChange={(e) =>
            setMaxDistanceFromCenter(parseInt(e.currentTarget.value))
          }
        />
        <div>{maxDistanceFromCenter}</div>
        <label htmlFor='nodeSize'>Node Size</label>
        <input
          className='w-48'
          type='range'
          min={0}
          max={100}
          name='nodeSize'
          id='nodeSize'
          value={nodeSize}
          onChange={(e) => setNodeSize(parseInt(e.currentTarget.value))}
        />
        <div>{nodeSize}</div>
      </div>
      <ForceGraph2D
        ref={ref}
        nodeId='name'
        graphData={memoizedData}
        nodeLabel='label'
        autoPauseRedraw={false}
        linkDirectionalParticles={4}
        linkDirectionalParticleSpeed={0.001}
        backgroundColor='#0a0908'
        linkWidth={(link) => (highlightLinks.has(link) ? 10 : 1)}
        d3AlphaDecay={d3AlphaDecay}
        d3VelocityDecay={d3VelocityDecay}
        nodeCanvasObjectMode={(node) =>
          highlightNodes.has(node) ? 'before' : 'replace'
        }
        linkCanvasObjectMode={(link) =>
          highlightLinks.has(link) ? 'before' : 'replace'
        }
        nodeCanvasObject={renderNode}
        linkCanvasObject={renderLink}
        onNodeHover={handleNodeHover}
      />
    </div>
  );
};

export default Graph;
