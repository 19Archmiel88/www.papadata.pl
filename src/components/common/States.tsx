import { type ComponentProps } from 'react';
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

type StateCardProps = ComponentProps<'div'> & {
  kind: StateKind;
};

export const StateCard = ({ kind, className, ...props }: StateCardProps) => {
  const { t } = useT();
  const { titleKey, descriptionKey } = STATE_CONFIG[kind];
  const classes = className ? `state-card ${className}` : 'state-card';

  return (
    <div className={classes} {...props}>
      <h3 className="state-title">{t(titleKey)}</h3>
      <p className="state-description">{t(descriptionKey)}</p>
    </div>
  );
};

export const LoadingState = (props: ComponentProps<'div'>) => <StateCard kind="loading" {...props} />;
export const EmptyState = (props: ComponentProps<'div'>) => <StateCard kind="empty" {...props} />;
export const ErrorState = (props: ComponentProps<'div'>) => <StateCard kind="error" {...props} />;
export const OfflineState = (props: ComponentProps<'div'>) => <StateCard kind="offline" {...props} />;
export const NoAccessState = (props: ComponentProps<'div'>) => <StateCard kind="noAccess" {...props} />;

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
