import { type FormEvent, useState } from 'react';
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
  const [showPassword, setShowPassword] = useState(false);

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
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                placeholder={t('auth.login.passwordPlaceholder')}
                value={form.password}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, password: event.target.value }))
                }
                required
                minLength={8}
                style={{ paddingRight: '40px', width: '100%' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                }}
                aria-label={
                  showPassword ? t('auth.password.hide') : t('auth.password.show')
                }
              >
                {showPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
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
