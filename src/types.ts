export type Role = 'Vanguard' | 'Duelist' | 'Strategist';

export interface Hero {
  id: string;
  name: string;
  role: Role; // Primary role
  roles?: Role[]; // All possible roles
  color: string;
  image?: string;
}

export interface TeamUp {
  name: string;
  icon: string;
  /** Compañero que potencia el team-up (según la ficha oficial) */
  partner?: string;
}

export interface PlayerAssignment {
  playerName: string;
  hero?: Hero;
  assignedRole?: Role;
  team?: 1 | 2;
  isShuffleOnly?: boolean;
  teamUp?: TeamUp;
}

export interface Player {
  id: string;
  name: string;
  role: Role | null;
}
