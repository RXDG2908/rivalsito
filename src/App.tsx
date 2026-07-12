/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  Users,
  PlusCircle,
  RotateCcw,
  Play,
  User,
  Trophy,
  Sparkles,
  ClipboardPaste,
  GripVertical,
  Trash2,
  Sun,
  Moon
} from 'lucide-react';

// --- Types ---

type Role = 'Vanguard' | 'Duelist' | 'Strategist';

interface Hero {
  id: string;
  name: string;
  role: Role; // Primary role
  roles?: Role[]; // All possible roles
  color: string;
  image?: string;
}

interface PlayerAssignment {
  playerName: string;
  hero?: Hero;
  assignedRole?: Role;
  team?: 1 | 2;
  isShuffleOnly?: boolean;
}

// --- Data ---

const HEROES: Hero[] = [
  // Vanguards (Tanks)
  { id: 'angela', name: 'Angela', role: 'Vanguard', color: 'bg-blue-600', image: './Angela_Hero_Logo.png' },
  { id: 'banner', name: 'Hulk', role: 'Vanguard', color: 'bg-blue-600', image: './Hulk_Hero_Logo.png' },
  { id: 'cap', name: 'Captain America', role: 'Vanguard', color: 'bg-blue-600', image: './Captain_America_Hero_Logo.png' },
  { id: 'strange', name: 'Doctor Strange', role: 'Vanguard', color: 'bg-blue-600', image: './Doctor_Strange_Hero_Logo.png' },
  { id: 'emma', name: 'Emma Frost', role: 'Vanguard', color: 'bg-blue-600', image: './Emma_Frost_Hero_Logo.png' },
  { id: 'groot', name: 'Groot', role: 'Vanguard', color: 'bg-blue-600', image: './Groot_Hero_Logo.png' },
  { id: 'magneto', name: 'Magneto', role: 'Vanguard', color: 'bg-blue-600', image: './Magneto_Hero_Logo.png' },
  { id: 'peni', name: 'Peni Parker', role: 'Vanguard', color: 'bg-blue-600', image: './Peni_Parker_Hero_Logo.png' },
  { id: 'rogue', name: 'Rogue', role: 'Vanguard', color: 'bg-blue-600', image: './Rogue_COS_LOGO.png' },
  { id: 'devildino', name: 'Devil Dinosaur', role: 'Vanguard', color: 'bg-blue-600', image: './Devil_Dinosaur_Hero_Logo.png' },
  { id: 'thing', name: 'The Thing', role: 'Vanguard', color: 'bg-blue-600', image: './The_Thing_Hero_Logo.png' },
  { id: 'thor', name: 'Thor', role: 'Vanguard', color: 'bg-blue-600', image: './Thor_Hero_Logo.png' },
  { id: 'venom', name: 'Venom', role: 'Vanguard', color: 'bg-blue-600', image: './Venom_Hero_Logo.png' },
  
  // Duelists (DPS)
  { id: 'panther', name: 'Black Panther', role: 'Duelist', color: 'bg-red-600', image: './Black_Panther_Hero_Logo.png' },
  { id: 'widow', name: 'Black Widow', role: 'Duelist', color: 'bg-red-600', image: './Black_Widow_Hero_Logo.png' },
  { id: 'blackcat', name: 'Black Cat', role: 'Duelist', color: 'bg-red-600', image: './Black_Cat_Hero_Logo.png' },
  { id: 'blade', name: 'Blade', role: 'Duelist', color: 'bg-red-600', image: './Blade_Hero_Logo.png' },
  { id: 'cyclops', name: 'Cyclops', role: 'Duelist', color: 'bg-red-600', image: './Cyclops_Hero_Logo.png' },
  { id: 'daredevil', name: 'Daredevil', role: 'Duelist', color: 'bg-red-600', image: './Daredevil_Hero_Logo.png' },
  { id: 'deadpool', name: 'Deadpool', role: 'Duelist', roles: ['Vanguard', 'Duelist', 'Strategist'], color: 'bg-red-600', image: './Deadpool_Hero_Logo.png' },
  { id: 'elsa', name: 'Elsa Bloodstone', role: 'Duelist', color: 'bg-red-600', image: './Elsa_Bloodstone_Hero_Logo.png' },
  { id: 'hawkeye', name: 'Hawkeye', role: 'Duelist', color: 'bg-red-600', image: './Hawkeye_Hero_Logo.png' },
  { id: 'hela', name: 'Hela', role: 'Duelist', color: 'bg-red-600', image: './Hela_Hero_Logo.png' },
  { id: 'humantorch', name: 'Human Torch', role: 'Duelist', color: 'bg-red-600', image: './Human_Torch_Hero_Logo.png' },
  { id: 'ironfist', name: 'Iron Fist', role: 'Duelist', color: 'bg-red-600', image: './Iron_Fist_Hero_Logo.png' },
  { id: 'ironman', name: 'Iron Man', role: 'Duelist', color: 'bg-red-600', image: './Iron_Man_Hero_Logo.png' },
  { id: 'magik', name: 'Magik', role: 'Duelist', color: 'bg-red-600', image: './Magik_Hero_Logo.png' },
  { id: 'mrfantastic', name: 'Mister Fantastic', role: 'Duelist', color: 'bg-red-600', image: './Mister_Fantastic_Hero_Logo.png' },
  { id: 'moonknight', name: 'Moon Knight', role: 'Duelist', color: 'bg-red-600', image: './Moon_Knight_Hero_Logo.png' },
  { id: 'namor', name: 'Namor', role: 'Duelist', color: 'bg-red-600', image: './Namor_Hero_Logo.png' },
  { id: 'phoenix', name: 'Phoenix', role: 'Duelist', color: 'bg-red-600', image: './Phoenix_Hero_Logo.png' },
  { id: 'psylocke', name: 'Psylocke', role: 'Duelist', color: 'bg-red-600', image: './Psylocke_Hero_Logo.png' },
  { id: 'scarlet', name: 'Scarlet Witch', role: 'Duelist', color: 'bg-red-600', image: './Scarlet_Witch_Hero_Logo.png' },
  { id: 'spiderman', name: 'Spider-Man', role: 'Duelist', color: 'bg-red-600', image: './Spider-Man_Hero_Logo.png' },
  { id: 'squirrelgirl', name: 'Squirrel Girl', role: 'Duelist', color: 'bg-red-600', image: './Squirrel_Girl_Hero_Logo.png' },
  { id: 'starlord', name: 'Star-Lord', role: 'Duelist', color: 'bg-red-600', image: './Star-Lord_Hero_Logo.png' },
  { id: 'storm', name: 'Storm', role: 'Duelist', color: 'bg-red-600', image: './Storm_Hero_Logo.png' },
  { id: 'punisher', name: 'The Punisher', role: 'Duelist', color: 'bg-red-600', image: './The_Punisher_Hero_Logo.png' },
  { id: 'winter-soldier', name: 'Winter Soldier', role: 'Duelist', color: 'bg-red-600', image: './Winter_Soldier_Hero_Logo.png' },
  { id: 'wolverine', name: 'Wolverine', role: 'Duelist', color: 'bg-red-600', image: './Wolverine_Hero_Logo.png' },

  // Strategists (Support)
  { id: 'mantis', name: 'Mantis', role: 'Strategist', color: 'bg-green-600', image: './Mantis_Hero_Logo.png' },
  { id: 'rocket', name: 'Rocket Raccoon', role: 'Strategist', color: 'bg-green-600', image: './Rocket_Raccoon_Hero_Logo.png' },
  { id: 'luna', name: 'Luna Snow', role: 'Strategist', color: 'bg-green-600', image: './Luna_Snow_Hero_Logo.png' },
  { id: 'warlock', name: 'Adam Warlock', role: 'Strategist', color: 'bg-green-600', image: './Adam_Warlock_Hero_Logo.png' },
  { id: 'loki', name: 'Loki', role: 'Strategist', color: 'bg-green-600', image: './Loki_Hero_Logo.png' },
  { id: 'jeff', name: 'Jeff the Land Shark', role: 'Strategist', color: 'bg-green-600', image: './Jeff_the_Land_Shark_Hero_Logo.png' },
  { id: 'invisible', name: 'Invisible Woman', role: 'Strategist', color: 'bg-green-600', image: './Invisible_Woman_Hero_Logo.png' },
  { id: 'cloakdagger', name: 'Cloak & Dagger', role: 'Strategist', color: 'bg-green-600', image: './Cloak_and_Dagger_Hero_Logo.png' },
  { id: 'gambito', name: 'Gambit', role: 'Strategist', color: 'bg-green-600', image: './Gambit_Hero_Logo.png' },
  { id: 'jubilee', name: 'Jubilee', role: 'Strategist', color: 'bg-green-600', image: './Jubilee_Hero_Logo.png' },
  { id: 'ultron', name: 'Ultron', role: 'Strategist', color: 'bg-green-600', image: './Ultron_Hero_Logo.png' },
  { id: 'whitefox', name: 'White Fox', role: 'Strategist', color: 'bg-green-600', image: './White_Fox_Hero_Logo.png' },
];

const DEFAULT_NAMES: string[] = [];

const RECENT_PLAYERS: string[] = [];

// --- Components ---

// --- Utils ---

let sharedAudioCtx: AudioContext | null = null;

const playRevealSound = () => {
  try {
    if (!sharedAudioCtx) {
      sharedAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const audioCtx = sharedAudioCtx;
    if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
    oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.1); // A4

    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.3);
  } catch (e) {
    console.error('Audio error:', e);
  }
};

const getRoleColor = (role: Role) => {
  switch (role) {
    case 'Vanguard': return 'bg-blue-600';
    case 'Duelist': return 'bg-red-600';
    case 'Strategist': return 'bg-green-600';
  }
};

const HeroRevealCard: React.FC<{ 
  assignment: PlayerAssignment; 
  allHeroes: Hero[];
  index: number;
  hidePlayerName?: boolean;
  isSuspense?: boolean;
}> = ({ 
  assignment, 
  allHeroes,
  index,
  hidePlayerName = false,
  isSuspense = false
}) => {
  const [displayHero, setDisplayHero] = useState<Hero | null>(null);
  const [isCycling, setIsCycling] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [displayHero]);

  useEffect(() => {
    if (!assignment) return;

    if (assignment.isShuffleOnly) {
      setIsCycling(false);
      playRevealSound();
      return;
    }

    const roleHeroes = allHeroes.filter(h => (h.roles || [h.role]).includes(assignment.assignedRole!));
    if (roleHeroes.length === 0) {
      setDisplayHero(assignment.hero || null);
      setIsCycling(false);
      return;
    }

    let cycleCount = 0;
    const baseCycles = isSuspense ? 24 : 15;
    const maxCycles = baseCycles + Math.floor(Math.random() * (isSuspense ? 6 : 10));
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const runCycle = () => {
      if (cancelled) return;
      if (cycleCount < maxCycles) {
        const randomHero = roleHeroes[Math.floor(Math.random() * roleHeroes.length)];
        setDisplayHero(randomHero);
        cycleCount++;

        const baseDelay = 60;
        const slowFactor = isSuspense ? 6 : 5;
        const delay = baseDelay + (cycleCount * slowFactor);

        timeoutId = setTimeout(runCycle, delay);
      } else {
        setDisplayHero(assignment.hero || null);
        setIsCycling(false);
        playRevealSound();
      }
    };

    runCycle();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [assignment, allHeroes, isSuspense]);

  if (!assignment.isShuffleOnly && !displayHero) return null;

  const teamColor = assignment.team === 1 ? 'bg-red-600' : 'bg-blue-600';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ 
        opacity: 1, 
        scale: isCycling ? (isSuspense ? [1.05, 1.1, 1.05] : 1.05) : 1, 
        y: 0 
      }}
      transition={{ 
        type: 'spring', 
        damping: 15,
        scale: isCycling && isSuspense ? { repeat: Infinity, duration: 0.4 } : { type: 'spring', damping: 15 }
      }}
      className="relative group"
    >
      <div className={`absolute -inset-1 rounded-2xl blur-lg opacity-20 transition-colors duration-500 ${assignment.assignedRole ? getRoleColor(assignment.assignedRole) : teamColor}`} />
      <div className="relative bg-[#151515] border border-white/10 rounded-xl overflow-hidden shadow-2xl h-[220px] flex flex-col">
        {/* Role Visual */}
        <div className={`h-28 relative overflow-hidden shrink-0 flex items-center justify-center transition-colors duration-500 ${assignment.assignedRole ? getRoleColor(assignment.assignedRole) : teamColor} bg-opacity-20`}>
          {assignment.isShuffleOnly ? (
            <div className="flex flex-col items-center gap-2">
              {assignment.assignedRole ? (
                <RoleIcon role={assignment.assignedRole} size={72} className="drop-shadow-lg opacity-40" />
              ) : (
                <Users size={64} className="opacity-40" />
              )}
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Equipo {assignment.team}</span>
            </div>
          ) : (
            <>
              {displayHero?.image && !imageError ? (
                <motion.img 
                  key={displayHero.id}
                  initial={isCycling ? { opacity: 0.5, scale: 0.9 } : { opacity: 0.6 }}
                  animate={{ opacity: isCycling ? 0.8 : 1, scale: isCycling ? 0.9 : 1.2 }}
                  src={displayHero.image} 
                  alt={displayHero.name}
                  className="absolute inset-0 w-full h-full object-contain p-1.5 transition-opacity duration-500"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <RoleIcon role={assignment.assignedRole!} size={72} className="drop-shadow-lg opacity-40" />
                </div>
              )}
              
              {/* Role Badge */}
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1">
                <RoleIcon role={assignment.assignedRole!} size={12} />
                <span className="text-[7px] font-black uppercase tracking-widest">{assignment.assignedRole}</span>
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col justify-between flex-grow">
          {!hidePlayerName && (
            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/30 mb-0.5">Jugador</p>
              <h3 className={`text-sm font-black italic uppercase truncate ${assignment.team === 1 ? 'text-red-500' : 'text-blue-500'}`}>
                {assignment.playerName}
              </h3>
            </div>
          )}
          
          <div className="flex items-end justify-between mt-auto">
            {!assignment.isShuffleOnly ? (
              <>
                <div className="min-w-0 flex-1 mr-2">
                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/30 mb-0.5">Héroe</p>
                  <AnimatePresence mode="wait">
                    <motion.h4 
                      key={displayHero?.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.1 }}
                      className={`text-base font-black uppercase tracking-tighter truncate ${isCycling ? 'text-white/40' : 'text-white'}`}
                    >
                      {displayHero?.name}
                    </motion.h4>
                  </AnimatePresence>
                </div>
                <div className={`w-8 h-8 rounded-lg transition-colors duration-500 ${getRoleColor(assignment.assignedRole!)} flex items-center justify-center shadow-lg shrink-0`}>
                  <RoleIcon role={assignment.assignedRole!} className="text-white" size={24} />
                </div>
              </>
            ) : (
              <div className="w-full flex justify-between items-center">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/30 mb-0.5">Asignación</p>
                  <h4 className="text-xs font-black uppercase tracking-widest text-white">Equipo {assignment.team}</h4>
                </div>
                <div className={`w-8 h-8 rounded-lg ${assignment.assignedRole ? getRoleColor(assignment.assignedRole) : teamColor} flex items-center justify-center shadow-lg transition-colors duration-500`}>
                  {assignment.assignedRole ? (
                    <RoleIcon role={assignment.assignedRole} size={24} className="text-white" />
                  ) : (
                    <Users size={16} className="text-white" />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const RoleIcon = ({ role, className = "", size = 30 }: { role: Role, className?: string, size?: number }) => {
  const [error, setError] = useState(false);

  const getIconPath = () => {
    switch (role) {
      case 'Vanguard': return './roles/Vanguard_Icon.png';
      case 'Duelist': return './roles/Duelist_Icon.png';
      case 'Strategist': return './roles/Strategist_Icon.png';
    }
  };

  if (error) {
    return (
      <div 
        style={{ width: size, height: size }}
        className={`rounded-full ${role === 'Vanguard' ? 'bg-blue-600' : role === 'Duelist' ? 'bg-red-600' : 'bg-green-600'} ${className}`}
      />
    );
  }

  return (
    <img 
      src={getIconPath()} 
      alt={role}
      style={{ width: size, height: size }}
      className={`object-contain ${className}`}
      referrerPolicy="no-referrer"
      onError={() => setError(true)}
    />
  );
};

interface Player {
  id: string;
  name: string;
  role: Role | null;
}

const PlayerSlot: React.FC<{
  player: Player;
  idx: number;
  displayNumber: number;
  accent: 'red' | 'blue';
  showRoleButtons: boolean;
  isDragOver: boolean;
  setDragOverIndex: (i: number | null) => void;
  onNameChange: (idx: number, value: string) => void;
  onRoleChange: (idx: number, role: Role) => void;
  trashRef: React.RefObject<HTMLDivElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}> = ({
  player,
  idx,
  displayNumber,
  accent,
  showRoleButtons,
  isDragOver,
  setDragOverIndex,
  onNameChange,
  onRoleChange,
  trashRef,
  containerRef
}) => {
  const role = player.role;
  const roleBg = role === 'Vanguard' ? 'bg-blue-500/5 border-blue-500/20' : role === 'Duelist' ? 'bg-red-500/5 border-red-500/20' : role === 'Strategist' ? 'bg-green-500/5 border-green-500/20' : 'bg-white/5 border-white/5';
  const glow = accent === 'red' ? 'from-red-600/10 to-red-600/5' : 'from-blue-600/10 to-blue-600/5';

  return (
    <Reorder.Item
      value={player}
      dragConstraints={containerRef}
      dragElastic={0}
      dragMomentum={false}
      whileDrag={{
        scale: 1.05,
        zIndex: 100,
        cursor: 'grabbing',
        boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.7)"
      }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="group relative"
      onDragOver={(e) => {
        e.preventDefault();
        setDragOverIndex(idx);
      }}
      onDragLeave={() => setDragOverIndex(null)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOverIndex(null);
        const droppedName = e.dataTransfer.getData('playerName');
        const sourceIdx = e.dataTransfer.getData('sourceIdx');
        if (droppedName) {
          if (sourceIdx && sourceIdx !== 'recent') {
            onNameChange(parseInt(sourceIdx), '');
          }
          onNameChange(idx, droppedName);
        }
      }}
      onDragEnd={(_, info) => {
        if (trashRef.current) {
          const trashRect = trashRef.current.getBoundingClientRect();
          const { x, y } = info.point;
          if (
            x >= trashRect.left &&
            x <= trashRect.right &&
            y >= trashRect.top &&
            y <= trashRect.bottom
          ) {
            onNameChange(idx, '');
          }
        }
      }}
    >
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${glow} rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500`} />
      <div
        draggable={!!player.name}
        onDragStart={(e) => {
          e.dataTransfer.setData('playerName', player.name);
          e.dataTransfer.setData('sourceIdx', idx.toString());
        }}
        className={`relative ${roleBg} border ${isDragOver ? 'border-white bg-white/10' : 'border-white/5'} rounded-xl p-3 flex flex-col gap-3 transition-all duration-300 group-hover:border-white/10 shadow-lg`}
      >
        <div className="flex items-center gap-3">
          <div className="cursor-grab active:cursor-grabbing opacity-20 hover:opacity-60 transition-opacity p-1">
            <GripVertical size={16} />
          </div>

          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border border-white/5 shrink-0 ${role === 'Vanguard' ? 'bg-blue-600/20 text-blue-500' : role === 'Duelist' ? 'bg-red-600/20 text-red-500' : role === 'Strategist' ? 'bg-green-600/20 text-green-500' : 'bg-white/5 text-white/20'}`}>
            <span className="text-[10px] font-black">{displayNumber}</span>
          </div>

          <div className="flex-1 min-w-0 flex items-center gap-3">
            <div className="shrink-0">
              {role ? (
                <RoleIcon role={role} size={20} className="opacity-60" />
              ) : (
                <div className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center opacity-20">
                  <User size={10} />
                </div>
              )}
            </div>
            <input
              type="text"
              value={player.name}
              onChange={(e) => onNameChange(idx, e.target.value)}
              placeholder="Nombre..."
              className="w-full bg-transparent border-none p-0 text-base font-bold placeholder:text-white/5 focus:ring-0 focus:outline-none truncate"
            />
          </div>

          {player.name && (
            <button
              onClick={() => onNameChange(idx, '')}
              className="opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-opacity p-2 hover:text-red-500"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>

        {/* Role Selection Buttons */}
        {showRoleButtons && (
          <div className="flex items-center gap-1 pl-11">
            {(['Vanguard', 'Duelist', 'Strategist'] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => onRoleChange(idx, r)}
                className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-tighter transition-all border ${
                  role === r
                    ? r === 'Vanguard' ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' : r === 'Duelist' ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-green-500/20 border-green-500/40 text-green-400'
                    : 'bg-white/5 border-white/5 text-white/20 hover:bg-white/10 hover:text-white/40'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        )}
      </div>
    </Reorder.Item>
  );
};

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [view, setView] = useState<'menu' | 'draft'>('menu');
  const [mode, setMode] = useState<'single' | 'double' | 'party'>('single');
  const [partyMode, setPartyMode] = useState<'allSame' | 'allVanguard' | 'allDuelist' | 'allStrategist' | 'random'>('allSame');
  const [shuffleTeams, setShuffleTeams] = useState(false);
  const [isShuffleOnly, setIsShuffleOnly] = useState(false);
  const [playersPerTeam, setPlayersPerTeam] = useState<2 | 4 | 6>(6);
  const [useNames, setUseNames] = useState(true);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isDrafting, setIsDrafting] = useState(false);
  const [fullDraftResults, setFullDraftResults] = useState<PlayerAssignment[]>([]);
  const [assignments, setAssignments] = useState<PlayerAssignment[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState<Role | 'All'>('All');
  const [disabledHeroIds, setDisabledHeroIds] = useState<Set<string>>(new Set());
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [pasteText, setPasteText] = useState('');
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isOverTrash, setIsOverTrash] = useState(false);
  const [pasteTeamTarget, setPasteTeamTarget] = useState<1 | 2 | 'both' | undefined>(undefined);
  const trashRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToast(null), 3000);
  };

  const handleClipboardPaste = (team?: 1 | 2 | 'both') => {
    setPasteTeamTarget(team);
    setPasteText('');
    setIsPasteModalOpen(true);
  };

  const processPaste = () => {
    if (!pasteText.trim()) return;

    // Split by newline, comma, or semicolon and trim
    const names = pasteText.split(/[\n,;]+/).map(n => n.trim()).filter(n => n !== '');
    
    // Filter out duplicates from the pasted list and from existing players
    const uniqueNames: string[] = [];
    const seenNames = new Set(players.map(p => p.name.trim().toLowerCase()));

    names.forEach(name => {
      const lowerName = name.toLowerCase();
      if (!seenNames.has(lowerName)) {
        seenNames.add(lowerName);
        uniqueNames.push(name);
      }
    });

    if (uniqueNames.length > 0) {
      const newPlayers = [...players];
      
      if (pasteTeamTarget === 'both') {
        uniqueNames.slice(0, playersPerTeam * 2).forEach((name, i) => {
          if (i < newPlayers.length) {
            newPlayers[i] = { ...newPlayers[i], name };
          }
        });
      } else {
        const startIndex = pasteTeamTarget === 2 ? playersPerTeam : 0;
        uniqueNames.slice(0, playersPerTeam).forEach((name, i) => {
          if (startIndex + i < newPlayers.length) {
            newPlayers[startIndex + i] = { ...newPlayers[startIndex + i], name };
          }
        });
      }
      
      setPlayers(newPlayers);
    }
    setIsPasteModalOpen(false);
    setPasteText('');
  };

  const playerCount = mode === 'single' || mode === 'party' ? playersPerTeam : playersPerTeam * 2;

  useEffect(() => {
    if (view === 'draft' && (players.length === 0 || players.length !== playerCount)) {
      const initialPlayers = Array(playerCount).fill(null).map((_, i) => {
        return {
          id: `player-${i}-${Math.random()}`,
          name: DEFAULT_NAMES[i] || '',
          role: null
        };
      });
      setPlayers(initialPlayers);
    }
  }, [view, mode, playerCount, playersPerTeam]);

  // Sequential reveal logic
  useEffect(() => {
    let timeoutId: any;
    
    const maxSteps = mode === 'double' ? playersPerTeam : fullDraftResults.length;
    const expectedResultsLength = (mode === 'party' && partyMode === 'allSame') ? 1 : playerCount;

    if (isDrafting && currentStep < maxSteps && fullDraftResults.length === expectedResultsLength) {
      timeoutId = setTimeout(() => {
        if (mode === 'single' || mode === 'party') {
          setAssignments(prev => [...prev, fullDraftResults[currentStep]]);
        } else {
          // Reveal one from each team
          const team1Player = fullDraftResults[currentStep];
          const team2Player = fullDraftResults[currentStep + playersPerTeam];
          setAssignments(prev => [...prev, team1Player, team2Player]);
        }
        setCurrentStep(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isDrafting, currentStep, fullDraftResults, playerCount, mode, playersPerTeam]);

  const handlePlayerChange = (index: number, value: string) => {
    const trimmedValue = value.trim().toLowerCase();
    if (trimmedValue !== '' && players.some((p, i) => i !== index && p.name.trim().toLowerCase() === trimmedValue)) {
      // Duplicate name restriction
      return;
    }
    const newPlayers = [...players];
    newPlayers[index] = { ...newPlayers[index], name: value };
    setPlayers(newPlayers);
  };

  const handleRoleChange = (index: number, role: Role) => {
    const newPlayers = [...players];
    const currentRole = newPlayers[index].role;
    newPlayers[index] = { ...newPlayers[index], role: currentRole === role ? null : role };
    setPlayers(newPlayers);
  };

  const startDraft = () => {
    if (useNames && !(mode === 'party' && partyMode === 'allSame') && players.some(p => p.name.trim() === '')) {
      showToast(`Por favor ingresa los nombres de los ${playerCount} jugadores.`);
      return;
    }

    const newAssignments: PlayerAssignment[] = [];
    const usedHeroIds = new Set<string>();

    if (mode === 'party') {
      let selectedHero: Hero | null = null;
      if (partyMode === 'allSame') {
        const available = HEROES.filter(h => !disabledHeroIds.has(h.id));
        selectedHero = available[Math.floor(Math.random() * available.length)];
        
        newAssignments.push({
          playerName: 'Todos',
          hero: selectedHero,
          assignedRole: selectedHero.role,
          team: undefined
        });
      } else {
        for (let i = 0; i < playerCount; i++) {
          const playerName = useNames ? players[i].name : `Jugador ${i + 1}`;
          const team = undefined;
          
          let hero: Hero | undefined;
          let role: Role | undefined;

          if (partyMode === 'allVanguard') {
            const available = HEROES.filter(h => h.role === 'Vanguard' && !disabledHeroIds.has(h.id));
            hero = available[Math.floor(Math.random() * available.length)];
            role = 'Vanguard';
          } else if (partyMode === 'allDuelist') {
            const available = HEROES.filter(h => h.role === 'Duelist' && !disabledHeroIds.has(h.id));
            hero = available[Math.floor(Math.random() * available.length)];
            role = 'Duelist';
          } else if (partyMode === 'allStrategist') {
            const available = HEROES.filter(h => h.role === 'Strategist' && !disabledHeroIds.has(h.id));
            hero = available[Math.floor(Math.random() * available.length)];
            role = 'Strategist';
          } else {
            const available = HEROES.filter(h => !disabledHeroIds.has(h.id));
            hero = available[Math.floor(Math.random() * available.length)];
            role = hero.role;
          }

          newAssignments.push({
            playerName,
            hero,
            assignedRole: role,
            team
          });
        }
      }
      
      setAssignments([]);
      setFullDraftResults(newAssignments);
      setCurrentStep(0);
      setIsDrafting(true);
      return;
    }

    // 1. Get roles from players state
    const initialRoles: (Role | null)[] = players.map(p => p.role);
    const balancedRoles: (Role | null)[] = [...initialRoles];
    
    // 2. Balance roles for each team if not fully assigned
    const teams = mode === 'double' ? [
      { start: 0, end: playersPerTeam },
      { start: playersPerTeam, end: playerCount }
    ] : [
      { start: 0, end: playerCount }
    ];

    teams.forEach(teamRange => {
      const teamRoles = initialRoles.slice(teamRange.start, teamRange.end);
      const nullIndices: number[] = [];
      
      teamRoles.forEach((r, idx) => {
        if (!r) nullIndices.push(idx + teamRange.start);
      });

      if (nullIndices.length > 0) {
        // Define target pool based on team size
        let rolePool: Role[] = [];
        if (playersPerTeam === 6) {
          rolePool = ['Vanguard', 'Vanguard', 'Duelist', 'Duelist', 'Strategist', 'Strategist'];
        } else if (playersPerTeam === 4) {
          rolePool = ['Vanguard', 'Duelist', 'Duelist', 'Strategist'];
        } else {
          rolePool = ['Vanguard', 'Duelist'];
        }

        // Remove already assigned roles from the pool to keep balance
        teamRoles.forEach(r => {
          if (r) {
            const index = rolePool.indexOf(r);
            if (index !== -1) rolePool.splice(index, 1);
          }
        });

        // Sort the pool to ensure order: Vanguard, Duelist, Strategist
        const roleOrder: Role[] = ['Vanguard', 'Duelist', 'Strategist'];
        rolePool.sort((a, b) => roleOrder.indexOf(a) - roleOrder.indexOf(b));

        // Assign from pool to null indices in order
        nullIndices.forEach(idx => {
          if (rolePool.length > 0) {
            balancedRoles[idx] = rolePool.shift()!;
          } else {
            // Fallback if user over-assigned roles manually
            const allRoles: Role[] = ['Vanguard', 'Duelist', 'Strategist'];
            balancedRoles[idx] = allRoles[Math.floor(Math.random() * allRoles.length)];
          }
        });
      }
    });

    // 3. Prepare players
    let finalPlayers = players.map(p => p.name);
    if (useNames) {
      if (mode === 'double' && !shuffleTeams && !isShuffleOnly) {
        // Shuffle within teams (Team 1: 0-5, Team 2: 6-11)
        const team1 = finalPlayers.slice(0, playersPerTeam);
        const team2 = finalPlayers.slice(playersPerTeam, playerCount);
        
        // Shuffle team 1
        for (let i = team1.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [team1[i], team1[j]] = [team1[j], team1[i]];
        }
        // Shuffle team 2
        for (let i = team2.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [team2[i], team2[j]] = [team2[j], team2[i]];
        }
        finalPlayers = [...team1, ...team2];
      } else {
        // Shuffle all (Single mode or Double with shuffleTeams or isShuffleOnly)
        for (let i = finalPlayers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [finalPlayers[i], finalPlayers[j]] = [finalPlayers[j], finalPlayers[i]];
        }
      }
    }
    
    // 4. Pick unique heroes for each role in the fixed order
    usedHeroIds.clear();
    newAssignments.length = 0;

    for (let i = 0; i < playerCount; i++) {
      const playerIndexInTeam = mode === 'double' ? (i % playersPerTeam) : i;
      const playerName = useNames ? finalPlayers[i] : `Jugador ${playerIndexInTeam + 1}`;
      const team = mode === 'double' ? (i < playersPerTeam ? 1 : 2) : undefined;

      const role = balancedRoles[i];

      if (isShuffleOnly) {
        newAssignments.push({
          playerName,
          team,
          isShuffleOnly: true,
          assignedRole: role || undefined
        });
        continue;
      }

      const availableHeroes = HEROES.filter(h => 
        (!role || (h.roles || [h.role]).includes(role)) && 
        !usedHeroIds.has(h.id) && 
        !disabledHeroIds.has(h.id)
      );
      
      if (availableHeroes.length === 0) continue;

      const randomHero = availableHeroes[Math.floor(Math.random() * availableHeroes.length)];
      usedHeroIds.add(randomHero.id);
      
      newAssignments.push({
        playerName,
        hero: randomHero,
        assignedRole: role || undefined,
        team
      });
    }

    if (newAssignments.length === playerCount) {
      setAssignments([]);
      setFullDraftResults(newAssignments);
      setCurrentStep(0);
      setIsDrafting(true);
    }
  };

  const reset = () => {
    setIsDrafting(false);
    setAssignments([]);
    setFullDraftResults([]);
    setCurrentStep(0);
  };

  const backToMenu = () => {
    setView('menu');
    reset();
    setPlayers([]);
  };

  if (view === 'menu') {
    const surfaceCls = theme === 'dark'
      ? 'bg-white/5 border-white/10 hover:bg-white/10'
      : 'bg-black/5 border-black/10 hover:bg-black/10';
    const mutedCls = theme === 'dark' ? 'text-white/40' : 'text-black/50';
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-[#f5f5f5] text-black'} font-sans selection:bg-red-500/30 flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-500`}>
        {/* Background Image */}
        <div className="fixed inset-0 z-0">
          <img 
            src={theme === 'dark' ? './FondoYmas/FondoOscuro.png' : './FondoYmas/FondoClaro.jfif'} 
            alt="Background" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-black/60' : 'bg-white/40'} backdrop-blur-[2px]`} />
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={`fixed top-6 right-6 z-50 p-3 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-black/5 border-black/10 hover:bg-black/10 text-black'}`}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <header className="text-center mb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-6 ${theme === 'dark' ? 'bg-white/5 border-white/10 text-white/60' : 'bg-black/5 border-black/10 text-black/60'}`}
          >
            <Sparkles size={14} className="text-yellow-400" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Marvel Rivals Drafter</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <img 
              src="./FondoYmas/LOGOMARVELRIVALS.png" 
              alt="Marvel Rivals Logo" 
              className="h-32 md:h-48 mx-auto object-contain drop-shadow-[0_0_30px_rgba(220,38,38,0.3)]"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          <p className={`mt-4 max-w-md mx-auto font-medium ${theme === 'dark' ? 'text-white/40' : 'text-black/40'}`}>
            Selecciona el modo de sorteo para tu partida.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl relative z-10">
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setMode('single'); setIsShuffleOnly(false); setView('draft'); }}
              className={`w-full group relative p-8 border rounded-3xl overflow-hidden text-left transition-all ${surfaceCls}`}
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Users size={80} />
              </div>
              <h2 className="text-3xl font-black uppercase italic mb-2">1 Equipo</h2>
              <p className={`${mutedCls} text-sm mb-6`}>Sorteo estándar para tu equipo. Roles balanceados.</p>
              <div className="flex items-center gap-2 text-red-500 font-bold uppercase tracking-widest text-xs">
                <span>Seleccionar</span>
                <Play size={12} fill="currentColor" />
              </div>
            </motion.button>
          </div>

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setMode('double'); setShuffleTeams(false); setIsShuffleOnly(false); setView('draft'); }}
              className={`w-full group relative p-8 border rounded-3xl overflow-hidden text-left transition-all ${surfaceCls}`}
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <div className="flex gap-2">
                  <Users size={60} />
                  <Users size={60} />
                </div>
              </div>
              <h2 className="text-3xl font-black uppercase italic mb-2">2 Equipos</h2>
              <p className={`${mutedCls} text-sm mb-6`}>Sorteo completo para un enfrentamiento (Versus). Roles balanceados para ambos.</p>
              <div className="flex items-center gap-2 text-blue-500 font-bold uppercase tracking-widest text-xs">
                <span>Seleccionar</span>
                <Play size={12} fill="currentColor" />
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setMode('double'); setShuffleTeams(true); setIsShuffleOnly(true); setView('draft'); }}
              className={`w-full group relative p-6 border rounded-3xl overflow-hidden text-left transition-all ${surfaceCls}`}
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <RotateCcw size={40} />
              </div>
              <h2 className="text-xl font-black uppercase italic mb-1">2 Teams: Mezclar Jugadores</h2>
              <p className={`${mutedCls} text-xs`}>Mezcla a todos los jugadores entre ambos equipos antes del sorteo.</p>
              <div className="flex items-center gap-2 text-purple-500 font-bold uppercase tracking-widest text-[10px] mt-2">
                <span>Seleccionar</span>
                <Play size={10} fill="currentColor" />
              </div>
            </motion.button>
          </div>

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setMode('party'); setIsShuffleOnly(false); setView('draft'); }}
              className={`w-full group relative p-8 border rounded-3xl overflow-hidden text-left transition-all ${surfaceCls}`}
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles size={80} />
              </div>
              <h2 className="text-3xl font-black uppercase italic mb-2">Modo Party</h2>
              <p className={`${mutedCls} text-sm mb-6`}>Modos divertidos: todos el mismo héroe, solo tanques, etc.</p>
              <div className="flex items-center gap-2 text-yellow-500 font-bold uppercase tracking-widest text-xs">
                <span>Seleccionar</span>
                <Play size={12} fill="currentColor" />
              </div>
            </motion.button>
          </div>

          <div className="space-y-4 flex flex-col items-center justify-center gap-8">
            <div className="flex flex-col items-center gap-3">
              <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-white/30' : 'text-black/40'}`}>Jugadores por Equipo</p>
              <div className="flex gap-4">
                {[2, 4, 6].map((size) => (
                  <button
                    key={size}
                    onClick={() => setPlayersPerTeam(size as 2 | 4 | 6)}
                    className={`w-16 h-16 rounded-2xl border flex flex-col items-center justify-center transition-all ${playersPerTeam === size ? 'bg-red-600 border-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]' : surfaceCls}`}
                  >
                    <span className="text-2xl font-black italic">{size}</span>
                    <span className="text-[8px] font-bold uppercase opacity-60">PJS</span>
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowGallery(!showGallery)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all ${showGallery ? (theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-black/10 border-black/20') : surfaceCls}`}
            >
              <Users size={16} className={showGallery ? 'text-red-500' : mutedCls} />
              <span className="text-xs font-black uppercase tracking-widest">
                {showGallery ? 'Ocultar Héroes' : 'Ver Héroes Disponibles'}
              </span>
            </motion.button>
          </div>

          {/* Heroes Disponibles Panel */}
          <AnimatePresence>
            {showGallery && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="col-span-full mt-8 w-full max-w-5xl overflow-hidden"
              >
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-red-600/20 flex items-center justify-center">
                        <Trophy size={20} className="text-red-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-black italic uppercase tracking-tighter">Plantilla de Héroes</h3>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Previsualización de personajes cargados</p>
                      </div>
                    </div>

                    <div className="flex gap-2 bg-black/40 p-1 rounded-xl border border-white/5">
                      {(['All', 'Vanguard', 'Duelist', 'Strategist'] as const).map(role => (
                        <button
                          key={role}
                          onClick={() => setGalleryFilter(role)}
                          className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${galleryFilter === role ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/60'}`}
                        >
                          {role === 'All' ? 'Todos' : role === 'Vanguard' ? 'Tanques' : role === 'Duelist' ? 'Daño' : 'Soporte'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                    {HEROES
                      .filter(h => galleryFilter === 'All' || (h.roles || [h.role]).includes(galleryFilter as Role))
                      .map(hero => {
                        const displayRole = galleryFilter === 'All' ? hero.role : galleryFilter as Role;
                        const roleColor = getRoleColor(displayRole);
                        const isDisabled = disabledHeroIds.has(hero.id);
                        
                        return (
                          <motion.div 
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            key={hero.id} 
                            onClick={() => {
                              setDisabledHeroIds(prev => {
                                const next = new Set(prev);
                                if (next.has(hero.id)) next.delete(hero.id);
                                else next.add(hero.id);
                                return next;
                              });
                            }}
                            className="group relative flex flex-col items-center gap-2 cursor-pointer"
                          >
                            <div className={`relative w-full aspect-square rounded-2xl overflow-hidden border transition-all duration-300 ${isDisabled ? 'border-white/5 bg-white/5' : (displayRole === 'Vanguard' ? 'border-blue-500/10 group-hover:border-blue-500/40' : displayRole === 'Duelist' ? 'border-red-500/10 group-hover:border-red-500/40' : 'border-green-500/10 group-hover:border-green-500/40') + ' bg-white/[0.03] group-hover:bg-white/[0.08]'} shadow-lg flex items-center justify-center`}>
                              {hero.image ? (
                                <img 
                                  src={hero.image} 
                                  alt={hero.name}
                                  className={`max-w-full max-h-full object-contain p-1.5 transition-all duration-500 ${isDisabled ? 'grayscale opacity-20' : 'opacity-70 group-hover:opacity-100 group-hover:scale-110'}`}
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className={`w-full h-full flex items-center justify-center ${isDisabled ? 'grayscale opacity-5' : 'opacity-20'}`}>
                                  <RoleIcon role={displayRole} size={48} />
                                </div>
                              )}
                              
                              {/* Role Indicator Dot */}
                              <div className={`absolute bottom-2 right-2 w-2 h-2 rounded-full transition-colors duration-300 ${isDisabled ? 'bg-white/10' : roleColor} shadow-[0_0_8px_rgba(0,0,0,0.5)]`} />
                            </div>
                            <span className={`text-[8px] font-black uppercase tracking-tighter truncate w-full text-center transition-colors ${isDisabled ? 'text-white/10' : 'text-white/40 group-hover:text-white'}`}>
                              {hero.name}
                            </span>
                          </motion.div>
                        );
                      })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <footer className="mt-24 text-center relative z-10">
          <div className="flex flex-col items-center gap-6">
            <img 
              src="./FondoYmas/MarcasDesarrolladoras.png" 
              alt="Developer Brands" 
              className={`h-12 md:h-16 object-contain opacity-60 hover:opacity-100 transition-opacity ${theme === 'light' ? 'invert' : ''}`}
              referrerPolicy="no-referrer"
            />
            <p className={`text-[10px] font-bold uppercase tracking-[0.5em] ${theme === 'dark' ? 'text-white/20' : 'text-black/20'}`}>
              © Renzuky Apps
            </p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-[#f5f5f5] text-black'} font-sans selection:bg-red-500/30 transition-colors duration-500`}>
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <img 
          src={theme === 'dark' ? './FondoYmas/FondoOscuro.png' : './FondoYmas/FondoClaro.jfif'} 
          alt="Background" 
          className="w-full h-full object-cover opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-black/70' : 'bg-white/60'} backdrop-blur-[1px]`} />
      </div>

      {/* Theme Toggle */}
      <button 
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className={`fixed top-6 right-6 z-50 p-3 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-black/5 border-black/10 hover:bg-black/10 text-black'}`}
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-4">
        <header className="text-center mb-4">
          <div className="flex justify-center mb-1">
            <button 
              onClick={backToMenu}
              className={`inline-flex items-center gap-2 px-2 py-1 rounded-full border transition-colors ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white/60' : 'bg-black/5 border-black/10 hover:bg-black/10 text-black/60'}`}
            >
              <RotateCcw size={10} />
              <span className="text-[8px] uppercase tracking-[0.2em] font-bold">Volver al Menú</span>
            </button>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-2"
          >
            <img 
              src="./FondoYmas/LOGOMARVELRIVALS.png" 
              alt="Marvel Rivals Logo" 
              className="h-16 md:h-20 mx-auto object-contain drop-shadow-[0_0_20px_rgba(220,38,38,0.2)]"
              referrerPolicy="no-referrer"
            />
            <div className="text-red-600 font-black uppercase italic text-sm mt-1">
              {mode === 'single' ? 'Draft' : 'Versus'}
            </div>
          </motion.div>
          <p className={`${theme === 'dark' ? 'text-white/40' : 'text-black/40'} text-[10px] max-w-md mx-auto font-medium`}>
            {mode === 'single' ? 'Asignación para un equipo de 6.' : mode === 'double' ? 'Asignación para dos equipos (12 jugadores).' : 'Modos especiales y divertidos.'}
          </p>

          {mode === 'party' && !isDrafting && (
            <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
              {[
                { id: 'allSame', label: 'Todos el mismo', icon: <Users size={14} /> },
                { id: 'allVanguard', label: 'Solo Tanques', icon: <RoleIcon role="Vanguard" size={14} /> },
                { id: 'allDuelist', label: 'Solo Daño', icon: <RoleIcon role="Duelist" size={14} /> },
                { id: 'allStrategist', label: 'Solo Support', icon: <RoleIcon role="Strategist" size={14} /> },
                { id: 'random', label: 'Aleatorio Total', icon: <Sparkles size={14} /> },
              ].map((pMode) => (
                <button
                  key={pMode.id}
                  onClick={() => setPartyMode(pMode.id as any)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${partyMode === pMode.id ? 'bg-yellow-600 border-yellow-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
                >
                  {pMode.icon}
                  {pMode.label}
                </button>
              ))}
            </div>
          )}

          {!isDrafting && (
            <div className="mt-4 flex flex-col items-center gap-4">
              <div className="bg-white/5 border border-white/10 p-0.5 rounded-xl flex items-center gap-1">
                <button
                  onClick={() => setUseNames(true)}
                  className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${useNames ? 'bg-red-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                >
                  Nombres ON
                </button>
                <button
                  onClick={() => setUseNames(false)}
                  className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${!useNames ? 'bg-red-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
                >
                  Nombres OFF
                </button>
              </div>

              {useNames && (
                <div className="flex flex-col gap-2 w-full max-w-md">
                  <div className="flex gap-2 justify-center">
                    {mode === 'single' ? (
                      <button
                        onClick={() => handleClipboardPaste()}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest"
                      >
                        <ClipboardPaste size={14} />
                        Portapapeles
                      </button>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 w-full">
                        <div className="flex flex-col gap-2">
                          <p className="text-[8px] font-black uppercase tracking-widest text-red-500/60 text-center">Team 1</p>
                          <button
                            onClick={() => handleClipboardPaste(1)}
                            className="flex items-center justify-center gap-1 px-2 py-2 rounded-xl bg-red-600/10 border border-red-500/20 hover:bg-red-600/20 transition-all text-[9px] font-black uppercase tracking-widest text-red-500"
                          >
                            <ClipboardPaste size={10} />
                            Pegar Nombres
                          </button>
                        </div>
                        <div className="flex flex-col gap-2">
                          <p className="text-[8px] font-black uppercase tracking-widest text-blue-500/60 text-center">Team 2</p>
                          <button
                            onClick={() => handleClipboardPaste(2)}
                            className="flex items-center justify-center gap-1 px-2 py-2 rounded-xl bg-blue-600/10 border border-blue-500/20 hover:bg-blue-600/20 transition-all text-[9px] font-black uppercase tracking-widest text-blue-500"
                          >
                            <ClipboardPaste size={10} />
                            Pegar Nombres
                          </button>
                        </div>

                        {/* Option for Both Teams */}
                        <div className="col-span-full mt-1">
                          <button
                            onClick={() => handleClipboardPaste('both')}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-purple-600/10 border border-purple-500/20 hover:bg-purple-600/20 transition-all text-[10px] font-black uppercase tracking-widest text-purple-500"
                          >
                            <ClipboardPaste size={16} />
                            Pegar Ambos Equipos
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </header>

        {!isDrafting ? (
          mode === 'party' && partyMode === 'allSame' ? (
            <motion.section
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-4xl mx-auto text-center py-20 px-8 bg-white/[0.02] border border-white/5 rounded-[3rem] backdrop-blur-md"
            >
              <div className="w-24 h-24 rounded-3xl bg-yellow-600/20 flex items-center justify-center mx-auto mb-8 border border-yellow-500/30">
                <Users size={48} className="text-yellow-500" />
              </div>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4">Modo Todos el Mismo</h2>
              <p className="text-white/40 text-lg max-w-lg mx-auto mb-10 font-medium">
                En este modo, todos los jugadores recibirán el mismo héroe aleatorio. ¡No es necesario configurar nombres!
              </p>
              <motion.button
                onClick={startDraft}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group relative px-12 py-5 bg-yellow-600 rounded-full overflow-hidden transition-all shadow-[0_0_40px_rgba(202,138,4,0.3)]"
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-600 to-yellow-400 opacity-50"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                />
                <div className="absolute inset-0 bg-yellow-600 group-hover:bg-yellow-500 transition-colors" />
                <div className="relative flex items-center gap-4">
                  <Play size={24} fill="currentColor" />
                  <span className="text-2xl font-black uppercase italic tracking-tight">¡Sortear Héroe Común!</span>
                </div>
              </motion.button>
            </motion.section>
          ) : (
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
            >
            {/* Recent Players Panel */}
            {[...DEFAULT_NAMES, ...RECENT_PLAYERS].length > 0 && (
            <div className="col-span-full mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Users size={14} className="text-red-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Jugadores Recientes</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[...DEFAULT_NAMES, ...RECENT_PLAYERS].map((name) => {
                  const isSelected = players.some(p => p.name === name);
                  return (
                    <button
                      key={name}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('playerName', name);
                        e.dataTransfer.setData('sourceIdx', 'recent');
                      }}
                      onClick={() => {
                        if (isSelected) {
                          // Remove player
                          const playerIdx = players.findIndex(p => p.name === name);
                          handlePlayerChange(playerIdx, '');
                        } else {
                          // Add player to first empty slot
                          const emptyIndex = players.findIndex(p => p.name.trim() === '');
                          if (emptyIndex !== -1) {
                            handlePlayerChange(emptyIndex, name);
                          }
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg border transition-all text-[10px] font-bold uppercase tracking-wider ${
                        isSelected 
                          ? 'bg-red-600/20 border-red-500/50 text-white shadow-[0_0_10px_rgba(220,38,38,0.2)]' 
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>
            )}

            {useNames ? (
              <div className="col-span-full space-y-12" ref={containerRef}>
                <div className={`grid gap-8 ${mode === 'double' ? 'grid-cols-1 lg:grid-cols-2' : 'max-w-xl mx-auto'}`}>
                  {/* Team 1 Column */}
                  <div className="space-y-4">
                    {mode === 'double' && (
                      <div className="flex items-center justify-between px-4 py-3 bg-red-600/10 border border-red-500/20 rounded-2xl mb-2">
                        <div className="flex items-center gap-3">
                          <Users size={18} className="text-red-500" />
                          <span className="text-xs font-black uppercase tracking-[0.3em] text-red-500">Equipo 1</span>
                        </div>
                        <div className="flex items-center gap-3 opacity-60">
                          <div className="flex items-center gap-1">
                            <RoleIcon role="Vanguard" size={16} />
                            <span className="text-[8px] font-bold text-blue-500/80">x{players.slice(0, playersPerTeam).filter(p => p.role === 'Vanguard').length}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <RoleIcon role="Duelist" size={16} />
                            <span className="text-[8px] font-bold text-red-500/80">x{players.slice(0, playersPerTeam).filter(p => p.role === 'Duelist').length}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <RoleIcon role="Strategist" size={16} />
                            <span className="text-[8px] font-bold text-green-500/80">x{players.slice(0, playersPerTeam).filter(p => p.role === 'Strategist').length}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <Reorder.Group 
                      axis="y" 
                      values={players.slice(0, playersPerTeam)} 
                      onReorder={(newOrder) => {
                        const otherTeam = players.slice(playersPerTeam);
                        setPlayers([...newOrder, ...otherTeam]);
                      }}
                      className="space-y-2"
                    >
                      {players.slice(0, playersPerTeam).map((player, idx) => (
                        <PlayerSlot
                          key={player.id}
                          player={player}
                          idx={idx}
                          displayNumber={idx + 1}
                          accent="red"
                          showRoleButtons={mode !== 'party'}
                          isDragOver={dragOverIndex === idx}
                          setDragOverIndex={setDragOverIndex}
                          onNameChange={handlePlayerChange}
                          onRoleChange={handleRoleChange}
                          trashRef={trashRef}
                          containerRef={containerRef}
                        />
                      ))}
                    </Reorder.Group>
                  </div>

                  {/* Team 2 Column */}
                  {mode === 'double' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-4 py-3 bg-blue-600/10 border border-blue-500/20 rounded-2xl mb-2">
                        <div className="flex items-center gap-3">
                          <Users size={18} className="text-blue-500" />
                          <span className="text-xs font-black uppercase tracking-[0.3em] text-blue-500">Equipo 2</span>
                        </div>
                        <div className="flex items-center gap-3 opacity-60">
                          <div className="flex items-center gap-1">
                            <RoleIcon role="Vanguard" size={16} />
                            <span className="text-[8px] font-bold text-blue-500/80">x{players.slice(playersPerTeam).filter(p => p.role === 'Vanguard').length}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <RoleIcon role="Duelist" size={16} />
                            <span className="text-[8px] font-bold text-red-500/80">x{players.slice(playersPerTeam).filter(p => p.role === 'Duelist').length}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <RoleIcon role="Strategist" size={16} />
                            <span className="text-[8px] font-bold text-green-500/80">x{players.slice(playersPerTeam).filter(p => p.role === 'Strategist').length}</span>
                          </div>
                        </div>
                      </div>
                      <Reorder.Group 
                        axis="y" 
                        values={players.slice(playersPerTeam)} 
                        onReorder={(newOrder) => {
                          const team1 = players.slice(0, playersPerTeam);
                          setPlayers([...team1, ...newOrder]);
                        }}
                        className="space-y-2"
                      >
                        {players.slice(playersPerTeam).map((player, i) => (
                          <PlayerSlot
                            key={player.id}
                            player={player}
                            idx={i + playersPerTeam}
                            displayNumber={i + 1}
                            accent="blue"
                            showRoleButtons={true}
                            isDragOver={dragOverIndex === i + playersPerTeam}
                            setDragOverIndex={setDragOverIndex}
                            onNameChange={handlePlayerChange}
                            onRoleChange={handleRoleChange}
                            trashRef={trashRef}
                            containerRef={containerRef}
                          />
                        ))}
                      </Reorder.Group>
                    </div>
                  )}
                </div>

                {/* Discard Zone */}
                <motion.div 
                  ref={trashRef}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsOverTrash(true);
                  }}
                  onDragLeave={() => setIsOverTrash(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsOverTrash(false);
                    const sourceIdx = e.dataTransfer.getData('sourceIdx');
                    if (sourceIdx && sourceIdx !== 'recent') {
                      handlePlayerChange(parseInt(sourceIdx), '');
                    }
                  }}
                  className={`max-w-md mx-auto p-8 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center gap-3 transition-all duration-300 ${
                    isOverTrash 
                      ? 'bg-red-600/20 border-red-500 scale-[1.05] shadow-[0_0_30px_rgba(220,38,38,0.2)]' 
                      : 'border-white/5 bg-white/5 opacity-40 hover:opacity-100 hover:border-red-500/30 hover:scale-[1.02]'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isOverTrash ? 'bg-red-500 text-white shadow-lg' : 'bg-white/5 text-white/20'
                  }`}>
                    <Trash2 size={24} />
                  </div>
                  <p className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${
                    isOverTrash ? 'text-red-500' : 'text-white/20'
                  }`}>
                    Zona de Descarte
                  </p>
                  <p className={`text-[8px] font-bold uppercase tracking-widest text-center transition-colors ${
                    isOverTrash ? 'text-red-400/60' : 'text-white/10'
                  }`}>
                    Arrastra una tarjeta aquí para borrarla
                  </p>
                </motion.div>
              </div>
            ) : (
              <div className="col-span-full text-center py-12 bg-white/5 border border-dashed border-white/10 rounded-3xl">
                <Users className="mx-auto text-white/20 mb-4" size={48} />
                <h3 className="text-xl font-black uppercase italic text-white/60">Modo Solo Héroes</h3>
                <p className="text-white/30 text-sm mt-2">Los nombres están desactivados. Se asignarán roles directamente.</p>
              </div>
            )}

            <div className="col-span-full flex justify-center mt-8">
              <button
                onClick={startDraft}
                className="group relative px-10 py-4 bg-red-600 rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(220,38,38,0.3)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center gap-3">
                  <Play size={20} fill="currentColor" />
                  <span className="text-xl font-black uppercase italic tracking-tight">Iniciar Sorteo</span>
                </div>
              </button>
            </div>
          </motion.section>
        )
      ) : (
          <section className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold uppercase tracking-widest flex items-center gap-2">
                <RotateCcw className="animate-spin-slow text-red-500" size={18} />
                Draft en progreso...
              </h2>
              <div className="flex gap-3">
                <button 
                  onClick={reset}
                  className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-xs font-bold uppercase tracking-widest"
                >
                  Reiniciar
                </button>
              </div>
            </div>

            {mode === 'double' ? (
              isShuffleOnly ? (
                <div className="max-w-4xl mx-auto">
                  <div className="grid grid-cols-[1fr_auto_1fr] gap-8 items-center">
                    {/* Team 1 List */}
                    <div className="space-y-3">
                      <AnimatePresence mode="popLayout">
                        {assignments.filter(a => a.team === 1).map((assignment, idx) => (
                          <motion.div
                            key={assignment.playerName}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-red-600/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-4"
                          >
                            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-black italic text-xs shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                              {idx + 1}
                            </div>
                            <span className="text-xl font-black uppercase italic text-red-500 tracking-tight truncate">
                              {assignment.playerName}
                            </span>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* VS Divider */}
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-px h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                      <span className="text-5xl font-black italic uppercase tracking-tighter text-white/10">VS</span>
                      <div className="w-px h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                    </div>

                    {/* Team 2 List */}
                    <div className="space-y-3 text-right">
                      <AnimatePresence mode="popLayout">
                        {assignments.filter(a => a.team === 2).map((assignment, idx) => (
                          <motion.div
                            key={assignment.playerName}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-blue-600/10 border border-blue-500/20 rounded-xl p-4 flex flex-row-reverse items-center gap-4"
                          >
                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-black italic text-xs shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                              {idx + 1}
                            </div>
                            <span className="text-xl font-black uppercase italic text-blue-500 tracking-tight truncate">
                              {assignment.playerName}
                            </span>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
                  {/* VS Divider Bar */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 hidden lg:flex flex-col items-center gap-2 opacity-10">
                    <div className="w-0.5 h-full bg-gradient-to-b from-transparent via-white to-transparent" />
                    <span className="text-4xl font-black italic uppercase tracking-tighter text-white/20">VS</span>
                    <div className="w-0.5 h-full bg-gradient-to-b from-transparent via-white to-transparent" />
                  </div>

                  {/* Team 1 */}
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-2 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
                      <h3 className="text-2xl font-black uppercase italic text-red-500 tracking-tighter">Equipo 1</h3>
                      <div className="flex-grow h-0.5 bg-gradient-to-r from-red-600/50 to-transparent rounded-full" />
                    </div>
                    <div className={`grid gap-4 ${playersPerTeam === 2 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                      <AnimatePresence mode="popLayout">
                        {assignments.filter(a => a.team === 1).map((assignment, idx) => (
                          <HeroRevealCard 
                            key={`${assignment.playerName}-${idx}`}
                            assignment={assignment}
                            allHeroes={HEROES}
                            index={idx}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Team 2 */}
                  <div className="space-y-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-2 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
                      <h3 className="text-2xl font-black uppercase italic text-blue-500 tracking-tighter">Equipo 2</h3>
                      <div className="flex-grow h-0.5 bg-gradient-to-r from-blue-600/50 to-transparent rounded-full" />
                    </div>
                    <div className={`grid gap-4 ${playersPerTeam === 2 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                      <AnimatePresence mode="popLayout">
                        {assignments.filter(a => a.team === 2).map((assignment, idx) => (
                          <HeroRevealCard 
                            key={`${assignment.playerName}-${idx}`}
                            assignment={assignment}
                            allHeroes={HEROES}
                            index={idx}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              )
            ) : (
              mode === 'party' && partyMode === 'allSame' ? (
                <div className="flex justify-center items-center py-12">
                  <AnimatePresence mode="wait">
                    {assignments.length > 0 ? (
                      <div className="w-full max-w-sm">
                        <HeroRevealCard 
                          key="all-same-hero"
                          assignment={assignments[0]}
                          allHeroes={HEROES}
                          index={0}
                          hidePlayerName={true}
                          isSuspense={true}
                        />
                      </div>
                    ) : (
                      <div className="h-[220px] w-full max-w-sm rounded-xl border border-dashed border-white/10 flex items-center justify-center bg-white/[0.02]">
                        <div className="text-center space-y-2">
                          <div className="w-8 h-8 rounded-full border-2 border-white/5 flex items-center justify-center mx-auto animate-pulse">
                            <Users className="text-white/10" size={16} />
                          </div>
                          <p className="text-[7px] font-bold uppercase tracking-[0.4em] text-white/10">Esperando...</p>
                        </div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  <AnimatePresence mode="popLayout">
                    {assignments.map((assignment, idx) => (
                      <HeroRevealCard 
                        key={`${assignment.playerName}-${idx}`}
                        assignment={assignment}
                        allHeroes={HEROES}
                        index={idx}
                      />
                    ))}
                  </AnimatePresence>

                  {/* Placeholders for remaining steps */}
                  {Array.from({ length: Math.max(0, playerCount - assignments.length) }).map((_, idx) => (
                    <div key={`placeholder-${idx}`} className="h-[220px] rounded-xl border border-dashed border-white/10 flex items-center justify-center bg-white/[0.02]">
                      <div className="text-center space-y-2">
                        <div className="w-8 h-8 rounded-full border-2 border-white/5 flex items-center justify-center mx-auto animate-pulse">
                          <Users className="text-white/10" size={16} />
                        </div>
                        <p className="text-[7px] font-bold uppercase tracking-[0.4em] text-white/10">Esperando...</p>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {assignments.length === fullDraftResults.length && fullDraftResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-6 pt-12"
              >
                <div className="flex items-center gap-4 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl">
                  <Trophy className="text-yellow-400" size={32} />
                  <div>
                    <h5 className="text-xl font-black uppercase italic">Sorteo Completado</h5>
                    <p className="text-white/40 text-sm">¡Que gane el mejor equipo!</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      const text = assignments.map(a => {
                        if (a.isShuffleOnly) {
                          return `${a.playerName}: Equipo ${a.team}`;
                        }
                        return `${a.playerName} Juega como ${a.hero?.name}`;
                      }).join('\n');
                      navigator.clipboard.writeText(text)
                        .then(() => showToast('Resultados copiados al portapapeles'))
                        .catch(() => showToast('No se pudo copiar al portapapeles'));
                    }}
                    className="flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors uppercase tracking-widest text-[10px] font-black"
                  >
                    <PlusCircle size={14} />
                    Copiar Resultados
                  </button>
                  <button 
                    onClick={reset}
                    className="flex items-center gap-2 text-white/40 hover:text-white transition-colors uppercase tracking-widest text-[10px] font-black"
                  >
                    <RotateCcw size={14} />
                    Nuevo Sorteo
                  </button>
                </div>
              </motion.div>
            )}
          </section>
        )}
      </main>

      <footer className="py-12 text-center border-t border-white/5 mt-24 relative z-10">
        <div className="flex flex-col items-center gap-6">
          <img 
            src="./FondoYmas/MarcasDesarrolladoras.png" 
            alt="Developer Brands" 
            className={`h-12 md:h-16 object-contain opacity-60 hover:opacity-100 transition-opacity ${theme === 'light' ? 'invert' : ''}`}
            referrerPolicy="no-referrer"
          />
          <p className={`text-[10px] font-bold uppercase tracking-[0.5em] ${theme === 'dark' ? 'text-white/20' : 'text-black/20'}`}>
            Rivalsito • © Renzuky Apps
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-8 left-1/2 z-[110] px-6 py-3 rounded-full bg-[#151515] border border-white/10 shadow-2xl text-xs font-black uppercase tracking-widest text-white"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paste Modal */}
      <AnimatePresence>
        {isPasteModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPasteModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#151515] border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-red-600/20 flex items-center justify-center">
                  <ClipboardPaste size={24} className="text-red-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter">Pegar Nombres</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                    Pega los nombres {pasteTeamTarget === 'both' ? 'para AMBOS equipos' : pasteTeamTarget ? `del Equipo ${pasteTeamTarget}` : ''} aquí
                  </p>
                </div>
              </div>

              <div className="relative mb-6">
                <textarea
                  autoFocus
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder="Pega aquí los nombres separados por líneas, comas o punto y coma..."
                  className="w-full h-48 bg-black/40 border border-white/5 rounded-2xl p-4 text-white placeholder:text-white/10 focus:outline-none focus:border-red-600/50 transition-colors resize-none"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setIsPasteModalOpen(false)}
                  className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs font-black uppercase tracking-widest"
                >
                  Cancelar
                </button>
                <button
                  onClick={processPaste}
                  className="flex-1 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 transition-all text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                >
                  Procesar Nombres
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
