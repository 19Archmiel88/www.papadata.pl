import type { ReactNode } from 'react';

type EmptyPanelProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

const EmptyPanel = ({ title, description, action }: EmptyPanelProps) => {
  return (
    <div className="empty-panel" role="status">
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {action ? <div className="empty-actions">{action}</div> : null}
    </div>
  );
};

export default EmptyPanel;
