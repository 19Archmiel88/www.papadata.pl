import React, { useMemo, useState, useId, memo } from 'react';
import type { Translation } from '../types';
import { InteractiveButton } from './InteractiveButton';
import { motion, useReducedMotion } from 'framer-motion';
import { useModal } from '../context/useModal';
import { getNumberFormatter } from '../utils/formatters';

interface RoiSectionProps {
  t: Translation;
  onCtaClick?: () => void;
}

const sanitizeDomId = (v: string) => v.replace(/[^a-zA-Z0-9_-]/g, '_');

const ComputingPulse = memo(({ label }: { label: string }) => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5" aria-hidden="true">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={reduceMotion ? undefined : { height: [3, 8, 3] }}
            transition={
              reduceMotion ? undefined : { duration: 1, repeat: Infinity, delay: i * 0.2 }
            }
            className="w-0.5 bg-brand-start/40 rounded-full"
            style={reduceMotion ? { height: 4 } : undefined}
          />
        ))}
      </div>
      <span className="text-4xs font-mono font-black text-brand-start tracking-widest uppercase">
        {label}
      </span>
    </div>
  );
});
ComputingPulse.displayName = 'ComputingPulse';

const MetricRing = memo(({ progress, color }: { progress: number; color: string }) => (
  <div className="relative w-8 h-8 md:w-10 md:h-10" aria-hidden="true">
    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 40 40">
      <circle
        cx="20"
        cy="20"
        r="16"
        stroke="currentColor"
        strokeWidth="3"
        fill="transparent"
        className="text-black/5 dark:text-white/5"
      />
      <motion.circle
        cx="20"
        cy="20"
        r="16"
        stroke="currentColor"
        strokeWidth="3"
        fill="transparent"
        strokeDasharray="100.5"
        initial={{ strokeDashoffset: 100.5 }}
        animate={{ strokeDashoffset: 100.5 - (100.5 * progress) / 100 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className={color}
      />
    </svg>
  </div>
));
MetricRing.displayName = 'MetricRing';

const CustomSlider = memo(
  ({
    id,
    label,
    value,
    min,
    max,
    onChange,
    suffix = '',
  }: {
    id: string;
    label: string;
    value: number;
    min: number;
    max: number;
    onChange: (val: number) => void;
    suffix?: string;
  }) => {
    const denom = Math.max(1, max - min);
    const pct = Math.min(100, Math.max(0, ((value - min) / denom) * 100));
    const valueText = `${value}${suffix}`;

    return (
      <div className="space-y-3 group/slider">
        <div className="flex justify-between items-center">
          <label
            htmlFor={id}
            className="text-2xs font-mono font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-tight pr-4"
          >
            {label}
          </label>
          <span
            className="text-xs md:text-sm font-black text-brand-start tabular-nums shrink-0"
            aria-live="polite"
          >
            {value}
            {suffix}
          </span>
        </div>

        <div className="relative h-4 flex items-center">
          <div className="absolute inset-x-0 h-[1.5px] bg-black/5 dark:bg-white/10 rounded-full" />
          <div className="absolute h-[1.5px] bg-brand-start z-10" style={{ width: `${pct}%` }} />

          <input
            id={id}
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute inset-x-0 w-full opacity-0 cursor-pointer z-20"
            aria-label={label}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-valuetext={valueText}
          />

          <div
            className="absolute w-4 h-4 rounded-full brand-gradient-bg border-2 border-white dark:border-[#0A0A0C] shadow-lg z-30 pointer-events-none"
            style={{ left: `calc(${pct}% - 8px)` }}
            aria-hidden="true"
          />
        </div>
      </div>
    );
  }
);
CustomSlider.displayName = 'CustomSlider';

export const RoiSection: React.FC<RoiSectionProps> = ({ t, onCtaClick }) => {
  const reportsIdRaw = useId();
  const analysisIdRaw = useId();
  const rateIdRaw = useId();

  const reportsId = useMemo(() => `roi_reports_${sanitizeDomId(reportsIdRaw)}`, [reportsIdRaw]);
  const analysisId = useMemo(() => `roi_analysis_${sanitizeDomId(analysisIdRaw)}`, [analysisIdRaw]);
  const rateId = useMemo(() => `roi_rate_${sanitizeDomId(rateIdRaw)}`, [rateIdRaw]);

  const { openModal } = useModal();

  const [reportsCount, setReportsCount] = useState(10);
  const [analysisHours, setAnalysisHours] = useState(15);
  const [hourlyRate, setHourlyRate] = useState(150);

  const totalTimeRecovered = useMemo(
    () => reportsCount + analysisHours,
    [reportsCount, analysisHours]
  );

  const monthlySavings = useMemo(
    () => totalTimeRecovered * hourlyRate,
    [totalTimeRecovered, hourlyRate]
  );

  const annualSavings = useMemo(() => monthlySavings * 12, [monthlySavings]);

  const fteRecoveredPct = useMemo(() => {
    const pct = (totalTimeRecovered / 160) * 100;
    if (!Number.isFinite(pct)) return 0;
    return Math.max(0, Math.min(100, pct));
  }, [totalTimeRecovered]);

  const formatter = useMemo(
    () => getNumberFormatter(t.langCode || 'pl-PL', { maximumFractionDigits: 0 }),
    [t.langCode]
  );

  const netEfficiencyLabel = t.roi.net_efficiency_label;
  const timeSavingsLabel = t.roi.time_savings_label;
  const annualSavingsLabel = t.roi.annual_savings_label;
  const fteSuffixLabel = t.roi.fte_suffix_label;
  const reportsSuffix = t.roi.reports_suffix;

  const handleCta = () => {
    if (onCtaClick) {
      onCtaClick();
      return;
    }
    openModal('auth', { isRegistered: false });
  };

  return (
    <section
      id="roi"
      className="py-16 md:py-32 px-4 md:px-6 max-w-7xl mx-auto relative overflow-hidden"
    >
      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-20 items-start">
        <div className="space-y-6 md:space-y-8 animate-reveal order-2 lg:order-1 text-center lg:text-left">
          <header className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-brand-start/5 border border-brand-start/20">
              <span className="text-xs font-black tracking-[0.4em] uppercase text-brand-start">
                {t.roi.pill}
              </span>
            </div>
            <h2
              className="font-black tracking-tighter leading-[1.1] text-gray-900 dark:text-white py-2 uppercase"
              style={{ fontSize: 'clamp(24px, 4.5vw, 42px)' }}
            >
              {t.roi.title}
            </h2>
            <p className="text-sm md:text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 italic opacity-90">
              {t.roi.desc}
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 py-8 md:py-10 border-y border-black/5 dark:border-white/5">
            <div className="space-y-2">
              <div className="text-3xs md:text-2xs font-mono font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                {t.roi.label_total_savings}
              </div>
              <div className="text-2xl md:text-4xl font-black text-brand-start tracking-tighter">
                {formatter.format(monthlySavings)}
                <span className="text-xs md:text-base ml-2 opacity-50">
                  {t.roi.currency} / {t.roi.month_short}
                </span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-emerald-500 font-mono text-3xs font-black uppercase">
                {netEfficiencyLabel}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-3xs md:text-2xs font-mono font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                {t.roi.label_recovered_time}
              </div>
              <div className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                {totalTimeRecovered}
                <span className="text-xs md:text-base ml-2 opacity-50">
                  {t.roi.time_suffix} / msc
                </span>
              </div>
              <div className="flex justify-center lg:justify-start">
                <ComputingPulse label={t.roi.calculating_label} />
              </div>
            </div>
          </div>

          <div className="p-5 md:p-6 rounded-[2rem] bg-brand-start/[0.03] border border-brand-start/10">
            <p className="text-xs md:text-base text-gray-500 dark:text-gray-400 font-medium leading-relaxed italic">
              {t.roi.efficiency_note}
            </p>
          </div>

          <div className="pt-4">
            <InteractiveButton
              variant="primary"
              onClick={handleCta}
              className="w-full sm:w-auto !h-14 md:!h-16 !px-12 !text-xs md:!text-xs-plus font-black tracking-[0.3em] uppercase rounded-2xl shadow-2xl"
            >
              {t.roi.cta_btn}
            </InteractiveButton>
          </div>
        </div>

        <div className="relative order-1 lg:order-2 w-full">
          <div className="glass p-6 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-black/5 dark:border-white/10 relative overflow-hidden bg-white/90 dark:bg-[#0A0A0C]/70 backdrop-blur-3xl shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
            <div className="space-y-10 md:space-y-12">
              <CustomSlider
                id={reportsId}
                label={t.roi.input_hours}
                value={reportsCount}
                min={0}
                max={100}
                onChange={setReportsCount}
                suffix={reportsSuffix}
              />

              <CustomSlider
                id={analysisId}
                label={t.roi.input_analysis_hours}
                value={analysisHours}
                min={0}
                max={160}
                onChange={setAnalysisHours}
                suffix={` ${t.roi.hours_suffix}`}
              />

              <CustomSlider
                id={rateId}
                label={t.roi.input_analysts}
                value={hourlyRate}
                min={30}
                max={1000}
                onChange={setHourlyRate}
                suffix={` ${t.roi.currency}`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 md:mt-16 pt-8 md:pt-10 border-t border-black/5 dark:border-white/10">
              <div className="p-5 md:p-6 rounded-3xl bg-black/[0.02] dark:bg-white/[0.01] border border-black/5 dark:border-white/5 flex items-center gap-4 group transition-colors">
                <MetricRing progress={65} color="stroke-brand-start" />
                <div className="space-y-0.5">
                  <div className="text-4xs font-mono font-black text-gray-500 uppercase tracking-widest">
                    {timeSavingsLabel}
                  </div>
                  <div className="text-base md:text-lg font-black text-gray-900 dark:text-white tabular-nums">
                    {fteRecoveredPct.toFixed(0)} {fteSuffixLabel}
                  </div>
                </div>
              </div>

              <div className="p-5 md:p-6 rounded-3xl bg-emerald-500/[0.02] border border-emerald-500/10 flex items-center gap-4 group transition-colors">
                <MetricRing progress={100} color="stroke-emerald-500" />
                <div className="space-y-0.5">
                  <div className="text-4xs font-mono font-black text-emerald-500/60 uppercase tracking-widest">
                    {annualSavingsLabel}
                  </div>
                  <div className="text-base md:text-lg font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {formatter.format(annualSavings)} {t.roi.currency}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center opacity-40">
              <span className="text-4xs md:text-3xs font-mono font-bold text-gray-400 uppercase tracking-[0.4em]">
                {t.roi.savings_disclaimer}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
