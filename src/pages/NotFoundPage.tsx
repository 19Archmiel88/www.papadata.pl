import { Link } from 'react-router-dom';
import { useT } from '../hooks/useT';
import { paths } from '../routes/paths';

const NotFoundPage = () => {
  const { t } = useT();

  return (
    <main className="container">
      <section>
        <h1>{t('notFound.title')}</h1>
        <p>{t('notFound.message')}</p>
        <Link to={paths.root}>{t('notFound.cta')}</Link>
      </section>
    </main>
  );
};

export default NotFoundPage;
