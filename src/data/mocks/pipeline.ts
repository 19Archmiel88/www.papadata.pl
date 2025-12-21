export type PipelineStep = {
  id: string;
  titleKey: string;
  descriptionKey: string;
};

export const pipelineSteps: PipelineStep[] = [
  {
    id: 'sources',
    titleKey: 'landing.pipeline.steps.sources.title',
    descriptionKey: 'landing.pipeline.steps.sources.description',
  },
  {
    id: 'pipeline',
    titleKey: 'landing.pipeline.steps.pipeline.title',
    descriptionKey: 'landing.pipeline.steps.pipeline.description',
  },
  {
    id: 'warehouse',
    titleKey: 'landing.pipeline.steps.warehouse.title',
    descriptionKey: 'landing.pipeline.steps.warehouse.description',
  },
  {
    id: 'ai-agent',
    titleKey: 'landing.pipeline.steps.ai.title',
    descriptionKey: 'landing.pipeline.steps.ai.description',
  },
];
