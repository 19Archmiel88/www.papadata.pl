export type FaqItem = {
  id: string;
  questionKey: string;
  answerKey: string;
};

export const faqItems: FaqItem[] = [
  {
    id: 'developer',
    questionKey: 'landing.faq.items.developer.question',
    answerKey: 'landing.faq.items.developer.answer',
  },
  {
    id: 'trial',
    questionKey: 'landing.faq.items.trial.question',
    answerKey: 'landing.faq.items.trial.answer',
  },
  {
    id: 'cancel',
    questionKey: 'landing.faq.items.cancel.question',
    answerKey: 'landing.faq.items.cancel.answer',
  },
  {
    id: 'integrations',
    questionKey: 'landing.faq.items.integrations.question',
    answerKey: 'landing.faq.items.integrations.answer',
  },
  {
    id: 'security',
    questionKey: 'landing.faq.items.security.question',
    answerKey: 'landing.faq.items.security.answer',
  },
];
