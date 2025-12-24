import { memo } from 'react';
import { useT } from '../../hooks/useT';
import type { AiMessageRole } from '../../hooks/useAiChat';

type AiMessageProps = {
  role: AiMessageRole;
  content: string;
};

// Bolt: Wrapped in memo to prevent re-renders when parent input state changes
const AiMessage = memo(({ role, content }: AiMessageProps) => {
  const { t } = useT();

  return (
    <div className={`ai-message ai-message--${role}`}>
      {role === 'assistant' ? (
        <span className="ai-message-label">{t('ai.labels.aiGenerated')}</span>
      ) : null}
      <p className="ai-message-text">{content}</p>
    </div>
  );
});

AiMessage.displayName = 'AiMessage';

export default AiMessage;
