import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useT } from '../../hooks/useT';
import { paths } from '../../routes/paths';

type SignupForm = {
  name: string;
  email: string;
  password: string;
  company: string;
  website: string;
  vat: string;
};

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

const wizardSteps = ['account', 'company', 'consents', 'success'] as const;

const SignupPage = () => {
  const { t } = useT();
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<SignupForm>({
    name: '',
    email: '',
    password: '',
    company: '',
    website: '',
    vat: '',
  });
  const [step, setStep] = useState(1);
  const [consents, setConsents] = useState({
    terms: false,
    dpa: false,
    privacy: false,
    marketing: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (step === 1) {
      if (!form.name.trim()) {
        setError(t('auth.errors.nameRequired'));
        return;
      }
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
      setStep((prev) => prev + 1);
      return;
    }

    if (step === 2) {
      if (!form.company.trim()) {
        setError(t('auth.errors.companyRequired'));
        return;
      }
      setStep((prev) => prev + 1);
      return;
    }

    if (step === 3) {
      if (!consents.terms || !consents.dpa || !consents.privacy) {
        setError(t('auth.errors.consentsRequired'));
        return;
      }

      setIsSubmitting(true);
      try {
        await signup({
          name: form.name,
          email: form.email,
          password: form.password,
          orgName: form.company,
          website: form.website,
          vatId: form.vat,
        });
        setStep(4);
      } catch {
        setError(t('auth.errors.generic'));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setError(null);
      setStep((prev) => prev - 1);
    }
  };

  if (step === 4) {
    return (
      <div className="auth-shell">
        <div className="auth-card">
          <h1>{t('auth.signup.successTitle')}</h1>
          <p className="auth-description">{t('auth.signup.successDescription')}</p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate(paths.dashboardOverview, { replace: true })}
          >
            {t('auth.wizard.success.cta')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-shell">
      <div className="auth-card auth-card--wide">
        <h1>{t('auth.signup.title')}</h1>
        <p className="auth-description">{t('auth.signup.description')}</p>
        <div className="auth-stepper" aria-label={t('auth.wizard.stepsLabel')}>
          {wizardSteps.map((key, index) => {
            const stepIndex = index + 1;
            const isActive = step === stepIndex;
            const isComplete = step > stepIndex;

            return (
              <span
                key={key}
                className={`auth-step ${isActive ? 'auth-step--active' : ''} ${
                  isComplete ? 'auth-step--completed' : ''
                }`}
                aria-current={isActive ? 'step' : undefined}
              >
                {t(`auth.wizard.steps.${key}`)}
              </span>
            );
          })}
        </div>
        <form className="auth-form" onSubmit={handleNext}>
          {step === 1 && (
            <div className="form-grid">
              <label className="form-field">
                <span>{t('auth.signup.account.name')}</span>
                <input
                  type="text"
                  name="name"
                  placeholder={t('auth.signup.account.namePlaceholder')}
                  value={form.name}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  required
                />
              </label>
              <label className="form-field">
                <span>{t('auth.signup.account.email')}</span>
                <input
                  type="email"
                  name="email"
                  placeholder={t('auth.signup.account.emailPlaceholder')}
                  value={form.email}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, email: event.target.value }))
                  }
                  required
                />
              </label>
              <label className="form-field">
                <span>{t('auth.signup.account.password')}</span>
                <input
                  type="password"
                  name="password"
                  placeholder={t('auth.signup.account.passwordPlaceholder')}
                  value={form.password}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, password: event.target.value }))
                  }
                  required
                  minLength={8}
                />
              </label>
            </div>
          )}
          {step === 2 && (
            <div className="form-grid">
              <label className="form-field">
                <span>{t('auth.signup.company.name')}</span>
                <input
                  type="text"
                  name="company"
                  placeholder={t('auth.signup.company.namePlaceholder')}
                  value={form.company}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, company: event.target.value }))
                  }
                  required
                />
              </label>
              <label className="form-field">
                <span>{t('auth.signup.company.website')}</span>
                <input
                  type="url"
                  name="website"
                  placeholder={t('auth.signup.company.websitePlaceholder')}
                  value={form.website}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, website: event.target.value }))
                  }
                />
              </label>
              <label className="form-field">
                <span>{t('auth.signup.company.vat')}</span>
                <input
                  type="text"
                  name="vat"
                  placeholder={t('auth.signup.company.vatPlaceholder')}
                  value={form.vat}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, vat: event.target.value }))
                  }
                />
              </label>
            </div>
          )}
          {step === 3 && (
            <div className="cookie-settings-grid">
              <label className="cookie-setting">
                <input
                  type="checkbox"
                  checked={consents.terms}
                  onChange={(event) =>
                    setConsents((prev) => ({ ...prev, terms: event.target.checked }))
                  }
                  required
                />
                <span>{t('auth.signup.consents.terms')}</span>
              </label>
              <label className="cookie-setting">
                <input
                  type="checkbox"
                  checked={consents.dpa}
                  onChange={(event) =>
                    setConsents((prev) => ({ ...prev, dpa: event.target.checked }))
                  }
                  required
                />
                <span>{t('auth.signup.consents.dpa')}</span>
              </label>
              <label className="cookie-setting">
                <input
                  type="checkbox"
                  checked={consents.privacy}
                  onChange={(event) =>
                    setConsents((prev) => ({ ...prev, privacy: event.target.checked }))
                  }
                  required
                />
                <span>{t('auth.signup.consents.privacy')}</span>
              </label>
              <label className="cookie-setting">
                <input
                  type="checkbox"
                  checked={consents.marketing}
                  onChange={(event) =>
                    setConsents((prev) => ({ ...prev, marketing: event.target.checked }))
                  }
                />
                <span>{t('auth.signup.consents.marketing')}</span>
              </label>
            </div>
          )}
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <div className="auth-actions">
            {step > 1 && (
              <button type="button" className="btn-tertiary" onClick={handleBack}>
                {t('auth.wizard.back')}
              </button>
            )}
            <button
              type="submit"
              className="btn-secondary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? t('auth.wizard.loading')
                : step === 3
                ? t('auth.wizard.createAccount')
                : t('auth.wizard.continue')}
            </button>
          </div>
        </form>
        <p className="auth-hint">{t('dashboard.demo.alert')}</p>
      </div>
    </div>
  );
};

export default SignupPage;
