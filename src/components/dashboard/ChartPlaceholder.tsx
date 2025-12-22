import type { CSSProperties } from 'react';

export type ChartSeries = {
  id: string;
  label: string;
  data: number[];
};

export type ChartSegment = {
  id: string;
  label: string;
  value: number;
};

type ChartVariant = 'line' | 'area' | 'bar' | 'donut';

type ChartPlaceholderProps = {
  title: string;
  subtitle?: string;
  variant: ChartVariant;
  series?: ChartSeries[];
  segments?: ChartSegment[];
};

const CHART_COLORS = ['var(--blue-light)', 'var(--text-secondary)', 'var(--border)'];

const buildLinePath = (data: number[], width: number, height: number) => {
  if (data.length === 0) return '';
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  return data
    .map((value, index) => {
      const x = (index / (data.length - 1 || 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');
};

const ChartPlaceholder = ({
  title,
  subtitle,
  variant,
  series = [],
  segments = [],
}: ChartPlaceholderProps) => {
  const primarySeries = series[0];
  const linePath = primarySeries
    ? buildLinePath(primarySeries.data, 120, 48)
    : '';
  const areaPath = linePath ? `${linePath} L 120 48 L 0 48 Z` : '';

  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const circumference = 2 * Math.PI * 18;

  // Calculate cumulative offsets
  const donutSegments = segments.reduce<{
    accumulatedOffset: number;
    items: (ChartSegment & { style: { strokeDasharray: string; strokeDashoffset: number } })[];
  }>(
    (acc, segment) => {
      const fraction = total ? segment.value / total : 0;
      const length = fraction * circumference;
      const dashArray = `${length} ${circumference - length}`;
      const currentOffset = acc.accumulatedOffset;

      const item = {
        ...segment,
        style: {
          strokeDasharray: dashArray,
          strokeDashoffset: -currentOffset,
        },
      };

      return {
        accumulatedOffset: acc.accumulatedOffset + length,
        items: [...acc.items, item],
      };
    },
    { accumulatedOffset: 0, items: [] }
  ).items;

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h3>{title}</h3>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </div>
      <div className="chart-body">
        {variant === 'bar' ? (
          <svg viewBox="0 0 120 60" role="img" aria-hidden="true">
            {primarySeries?.data.map((value, index) => {
              const barWidth = 6;
              const gap = 4;
              const max = Math.max(...primarySeries.data, 1);
              const height = (value / max) * 40;
              const x = index * (barWidth + gap) + 4;
              const y = 52 - height;
              return (
                <rect
                  key={`bar-${index}`}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={height}
                  rx={2}
                  style={{ fill: CHART_COLORS[0] }}
                />
              );
            })}
          </svg>
        ) : null}
        {variant === 'line' ? (
          <svg viewBox="0 0 120 60" role="img" aria-hidden="true">
            <path d={linePath} className="chart-line" fill="none" />
          </svg>
        ) : null}
        {variant === 'area' ? (
          <svg viewBox="0 0 120 60" role="img" aria-hidden="true">
            <path d={areaPath} className="chart-area" />
            <path d={linePath} className="chart-line" fill="none" />
          </svg>
        ) : null}
        {variant === 'donut' ? (
          <svg viewBox="0 0 60 60" role="img" aria-hidden="true">
            <circle
              cx="30"
              cy="30"
              r="18"
              fill="none"
              stroke="var(--border)"
              strokeWidth="6"
            />
            {donutSegments.map((segment, index) => {
              const style: CSSProperties = {
                stroke: CHART_COLORS[index % CHART_COLORS.length],
                ...segment.style,
              };
              return (
                <circle
                  key={segment.id}
                  cx="30"
                  cy="30"
                  r="18"
                  fill="none"
                  strokeWidth="6"
                  style={style}
                />
              );
            })}
          </svg>
        ) : null}
      </div>
      {(series.length > 0 || segments.length > 0) && (
        <div className="chart-legend">
          {(segments.length > 0 ? segments : series).map((item, index) => (
            <span key={item.id} className="chart-legend-item">
              <span
                className="chart-legend-dot"
                style={{ background: CHART_COLORS[index % CHART_COLORS.length] }}
              />
              {item.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChartPlaceholder;
