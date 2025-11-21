import React from 'react';

interface VectorsBackgroundProps {
  width?: string;
  height?: string;
  show?: boolean;
}

export const VectorsBackground: React.FC<VectorsBackgroundProps> = ({
  width = '569px',
  height = '704px',
  show = true
}) => {
  if (!show) return null;

  return (
    <div
      style={{
        position: 'absolute',
        right: '0',
        top: '0',
        width,
        height,
        overflow: 'visible',
        pointerEvents: 'none',
        zIndex: 1
      }}
    >
      <img
        src={`${import.meta.env.BASE_URL}vectors.svg`}
        alt=""
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          position: 'absolute',
          right: '0',
          top: '0'
        }}
      />
    </div>
  );
};
