import { useMemo, useState } from 'react';
import { StateCard } from '../../../components/common/States';
import { useT } from '../../../hooks/useT';

type RoiCalculatorSectionProps = {
  demoState?: 'loading' | 'empty' | 'error' | 'offline' | null;
};

const RoiCalculatorSection = ({ demoState }: RoiCalculatorSectionProps) => {
  const { t, lang } = useT();
  const [analysts, setAnalysts] = useState(3);
  const [hours, setHours] = useState(12);
  const [rate, setRate] = useState(120);

  const currency = t('landing.roi.currency');
  const safeCurrency =
    /^[A-Z]{3}$/.test(currency) ? currency : lang === 'pl' ? 'PLN' : 'USD';
  const formatter = useMemo(
    () => new Intl.NumberFormat(lang, { style: 'currency', currency: safeCurrency }),
    [lang, safeCurrency],
  );

  const { traditionalCost, papadataCost, savings } = useMemo(() => {
    const yearly = analysts * hours * rate * 52;
    const papadata = Math.round(yearly * 0.7);
    return {
      traditionalCost: yearly,
      papadataCost: papadata,
      savings: yearly - papadata,
    };
  }, [analysts, hours, rate]);

  return (
    <section id="roi" className="landing-section">
      <div className="container">
        <div className="section-heading">
          <h2>{t('landing.roi.title')}</h2>
          <p>{t('landing.roi.subtitle')}</p>
        </div>
        {demoState ? (
          <div className="section-state">
            <StateCard kind={demoState} />
          </div>
        ) : (
          <div className="roi-grid">
            <div className="roi-controls">
              <label className="roi-control">
                <span>{t('landing.roi.field.analysts')}</span>
                <div className="roi-control-input">
                  <input
                    type="range"
                    min={1}
                    max={20}
                    value={analysts}
                    onChange={(event) => setAnalysts(Number(event.target.value))}
                    aria-label={t('landing.roi.field.analysts')}
                  />
                  <span>{analysts}</span>
                </div>
              </label>
              <label className="roi-control">
                <span>{t('landing.roi.field.hours')}</span>
                <div className="roi-control-input">
                  <input
                    type="range"
                    min={1}
                    max={40}
                    value={hours}
                    onChange={(event) => setHours(Number(event.target.value))}
                    aria-label={t('landing.roi.field.hours')}
                  />
                  <span>{hours}</span>
                </div>
              </label>
              <label className="roi-control">
                <span>{t('landing.roi.field.rate')}</span>
                <div className="roi-control-input">
                  <input
                    type="range"
                    min={20}
                    max={300}
                    value={rate}
                    onChange={(event) => setRate(Number(event.target.value))}
                    aria-label={t('landing.roi.field.rate')}
                  />
                  <span>
                    {rate} {t('landing.roi.rateUnit')}
                  </span>
                </div>
              </label>
            </div>
            <div className="roi-results">
              <div className="roi-card">
                <span>{t('landing.roi.results.traditional')}</span>
                <strong>{formatter.format(traditionalCost)}</strong>
              </div>
              <div className="roi-card">
                <span>{t('landing.roi.results.papadata')}</span>
                <strong>{formatter.format(papadataCost)}</strong>
              </div>
              <div className="roi-card highlight">
                <span>{t('landing.roi.results.savings')}</span>
                <strong>{formatter.format(savings)}</strong>
              </div>
              <p className="roi-engine">{t('landing.roi.engine')}</p>
              <p className="roi-disclaimer">{t('landing.roi.disclaimer')}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RoiCalculatorSection;
