import React from "react";

interface PriceSparklineProps {
  data: number[];
  width?: number;
  height?: number;
}

const PriceSparkline: React.FC<PriceSparklineProps> = ({
  data,
  width = 220,
  height = 80,
}) => {
  if (!data.length) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-[#9EA5B5]">
        No trades yet
      </div>
    );
  }

  const normalized = data.length === 1 ? [...data, ...data] : data;
  const maxValue = 100;
  const minValue = 0;

  const points = normalized.map((value, index) => {
    const x =
      normalized.length === 1
        ? width
        : (index / (normalized.length - 1)) * width;
    const clamped = Math.min(maxValue, Math.max(minValue, value));
    const y = height - (clamped / (maxValue - minValue)) * height;
    return { x, y };
  });

  const pathD = points
    .map(({ x, y }, index) => `${index === 0 ? "M" : "L"} ${x} ${y}`)
    .join(" ");

  const areaD = `M 0 ${height} ${pathD} L ${width} ${height} Z`;
  const lastPoint = points[points.length - 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="100%"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="sparklineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(252, 213, 53, 0.5)" />
          <stop offset="100%" stopColor="rgba(252, 213, 53, 0)" />
        </linearGradient>
      </defs>
      <path
        d={areaD}
        fill="url(#sparklineGradient)"
        stroke="none"
        opacity={0.35}
      />
      <path
        d={pathD}
        fill="none"
        stroke="#FCD535"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={lastPoint.x}
        cy={lastPoint.y}
        r={3.5}
        fill="#04070d"
        stroke="#FCD535"
        strokeWidth={2}
      />
    </svg>
  );
};

export default PriceSparkline;
