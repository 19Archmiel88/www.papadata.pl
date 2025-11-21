import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { organizationSchema, OrganizationProfile } from '../../lib/validation/organization';
import { useOnboardingStore } from '../../store';
import httpClient from '../../services/httpClient';
import { pushToast } from '../../components/Toaster';

/**
 * Step 1: Organisation details. Collects the basic metadata about the
 * client organisation as well as compliance flags. On successful submit
 * the data is persisted in the store and sent to the backend as a draft.
 */
const OrganizationStep: React.FC = () => {
  const { profile, setProfile } = useOnboardingStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrganizationProfile>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      org_name: profile.org_name ?? '',
      client_slug: profile.client_slug ?? '',
      technical_email: profile.technical_email ?? '',
      language: 'pl',
      timezone: 'Europe/Warsaw',
      currency: 'PLN',
      data_residency: 'pl-warsaw',
      bq_region: 'europe-central2',
      retention_months: profile.retention_months ?? 24,
      pseudonymization_enabled: profile.pseudonymization_enabled ?? true,
      dpa_accepted: profile.dpa_accepted ?? false,
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: OrganizationProfile) => {
    setProfile(data);
    try {
      const res = await httpClient.post('api/onboarding/profile', {
        json: data,
      });
      if (res.ok) {
        pushToast('Zapisano szkic profilu organizacji');
      } else {
        pushToast('Błąd zapisu profilu');
      }
    } catch (err) {
      pushToast('Błąd sieci podczas zapisu');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="org_name">Nazwa organizacji</label>
        <input
          id="org_name"
          className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
          {...register('org_name')}
        />
        {errors.org_name && <p className="text-red-500 text-xs mt-1">{errors.org_name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="client_slug">Slug klienta</label>
        <input
          id="client_slug"
          className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
          {...register('client_slug')}
        />
        {errors.client_slug && <p className="text-red-500 text-xs mt-1">{errors.client_slug.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="technical_email">E‑mail techniczny</label>
        <input
          id="technical_email"
          className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
          {...register('technical_email')}
        />
        {errors.technical_email && <p className="text-red-500 text-xs mt-1">{errors.technical_email.message}</p>}
      </div>

      {/* Readonly fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Język</label>
          <input
            className="w-full bg-slate-700 rounded p-2 text-white opacity-70 cursor-not-allowed"
            value="pl"
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Strefa czasowa</label>
          <input
            className="w-full bg-slate-700 rounded p-2 text-white opacity-70 cursor-not-allowed"
            value="Europe/Warsaw"
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Waluta</label>
          <input
            className="w-full bg-slate-700 rounded p-2 text-white opacity-70 cursor-not-allowed"
            value="PLN"
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Region danych</label>
          <input
            className="w-full bg-slate-700 rounded p-2 text-white opacity-70 cursor-not-allowed"
            value="pl-warsaw"
            readOnly
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="retention_months">Retencja (miesiące)</label>
          <input
            id="retention_months"
            type="number"
            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
            {...register('retention_months', { valueAsNumber: true })}
          />
          {errors.retention_months && <p className="text-red-500 text-xs mt-1">{errors.retention_months.message}</p>}
        </div>
        <div>
          <label className="inline-flex items-center mt-7">
            <input type="checkbox" className="mr-2" {...register('pseudonymization_enabled')} />
            Pseudonimizacja włączona
          </label>
        </div>
      </div>

      <div>
        <label className="inline-flex items-center">
          <input type="checkbox" className="mr-2" {...register('dpa_accepted')} />
          Akceptuję umowę powierzenia DPA
        </label>
        {errors.dpa_accepted && <p className="text-red-500 text-xs mt-1">{errors.dpa_accepted.message}</p>}
      </div>

      <button
        type="submit"
        className="mt-4 bg-cyan-600 hover:bg-cyan-500 text-slate-900 px-4 py-2 rounded"
      >
        Zapisz szkic
      </button>
    </form>
  );
};

export default OrganizationStep;