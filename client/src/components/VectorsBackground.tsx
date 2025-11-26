interface VectorsBackgroundProps {
  width?: string;
  height?: string;
  show?: boolean;
}

export function VectorsBackground({
  width = '472px',
  height = '523px',
  show = true
}: VectorsBackgroundProps) {
  if (!show) return null;

  return (
    <div
      className="k-pos-absolute k-overflow-visible"
      style={{
        right: '0',
        top: '0',
        width,
        height,
        pointerEvents: 'none',
        zIndex: 1
      }}
    >
      <img
        className="k-h-full k-w-full k-d-block k-pos-absolute"
        src={`${import.meta.env.BASE_URL}vectors.svg`}
        alt=""
        style={{
          right: '0',
          top: '0'
        }}
      />
    </div>
  );
}
