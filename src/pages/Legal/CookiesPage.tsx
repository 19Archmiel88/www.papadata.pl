import { useT } from '../../hooks/useT';

const CookiesPage = () => {
  const { t } = useT();
  const sections = [
    {
      title: t('legal.cookies.sections.purpose.title'),
      items: [
        t('legal.cookies.sections.purpose.items.one'),
        t('legal.cookies.sections.purpose.items.two'),
        t('legal.cookies.sections.purpose.items.three'),
      ],
    },
    {
      title: t('legal.cookies.sections.consentMode.title'),
      items: [
        t('legal.cookies.sections.consentMode.items.one'),
        t('legal.cookies.sections.consentMode.items.two'),
        t('legal.cookies.sections.consentMode.items.three'),
        t('legal.cookies.sections.consentMode.items.four'),
      ],
    },
    {
      title: t('legal.cookies.sections.management.title'),
      items: [
        t('legal.cookies.sections.management.items.one'),
        t('legal.cookies.sections.management.items.two'),
      ],
    },
    {
      title: t('legal.cookies.sections.retention.title'),
      items: [t('legal.cookies.sections.retention.items.one')],
    },
  ];

  return (
    <main className="container legal-page">
      <div className="legal-card">
        <header>
          <h1>{t('legal.cookies.title')}</h1>
          <p>{t('legal.cookies.intro')}</p>
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

export default CookiesPage;
