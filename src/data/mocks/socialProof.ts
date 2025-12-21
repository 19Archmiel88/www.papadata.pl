export type SocialProofItem = {
  id: string;
  quoteKey: string;
  nameKey: string;
  roleKey: string;
};

export const socialProofItems: SocialProofItem[] = [
  {
    id: 'quote-1',
    quoteKey: 'landing.socialProof.items.one.quote',
    nameKey: 'landing.socialProof.items.one.name',
    roleKey: 'landing.socialProof.items.one.role',
  },
  {
    id: 'quote-2',
    quoteKey: 'landing.socialProof.items.two.quote',
    nameKey: 'landing.socialProof.items.two.name',
    roleKey: 'landing.socialProof.items.two.role',
  },
  {
    id: 'quote-3',
    quoteKey: 'landing.socialProof.items.three.quote',
    nameKey: 'landing.socialProof.items.three.name',
    roleKey: 'landing.socialProof.items.three.role',
  },
];
