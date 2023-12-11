type Props = {
  sort: 'asc' | 'desc' | 'none';
  color?: string;
  width?: number;
};
const SortIcon = ({ sort, color = '#97A3B6', width = 2.5 }: Props) => {
  let upArrowFill = color;
  let downArrowFill = color;

  if (sort === 'asc') {
    upArrowFill = '#ea0062';
  } else if (sort === 'desc') {
    downArrowFill = '#ea0062';
  }

  const scale = 0.75;

  return (
    <div className='flex items-center justify-center'>
      <svg width={20} height={20} fill='none'>
        <g
          stroke={color}
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={width}
        >
          <path
            d='m21 16-4 4-4-4M17 20V4'
            stroke={upArrowFill}
            opacity={sort === 'asc' ? 1 : 0.5}
            transform={`scale(${scale})`}
          />
          <path
            d='m3 8 4-4 4 4M7 4v16'
            stroke={downArrowFill}
            opacity={sort === 'desc' ? 1 : 0.5}
            transform={`scale(${scale})`}
          />
        </g>
      </svg>
    </div>
  );
};
export default SortIcon;
