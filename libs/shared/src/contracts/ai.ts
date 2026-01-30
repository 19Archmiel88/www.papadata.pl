import {
  AttributionModel,
  DateRange,
  GlobalFilters,
  KPIValue,
  TableRow,
  DataQuality,
} from './analytics.js';
import { AppMode } from './common.js';

export type AIFinishReason = 'stop' | 'safety' | 'error' | 'timeout' | 'rate_limited' | 'cancelled';

export interface AIContext {
  view: string;
  dateRange: DateRange;
  filters?: GlobalFilters;
  attribution?: AttributionModel;
  kpis?: KPIValue[];
  tables?: Array<{ name: string; rows: TableRow[] }>;
  dataQuality?: DataQuality;
}

export interface AIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIChatRequest {
  prompt: string;
  context?: AIContext;
  messages?: AIChatMessage[];
  mode?: AppMode;
}

export interface AIChatResponse {
  text: string;
  finishReason?: AIFinishReason;
}
