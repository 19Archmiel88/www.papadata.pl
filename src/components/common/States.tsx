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

export const StateCard = ({ kind }: { kind: StateKind }) => {
  const { t } = useT();
  const { titleKey, descriptionKey } = STATE_CONFIG[kind];

  return (
    <div className="state-card" role="listitem">
      <h3 className="state-title">{t(titleKey)}</h3>
      <p className="state-description">{t(descriptionKey)}</p>
    </div>
  );
};

export const LoadingState = () => <StateCard kind="loading" />;
export const EmptyState = () => <StateCard kind="empty" />;
export const ErrorState = () => <StateCard kind="error" />;
export const OfflineState = () => <StateCard kind="offline" />;
export const NoAccessState = () => <StateCard kind="noAccess" />;

export const States = () => {
  return (
    <div className="states-grid" role="list">
      <LoadingState />
      <EmptyState />
      <ErrorState />
      <OfflineState />
      <NoAccessState />
    </div>
  );
};
