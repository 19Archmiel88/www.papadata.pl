import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { scheduleSchema, Schedule } from '../../lib/validation/schedule';
import { useOnboardingStore } from '../../store';
import httpClient from '../../services/httpClient';
import { pushToast } from '../../components/Toaster';

/**
 * Step 4: Schedule. Users configure how often data pipelines run and how far
 * back to fetch data. On submit the schedule is persisted to the store and
 * sent to the backend.
 */
const ScheduleStep: React.FC = () => {
  const { schedule, setSchedule } = useOnboardingStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Schedule>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      timezone: 'Europe/Warsaw',
      frequency: schedule.frequency || 'daily',
      exact_time: schedule.exact_time,
      minute_offset: schedule.minute_offset,
      window: schedule.window || 1,
      late_reprocess_days: schedule.late_reprocess_days ?? 0,
      backfill_months: schedule.backfill_months ?? 0,
      mode: schedule.mode || 'throttled',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: Schedule) => {
    setSchedule(data);
    try {
      const res = await httpClient.put('api/onboarding/schedule', { json: data });
      if (res.ok) {
        pushToast('Harmonogram zapisany');
      } else {
        pushToast('Błąd zapisu harmonogramu');
      }
    } catch (err) {
      pushToast('Błąd sieci podczas zapisu');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm mb-1">Częstotliwość</label>
        <select
          className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
          {...register('frequency')}
        >
          <option value="hourly">Co godzinę</option>
          <option value="daily">Raz dziennie</option>
          <option value="weekly">Raz w tygodniu</option>
        </select>
        {errors.frequency && <p className="text-red-500 text-xs mt-1">{errors.frequency.message}</p>}
      </div>

      <div>
        <label className="block text-sm mb-1">Okno (dni)</label>
        <input
          type="number"
          min={1}
          className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
          {...register('window', { valueAsNumber: true })}
        />
        {errors.window && <p className="text-red-500 text-xs mt-1">{errors.window.message}</p>}
      </div>

      <div>
        <label className="block text-sm mb-1">Opóźnione ponowne przetwarzanie (dni)</label>
        <input
          type="number"
          min={0}
          max={7}
          className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
          {...register('late_reprocess_days', { valueAsNumber: true })}
        />
        {errors.late_reprocess_days && <p className="text-red-500 text-xs mt-1">{errors.late_reprocess_days.message}</p>}
      </div>

      <div>
        <label className="block text-sm mb-1">Backfill (miesiące)</label>
        <input
          type="number"
          min={0}
          max={60}
          className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
          {...register('backfill_months', { valueAsNumber: true })}
        />
        {errors.backfill_months && <p className="text-red-500 text-xs mt-1">{errors.backfill_months.message}</p>}
      </div>

      <div>
        <label className="block text-sm mb-1">Tryb</label>
        <select
          className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white"
          {...register('mode')}
        >
          <option value="throttled">Ograniczony</option>
          <option value="fast">Szybki</option>
        </select>
      </div>

      <button type="submit" className="mt-4 bg-cyan-600 hover:bg-cyan-500 text-slate-900 px-4 py-2 rounded">
        Zapisz harmonogram
      </button>
    </form>
  );
};

export default ScheduleStep;