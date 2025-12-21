import { useT } from '../../hooks/useT';

const AiDisclaimerPage = () => {
  const { t } = useT();
  const sections = [
    {
      title: t('legal.ai.sections.nondeterminism.title'),
      items: [t('legal.ai.sections.nondeterminism.items.one')],
    },
    {
      title: t('legal.ai.sections.noAdvice.title'),
      items: [t('legal.ai.sections.noAdvice.items.one')],
    },
    {
      title: t('legal.ai.sections.sensitive.title'),
      items: [t('legal.ai.sections.sensitive.items.one')],
    },
    {
      title: t('legal.ai.sections.safety.title'),
      items: [
        t('legal.ai.sections.safety.items.one'),
        t('legal.ai.sections.safety.items.two'),
      ],
    },
    {
      title: t('legal.ai.sections.rights.title'),
      items: [t('legal.ai.sections.rights.items.one')],
    },
  ];

  return (
    <main className="container legal-page">
      <div className="legal-card">
        <header>
          <h1>{t('legal.ai.title')}</h1>
          <p>{t('legal.ai.intro')}</p>
          <p>{t('legal.templateNotice')}</p>
        </header>
        {sections.map((section) => (
          <section key={section.title} className="legal-section">
            <h2>{section.title}</h2>
            <ul className="legal-list">
              {section.items.map((item, index) => (
                <li key={`${section.title}-${index}`}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
};

export default AiDisclaimerPage;
