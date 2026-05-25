const SIZE_CLASSES = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-2xl',
};

const ROLE_CONFIG = {
  admin: {
    emoji: '👑',
    bg: 'bg-violet-600',
    label: 'Admin avatar',
  },
  user: {
    emoji: '📖',
    bg: 'bg-indigo-500',
    label: 'User avatar',
  },
};

const FALLBACK_CONFIG = {
  emoji: '❓',
  bg: 'bg-slate-400',
  label: 'Unknown avatar',
};

/**
 * Returns a circular avatar <div> element for the given role and size.
 *
 * @param {'admin' | 'user' | string} role - The role to render an avatar for.
 * @param {'sm' | 'md' | 'lg'} [size='md'] - The size variant.
 * @returns {JSX.Element} A <div> avatar element.
 */
export function getAvatar(role, size = 'md') {
  const config = ROLE_CONFIG[role] ?? FALLBACK_CONFIG;
  const sizeClass = SIZE_CLASSES[size] ?? SIZE_CLASSES.md;

  return (
    <div
      className={`${sizeClass} ${config.bg} rounded-full flex items-center justify-center text-white font-semibold select-none`}
      aria-label={config.label}
    >
      <span className="leading-none">{config.emoji}</span>
    </div>
  );
}