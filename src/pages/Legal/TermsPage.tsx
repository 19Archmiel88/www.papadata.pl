import { useT } from '../../hooks/useT';

const TermsPage = () => {
  const { t } = useT();
  const sections = [
    {
      title: t('legal.terms.sections.operator.title'),
      items: [
        t('legal.terms.sections.operator.items.one'),
        t('legal.terms.sections.operator.items.two'),
        t('legal.terms.sections.operator.items.three'),
        t('legal.terms.sections.operator.items.four'),
      ],
    },
    {
      title: t('legal.terms.sections.definitions.title'),
      items: [
        t('legal.terms.sections.definitions.items.one'),
        t('legal.terms.sections.definitions.items.two'),
        t('legal.terms.sections.definitions.items.three'),
        t('legal.terms.sections.definitions.items.four'),
      ],
    },
    {
      title: t('legal.terms.sections.scope.title'),
      items: [
        t('legal.terms.sections.scope.items.one'),
        t('legal.terms.sections.scope.items.two'),
      ],
    },
    {
      title: t('legal.terms.sections.aup.title'),
      items: [
        t('legal.terms.sections.aup.items.one'),
        t('legal.terms.sections.aup.items.two'),
      ],
    },
    {
      title: t('legal.terms.sections.ai.title'),
      items: [
        t('legal.terms.sections.ai.items.one'),
        t('legal.terms.sections.ai.items.two'),
        t('legal.terms.sections.ai.items.three'),
      ],
    },
    {
      title: t('legal.terms.sections.billing.title'),
      items: [
        t('legal.terms.sections.billing.items.one'),
        t('legal.terms.sections.billing.items.two'),
        t('legal.terms.sections.billing.items.three'),
      ],
    },
    {
      title: t('legal.terms.sections.sla.title'),
      items: [
        t('legal.terms.sections.sla.items.one'),
        t('legal.terms.sections.sla.items.two'),
      ],
    },
    {
      title: t('legal.terms.sections.dataAct.title'),
      items: [
        t('legal.terms.sections.dataAct.items.one'),
        t('legal.terms.sections.dataAct.items.two'),
      ],
    },
    {
      title: t('legal.terms.sections.complaints.title'),
      items: [
        t('legal.terms.sections.complaints.items.one'),
        t('legal.terms.sections.complaints.items.two'),
      ],
    },
    {
      title: t('legal.terms.sections.law.title'),
      items: [t('legal.terms.sections.law.items.one')],
    },
  ];

  return (
    <main className="container legal-page">
      <div className="legal-card">
        <header>
          <h1>{t('legal.terms.title')}</h1>
          <p>{t('legal.terms.intro')}</p>
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

export default TermsPage;
