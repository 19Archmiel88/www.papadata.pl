import type { HTMLAttributes } from 'react';
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

export const StateCard = ({
  kind,
  className,
  ...props
}: { kind: StateKind } & HTMLAttributes<HTMLDivElement>) => {
  const { t } = useT();
  const { titleKey, descriptionKey } = STATE_CONFIG[kind];
  const finalClassName = `state-card ${className || ''}`.trim();

  return (
    <div className={finalClassName} {...props}>
      <h3 className="state-title">{t(titleKey)}</h3>
      <p className="state-description">{t(descriptionKey)}</p>
    </div>
  );
};

export const LoadingState = (props: HTMLAttributes<HTMLDivElement>) => (
  <StateCard kind="loading" {...props} />
);
export const EmptyState = (props: HTMLAttributes<HTMLDivElement>) => (
  <StateCard kind="empty" {...props} />
);
export const ErrorState = (props: HTMLAttributes<HTMLDivElement>) => (
  <StateCard kind="error" {...props} />
);
export const OfflineState = (props: HTMLAttributes<HTMLDivElement>) => (
  <StateCard kind="offline" {...props} />
);
export const NoAccessState = (props: HTMLAttributes<HTMLDivElement>) => (
  <StateCard kind="noAccess" {...props} />
);

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
