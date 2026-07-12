import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users } from 'lucide-react';
import type { Hero, PlayerAssignment } from '../types';
import { playRevealSound } from '../utils/audio';
import { getRoleColor } from '../utils/roles';
import { RoleIcon } from './RoleIcon';

export const HeroRevealCard: React.FC<{
  assignment: PlayerAssignment;
  allHeroes: Hero[];
  hidePlayerName?: boolean;
  isSuspense?: boolean;
}> = ({
  assignment,
  allHeroes,
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
