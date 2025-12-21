import { useT } from '../../hooks/useT';

const DpaPage = () => {
  const { t } = useT();
  const sections = [
    {
      title: t('legal.dpa.sections.parties.title'),
      items: [
        t('legal.dpa.sections.parties.items.one'),
        t('legal.dpa.sections.parties.items.two'),
      ],
    },
    {
      title: t('legal.dpa.sections.scope.title'),
      items: [t('legal.dpa.sections.scope.items.one')],
    },
    {
      title: t('legal.dpa.sections.term.title'),
      items: [
        t('legal.dpa.sections.term.items.one'),
        t('legal.dpa.sections.term.items.two'),
      ],
    },
    {
      title: t('legal.dpa.sections.security.title'),
      items: [
        t('legal.dpa.sections.security.items.one'),
        t('legal.dpa.sections.security.items.two'),
        t('legal.dpa.sections.security.items.three'),
        t('legal.dpa.sections.security.items.four'),
      ],
    },
    {
      title: t('legal.dpa.sections.subprocessors.title'),
      items: [
        t('legal.dpa.sections.subprocessors.items.one'),
        t('legal.dpa.sections.subprocessors.items.two'),
      ],
    },
    {
      title: t('legal.dpa.sections.deletion.title'),
      items: [t('legal.dpa.sections.deletion.items.one')],
    },
  ];

  return (
    <main className="container legal-page">
      <div className="legal-card">
        <header>
          <h1>{t('legal.dpa.title')}</h1>
          <p>{t('legal.dpa.intro')}</p>
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

export default DpaPage;
