import type { ChannelGroup } from './channel-groups';
import { CHANNEL_RULES } from './channel-groups';

export type UtmInput = {
  source?: string | null;
  medium?: string | null;
  campaign?: string | null;
  content?: string | null;
  term?: string | null;
};

export type UtmNormalized = {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  channelGroup: ChannelGroup;
  warnings: string[];
};

const normalizeToken = (value?: string | null): string | undefined => {
  if (!value) return undefined;
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return undefined;
  return trimmed
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+/, '')
    .replace(/_+$/, '');
};

const resolveChannelGroup = (
  source: string | undefined,
  medium: string | undefined
): ChannelGroup => {
  if (!source || !medium) return 'unknown';
  for (const rule of CHANNEL_RULES) {
    const sourceMatch = rule.sources ? rule.sources.includes(source) : true;
    const mediumMatch = rule.mediums ? rule.mediums.includes(medium) : true;
    if (sourceMatch && mediumMatch) {
      return rule.channelGroup;
    }
  }
  return 'unknown';
};

export const normalizeUtm = (input: UtmInput): UtmNormalized => {
  const source = normalizeToken(input.source);
  const medium = normalizeToken(input.medium);
  const campaign = normalizeToken(input.campaign);
  const content = normalizeToken(input.content);
  const term = normalizeToken(input.term);
  const warnings: string[] = [];

  if (!source) warnings.push('source_missing');
  if (!medium) warnings.push('medium_missing');

  return {
    source,
    medium,
    campaign,
    content,
    term,
    channelGroup: resolveChannelGroup(source, medium),
    warnings,
  };
};
