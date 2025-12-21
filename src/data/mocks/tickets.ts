export type Ticket = {
  id: string;
  subjectKey: string;
  statusKey: string;
  priorityKey: string;
  channelKey: string;
  updated: string;
};

export const tickets: Ticket[] = [
  {
    id: 'billing-access',
    subjectKey: 'dashboard.support.tickets.billing.subject',
    statusKey: 'dashboard.support.tickets.status.open',
    priorityKey: 'dashboard.support.tickets.priority.high',
    channelKey: 'dashboard.support.tickets.channel.email',
    updated: '2024-08-22',
  },
  {
    id: 'sync-delay',
    subjectKey: 'dashboard.support.tickets.sync.subject',
    statusKey: 'dashboard.support.tickets.status.pending',
    priorityKey: 'dashboard.support.tickets.priority.medium',
    channelKey: 'dashboard.support.tickets.channel.chat',
    updated: '2024-08-21',
  },
  {
    id: 'access-request',
    subjectKey: 'dashboard.support.tickets.access.subject',
    statusKey: 'dashboard.support.tickets.status.solved',
    priorityKey: 'dashboard.support.tickets.priority.low',
    channelKey: 'dashboard.support.tickets.channel.portal',
    updated: '2024-08-18',
  },
];
