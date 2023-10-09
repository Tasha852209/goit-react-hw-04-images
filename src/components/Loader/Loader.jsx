import React from 'react';
import { Audio } from 'react-loader-spinner';

export const Loader = () => {
  return (
    <div>
      <Audio
        height={80}
        width={80}
        radius={9}
        color="green"
        ariaLabel="loading"
        wrapperStyle={{ position: 'absolute', top: '50%', left: '50%' }}
      />
    </div>
  );
};
