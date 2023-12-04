import React from 'react';

const Debugger = ({ json }: { json: string | undefined }) => {
  return (
    <>
      {json ? (
        <div className='max-w-full overflow-auto rounded-md bg-background p-4 text-foreground'>
          <pre className='max-w-full overflow-auto'>
            {JSON.stringify(JSON.parse(json), null, 2)}
          </pre>
        </div>
      ) : (
        <p>no data</p>
      )}
    </>
  );
};

export default Debugger;
