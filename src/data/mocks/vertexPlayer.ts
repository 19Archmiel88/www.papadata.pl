export type VertexChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  textKey: string;
};

export type VertexPipelineStatus = {
  id: string;
  labelKey: string;
};

export type VertexKpi = {
  id: string;
  labelKey: string;
};

export const vertexChatMessages: VertexChatMessage[] = [
  {
    id: 'question',
    role: 'user',
    textKey: 'landing.vertexPlayer.chat.question',
  },
  {
    id: 'status',
    role: 'system',
    textKey: 'landing.vertexPlayer.chat.status',
  },
  {
    id: 'answer',
    role: 'assistant',
    textKey: 'landing.vertexPlayer.chat.answer',
  },
];

export const vertexChatChips = [
  { id: 'chip-1', labelKey: 'landing.vertexPlayer.chat.chips.one' },
  { id: 'chip-2', labelKey: 'landing.vertexPlayer.chat.chips.two' },
  { id: 'chip-3', labelKey: 'landing.vertexPlayer.chat.chips.three' },
];

export const vertexPipelineStatuses: VertexPipelineStatus[] = [
  { id: 'status-1', labelKey: 'landing.vertexPlayer.pipeline.status.one' },
  { id: 'status-2', labelKey: 'landing.vertexPlayer.pipeline.status.two' },
  { id: 'status-3', labelKey: 'landing.vertexPlayer.pipeline.status.three' },
  { id: 'status-4', labelKey: 'landing.vertexPlayer.pipeline.status.four' },
  { id: 'status-5', labelKey: 'landing.vertexPlayer.pipeline.status.five' },
];

export const vertexExecKpis: VertexKpi[] = [
  { id: 'kpi-1', labelKey: 'landing.vertexPlayer.exec.kpi.one' },
  { id: 'kpi-2', labelKey: 'landing.vertexPlayer.exec.kpi.two' },
  { id: 'kpi-3', labelKey: 'landing.vertexPlayer.exec.kpi.three' },
];
