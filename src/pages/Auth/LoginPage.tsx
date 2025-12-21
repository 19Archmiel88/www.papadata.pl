import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useT } from '../../hooks/useT';
import { paths } from '../../routes/paths';

type LoginForm = {
  email: string;
  password: string;
};

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

const LoginPage = () => {
  const { t } = useT();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!form.email.trim()) {
      setError(t('auth.errors.emailRequired'));
      return;
    }
    if (!EMAIL_REGEX.test(form.email)) {
      setError(t('auth.errors.invalidEmail'));
      return;
    }
    if (!form.password.trim()) {
      setError(t('auth.errors.passwordRequired'));
      return;
    }
    if (form.password.length < 8) {
      setError(t('auth.errors.passwordMin'));
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email: form.email, password: form.password });
      navigate(paths.dashboardOverview, { replace: true });
    } catch {
      setError(t('auth.errors.generic'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>{t('auth.login.title')}</h1>
        <p className="auth-description">{t('auth.login.description')}</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>{t('auth.login.email')}</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder={t('auth.login.emailPlaceholder')}
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              required
            />
          </label>
          <label className="form-field">
            <span>{t('auth.login.password')}</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder={t('auth.login.passwordPlaceholder')}
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              required
              minLength={8}
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? t('auth.login.loading') : t('auth.login.submit')}
          </button>
        </form>
        <p className="auth-hint">{t('dashboard.demo.alert')}</p>
        <p className="auth-footer">
          {t('auth.login.noAccount')}{' '}
          <Link to={paths.signup} className="nav-link">
            {t('nav.cta.signup')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
