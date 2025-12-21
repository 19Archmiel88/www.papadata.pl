export type TeamMember = {
  id: string;
  nameKey: string;
  roleKey: string;
  email: string;
  statusKey: string;
};

export const teamMembers: TeamMember[] = [
  {
    id: 'alina',
    nameKey: 'dashboard.team.members.alina.name',
    roleKey: 'dashboard.team.roles.owner',
    email: 'alina@papadata.pl',
    statusKey: 'dashboard.team.status.active',
  },
  {
    id: 'mateo',
    nameKey: 'dashboard.team.members.mateo.name',
    roleKey: 'dashboard.team.roles.admin',
    email: 'mateo@papadata.pl',
    statusKey: 'dashboard.team.status.active',
  },
  {
    id: 'sara',
    nameKey: 'dashboard.team.members.sara.name',
    roleKey: 'dashboard.team.roles.analyst',
    email: 'sara@papadata.pl',
    statusKey: 'dashboard.team.status.invited',
  },
];
