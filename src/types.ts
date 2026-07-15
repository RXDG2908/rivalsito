export type Role = 'Vanguard' | 'Duelist' | 'Strategist';

export interface Hero {
  id: string;
  name: string;
  role: Role; // Primary role
  roles?: Role[]; // All possible roles
  color: string;
  image?: string;
}

/** Team-up de un héroe: sus compañeros directos + ícono oficial del combo */
export interface HeroTeamUp {
  icon: string | null;
  /** Nombres de los héroes con los que forma team-up */
  partners: string[];
}

export interface PlayerAssignment {
  playerName: string;
  hero?: Hero;
  assignedRole?: Role;
  team?: 1 | 2;
  isShuffleOnly?: boolean;
  teamUp?: HeroTeamUp;
}

export interface Player {
  id: string;
  name: string;
  role: Role | null;
}
