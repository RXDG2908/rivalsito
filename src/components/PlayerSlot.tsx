import React from 'react';
import { Reorder } from 'framer-motion';
import { GripVertical, Trash2, User } from 'lucide-react';
import type { Player, Role } from '../types';
import { RoleIcon } from './RoleIcon';

export const PlayerSlot: React.FC<{
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
