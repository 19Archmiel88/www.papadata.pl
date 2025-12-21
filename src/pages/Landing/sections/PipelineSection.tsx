import { StateCard } from '../../../components/common/States';
import { pipelineSteps } from '../../../data/mocks/pipeline';
import { useT } from '../../../hooks/useT';

type PipelineSectionProps = {
  demoState?: 'loading' | 'empty' | 'error' | 'offline' | null;
};

const PipelineSection = ({ demoState }: PipelineSectionProps) => {
  const { t } = useT();

  return (
    <section id="pipeline" className="landing-section">
      <div className="container">
        <div className="section-heading">
          <span className="section-badge">{t('landing.pipeline.badge')}</span>
          <h2>{t('landing.pipeline.title')}</h2>
        </div>
        {demoState ? (
          <div className="section-state">
            <StateCard kind={demoState} />
          </div>
        ) : (
          <div className="pipeline-steps">
            {pipelineSteps.map((step, index) => (
              <div key={step.id} className="pipeline-step">
                <div className="pipeline-step-number">
                  <span>{t('landing.pipeline.stepLabel')}</span>
                  <strong>{index + 1}</strong>
                </div>
                <div className="pipeline-step-content">
                  <h3>{t(step.titleKey)}</h3>
                  <p>{t(step.descriptionKey)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PipelineSection;
