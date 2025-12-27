import { useT } from '../../hooks/useT';

type StateKind = 'loading' | 'empty' | 'error' | 'offline' | 'noAccess';

const STATE_CONFIG: Record<StateKind, { titleKey: string; descriptionKey: string }> = {
  loading: {
    titleKey: 'common.states.loading.title',
    descriptionKey: 'common.states.loading.description',
  },
  empty: {
    titleKey: 'common.states.empty.title',
    descriptionKey: 'common.states.empty.description',
  },
  error: {
    titleKey: 'common.states.error.title',
    descriptionKey: 'common.states.error.description',
  },
  offline: {
    titleKey: 'common.states.offline.title',
    descriptionKey: 'common.states.offline.description',
  },
  noAccess: {
    titleKey: 'common.states.noAccess.title',
    descriptionKey: 'common.states.noAccess.description',
  },
};

export const StateCard = ({ kind, role }: { kind: StateKind; role?: string }) => {
  const { t } = useT();
  const { titleKey, descriptionKey } = STATE_CONFIG[kind];

  return (
    <div className="state-card" role={role}>
      <h3 className="state-title">{t(titleKey)}</h3>
      <p className="state-description">{t(descriptionKey)}</p>
    </div>
  );
};

export const LoadingState = ({ role }: { role?: string }) => <StateCard kind="loading" role={role} />;
export const EmptyState = ({ role }: { role?: string }) => <StateCard kind="empty" role={role} />;
export const ErrorState = ({ role }: { role?: string }) => <StateCard kind="error" role={role} />;
export const OfflineState = ({ role }: { role?: string }) => <StateCard kind="offline" role={role} />;
export const NoAccessState = ({ role }: { role?: string }) => <StateCard kind="noAccess" role={role} />;

export const States = () => {
  return (
    <div className="states-grid" role="list">
      <LoadingState role="listitem" />
      <EmptyState role="listitem" />
      <ErrorState role="listitem" />
      <OfflineState role="listitem" />
      <NoAccessState role="listitem" />
    </div>
  );
};
