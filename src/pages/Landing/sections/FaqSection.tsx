import { useState } from 'react';
import { StateCard } from '../../../components/common/States';
import { faqItems } from '../../../data/mocks/faq';
import { useT } from '../../../hooks/useT';

type FaqSectionProps = {
  demoState?: 'loading' | 'empty' | 'error' | 'offline' | null;
};

const FaqSection = ({ demoState }: FaqSectionProps) => {
  const { t } = useT();
  const [openId, setOpenId] = useState<string | null>(faqItems[0]?.id ?? null);

  return (
    <section id="faq" className="landing-section">
      <div className="container">
        <div className="section-heading">
          <h2>{t('landing.faq.title')}</h2>
        </div>
        {demoState ? (
          <div className="section-state">
            <StateCard kind={demoState} />
          </div>
        ) : (
          <div className="faq-list">
            {faqItems.map((item) => {
              const isOpen = openId === item.id;
              const panelId = `faq-panel-${item.id}`;
              return (
                <div key={item.id} className="faq-item">
                  <button
                    type="button"
                    className="faq-question"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                  >
                    {t(item.questionKey)}
                    <span
                      className={isOpen ? 'faq-icon open' : 'faq-icon'}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div id={panelId} className="faq-answer">
                      <p>{t(item.answerKey)}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default FaqSection;
