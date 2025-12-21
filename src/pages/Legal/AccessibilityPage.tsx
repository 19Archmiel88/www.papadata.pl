import { useT } from '../../hooks/useT';

const AccessibilityPage = () => {
  const { t } = useT();
  const sections = [
    {
      title: t('legal.accessibility.sections.status.title'),
      items: [t('legal.accessibility.sections.status.items.one')],
    },
    {
      title: t('legal.accessibility.sections.contact.title'),
      items: [t('legal.accessibility.sections.contact.items.one')],
    },
    {
      title: t('legal.accessibility.sections.scope.title'),
      items: [
        t('legal.accessibility.sections.scope.items.one'),
        t('legal.accessibility.sections.scope.items.two'),
        t('legal.accessibility.sections.scope.items.three'),
        t('legal.accessibility.sections.scope.items.four'),
      ],
    },
    {
      title: t('legal.accessibility.sections.date.title'),
      items: [t('legal.accessibility.sections.date.items.one')],
    },
  ];

  return (
    <main className="container legal-page">
      <div className="legal-card">
        <header>
          <h1>{t('legal.accessibility.title')}</h1>
          <p>{t('legal.accessibility.intro')}</p>
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

export default AccessibilityPage;
