export type ChannelGroup =
  | 'paid_search'
  | 'paid_social'
  | 'organic_social'
  | 'email'
  | 'referral'
  | 'direct'
  | 'affiliate'
  | 'display'
  | 'unknown';

export type ChannelRule = {
  channelGroup: ChannelGroup;
  sources?: string[];
  mediums?: string[];
};

export const CHANNEL_RULES: ChannelRule[] = [
  {
    channelGroup: 'paid_search',
    sources: ['google', 'bing', 'yahoo'],
    mediums: ['cpc', 'ppc', 'paid_search'],
  },
  {
    channelGroup: 'paid_social',
    sources: ['meta', 'facebook', 'instagram', 'tiktok', 'linkedin'],
    mediums: ['paid_social', 'cpm', 'cpc'],
  },
  {
    channelGroup: 'organic_social',
    sources: ['facebook', 'instagram', 'tiktok', 'linkedin', 'x', 'twitter'],
    mediums: ['social', 'organic_social'],
  },
  {
    channelGroup: 'email',
    mediums: ['email', 'newsletter', 'mail'],
  },
  {
    channelGroup: 'referral',
    mediums: ['referral'],
  },
  {
    channelGroup: 'direct',
    sources: ['direct'],
    mediums: ['none', 'direct'],
  },
  {
    channelGroup: 'affiliate',
    mediums: ['affiliate'],
  },
  {
    channelGroup: 'display',
    mediums: ['display', 'banner'],
  },
];
