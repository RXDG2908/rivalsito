import { useState } from 'react';
import type { Role } from '../types';

export const RoleIcon = ({ role, className = "", size = 30 }: { role: Role, className?: string, size?: number }) => {
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
