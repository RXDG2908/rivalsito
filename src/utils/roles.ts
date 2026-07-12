import type { Role } from '../types';

export const getRoleColor = (role: Role) => {
  switch (role) {
    case 'Vanguard': return 'bg-blue-600';
    case 'Duelist': return 'bg-red-600';
    case 'Strategist': return 'bg-green-600';
  }
};
