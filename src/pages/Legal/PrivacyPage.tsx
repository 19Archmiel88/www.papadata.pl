import { useT } from '../../hooks/useT';

const PrivacyPage = () => {
  const { t } = useT();
  const sections = [
    {
      title: t('legal.privacy.sections.controller.title'),
      items: [
        t('legal.privacy.sections.controller.items.one'),
        t('legal.privacy.sections.controller.items.two'),
      ],
    },
    {
      title: t('legal.privacy.sections.scope.title'),
      items: [
        t('legal.privacy.sections.scope.items.one'),
        t('legal.privacy.sections.scope.items.two'),
        t('legal.privacy.sections.scope.items.three'),
      ],
    },
    {
      title: t('legal.privacy.sections.basis.title'),
      items: [
        t('legal.privacy.sections.basis.items.one'),
        t('legal.privacy.sections.basis.items.two'),
        t('legal.privacy.sections.basis.items.three'),
      ],
    },
    {
      title: t('legal.privacy.sections.recipients.title'),
      items: [
        t('legal.privacy.sections.recipients.items.one'),
        t('legal.privacy.sections.recipients.items.two'),
        t('legal.privacy.sections.recipients.items.three'),
      ],
    },
    {
      title: t('legal.privacy.sections.retention.title'),
      items: [t('legal.privacy.sections.retention.items.one')],
    },
    {
      title: t('legal.privacy.sections.rights.title'),
      items: [t('legal.privacy.sections.rights.items.one')],
    },
    {
      title: t('legal.privacy.sections.cookies.title'),
      items: [t('legal.privacy.sections.cookies.items.one')],
    },
  ];

  return (
    <main className="container legal-page">
      <div className="legal-card">
        <header>
          <h1>{t('legal.privacy.title')}</h1>
          <p>{t('legal.privacy.intro')}</p>
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

export default PrivacyPage;
