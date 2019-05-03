import React from 'react';
import ContentLoader, { BulletList } from 'react-content-loader';

export default props => {
  return (
    <BulletList
      speed={2}
      primaryColor="#e0e0e0"
      secondaryColor="#ecebeb"
      style={{
        height: '152px',
        width: '100%',
      }}
    />
  );
};
