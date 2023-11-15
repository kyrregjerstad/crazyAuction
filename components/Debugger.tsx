import React from 'react';

const Debugger = ({ json }: { json: string }) => {
  return (
    <div className='overflow-auto rounded-md bg-background p-4 text-foreground'>
      <pre>{JSON.stringify(JSON.parse(json), null, 2)}</pre>
    </div>
  );
};

export default Debugger;
