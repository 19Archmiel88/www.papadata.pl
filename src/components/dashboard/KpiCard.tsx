type KpiTrend = 'up' | 'down' | 'neutral';

type KpiCardProps = {
  label: string;
  value: string;
  change?: string;
  trend?: KpiTrend;
  helper?: string;
};

const KpiCard = ({ label, value, change, trend = 'neutral', helper }: KpiCardProps) => {
  const changeClass = `kpi-change kpi-change--${trend}`;

  return (
    <div className="kpi-card">
      <span className="kpi-label">{label}</span>
      <strong className="kpi-value">{value}</strong>
      {change ? (
        <div className={changeClass}>
          <span className="kpi-change-value">{change}</span>
          {helper ? <span className="kpi-change-label">{helper}</span> : null}
        </div>
      ) : null}
    </div>
  );
};

export default KpiCard;
