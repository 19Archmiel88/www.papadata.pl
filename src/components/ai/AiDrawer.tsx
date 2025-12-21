import { useMemo, useRef, type FormEvent } from 'react';
import Modal from '../common/Modal';
import { useAiChat } from '../../hooks/useAiChat';
import { useT } from '../../hooks/useT';
import AiMessage from './AiMessage';

type AiDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AiDrawer = ({ isOpen, onClose }: AiDrawerProps) => {
  const { t } = useT();
  const {
    messages,
    input,
    setInput,
    status,
    error,
    hasApiKey,
    suggestions,
    sendMessage,
    cancel,
  } = useAiChat();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isStreaming = status === 'streaming';
  const isInputDisabled = !hasApiKey || isStreaming;
  const canSend = Boolean(input.trim()) && !isInputDisabled;

  const activeError = useMemo(() => (!hasApiKey ? 'noKey' : error), [error, hasApiKey]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage();
  };

  const handleSuggestion = (value: string) => {
    if (isInputDisabled) return;
    setInput(value);
    inputRef.current?.focus();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('ai.title')}
      variant="drawer"
      initialFocusRef={inputRef}
    >
      <div className="ai-drawer" id="ai-drawer">
        <div className="ai-meta">
          <span className="status-pill status-pill--neutral">{t('ai.labels.aiGenerated')}</span>
        </div>

        <div className="ai-suggestions" role="list">
          {suggestions.map((key) => (
            <button
              key={key}
              type="button"
              className="ai-chip"
              role="listitem"
              onClick={() => handleSuggestion(t(key))}
              disabled={isInputDisabled}
            >
              {t(key)}
            </button>
          ))}
        </div>

        {activeError ? (
          <div className="ai-error-card" role="status">
            {t(`ai.errors.${activeError}`)}
          </div>
        ) : null}

        <div className="ai-messages" aria-live="polite">
          {messages.map((message) => (
            <AiMessage key={message.id} role={message.role} content={message.content} />
          ))}
        </div>

        <form className="ai-input-form" onSubmit={handleSubmit}>
          <textarea
            ref={inputRef}
            className="textarea ai-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t('ai.placeholder')}
            disabled={!hasApiKey}
            rows={3}
          />
          <div className="ai-actions">
            <button type="submit" className="btn-primary" disabled={!canSend}>
              {t('ai.send')}
            </button>
            {isStreaming ? (
              <button type="button" className="btn-secondary" onClick={cancel}>
                {t('ai.cancel')}
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AiDrawer;
