export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export type TokenBudget = {
  maxMessages: number;
  maxInputChars: number;
  maxTotalChars: number;
};

export const DEFAULT_BUDGET: TokenBudget = {
  maxMessages: 8,
  maxInputChars: 1200,
  maxTotalChars: 6000,
};

export const truncateText = (value: string, maxChars: number) => {
  if (value.length <= maxChars) return value;
  return `${value.slice(0, Math.max(0, maxChars - 3))}...`;
};

export const applyTokenBudget = (messages: ChatMessage[], budget: TokenBudget = DEFAULT_BUDGET) => {
  const system = messages.filter((message) => message.role === 'system');
  const conversation = messages.filter((message) => message.role !== 'system');

  let trimmed = conversation.slice(-budget.maxMessages).map((message) => ({
    ...message,
    content: truncateText(message.content, budget.maxInputChars),
  }));

  let totalChars = trimmed.reduce((sum, message) => sum + message.content.length, 0);
  while (totalChars > budget.maxTotalChars && trimmed.length > 1) {
    totalChars -= trimmed[0].content.length;
    trimmed = trimmed.slice(1);
  }

  return [...system, ...trimmed];
};
