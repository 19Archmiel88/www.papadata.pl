import { useState } from 'react';
import { useT } from '../../../hooks/useT';
import {
  vertexChatChips,
  vertexChatMessages,
  vertexExecKpis,
  vertexPipelineStatuses,
} from '../../../data/mocks/vertexPlayer';

type VertexTab = 'chat' | 'pipeline' | 'exec';

const VertexPlayerSection = () => {
  const { t } = useT();
  const [activeTab, setActiveTab] = useState<VertexTab>('chat');

  const tabs = [
    { id: 'chat', label: t('landing.vertexPlayer.tabs.chat') },
    { id: 'pipeline', label: t('landing.vertexPlayer.tabs.pipeline') },
    { id: 'exec', label: t('landing.vertexPlayer.tabs.exec') },
  ] as const;

  return (
    <div className="vertex-player">
      <div className="vertex-player__desktop" aria-label={t('landing.vertexPlayer.ariaLabel')}>
        <div className="vertex-header">
          <span className="vertex-badge">{t('landing.vertexPlayer.badge')}</span>
          <div className="vertex-tabs" role="tablist">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                className={activeTab === tab.id ? 'vertex-tab active' : 'vertex-tab'}
                aria-selected={activeTab === tab.id}
                aria-controls={`vertex-panel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="vertex-panel">
          <div
            id="vertex-panel-chat"
            role="tabpanel"
            className="vertex-chat"
            hidden={activeTab !== 'chat'}
          >
            <div className="vertex-chat-messages">
              {vertexChatMessages.map((message) => (
                <div key={message.id} className={`chat-bubble chat-${message.role}`}>
                  {t(message.textKey)}
                </div>
              ))}
            </div>
            <div className="vertex-chat-input">
              <input
                type="text"
                placeholder={t('landing.vertexPlayer.chat.placeholder')}
                aria-label={t('landing.vertexPlayer.chat.placeholder')}
                disabled
              />
              <button type="button" className="btn-secondary" disabled>
                {t('landing.vertexPlayer.chat.send')}
              </button>
            </div>
            <div className="vertex-chat-chips">
              {vertexChatChips.map((chip) => (
                <span key={chip.id} className="chip">
                  {t(chip.labelKey)}
                </span>
              ))}
            </div>
          </div>
          <div
            id="vertex-panel-pipeline"
            role="tabpanel"
            className="vertex-pipeline"
            hidden={activeTab !== 'pipeline'}
          >
            <p className="vertex-pipeline-title">{t('landing.vertexPlayer.pipeline.title')}</p>
            <ul className="vertex-pipeline-list">
              {vertexPipelineStatuses.map((status) => (
                <li key={status.id} className="vertex-pipeline-item">
                  <span className="pipeline-dot" aria-hidden="true" />
                  <span>{t(status.labelKey)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div
            id="vertex-panel-exec"
            role="tabpanel"
            className="vertex-exec"
            hidden={activeTab !== 'exec'}
          >
            <div className="vertex-kpi-grid">
              {vertexExecKpis.map((kpi) => (
                <div key={kpi.id} className="vertex-kpi-card">
                  <span className="kpi-label">{t(kpi.labelKey)}</span>
                  <div className="kpi-bar" aria-hidden="true" />
                </div>
              ))}
            </div>
            <p className="vertex-exec-briefing">{t('landing.vertexPlayer.exec.briefing')}</p>
          </div>
        </div>
      </div>
      <div className="vertex-player__mobile">
        <h3>{t('landing.vertexPlayer.mobile.title')}</h3>
        <p>{t('landing.vertexPlayer.mobile.description')}</p>
      </div>
    </div>
  );
};

export default VertexPlayerSection;
