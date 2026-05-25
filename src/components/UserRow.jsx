import { getAvatar } from './Avatar';

/**
 * UserRow — a responsive user table row / stacked card for WriteSpace's
 * User Management page.
 *
 * @param {{
 *   user: { id: string, displayName: string, username: string, role: string, createdAt: string },
 *   isCurrentUser: boolean,
 *   isHardcodedAdmin: boolean,
 *   onDelete: (id: string) => void,
 * }} props
 */
export default function UserRow({ user, isCurrentUser, isHardcodedAdmin, onDelete }) {
  const formattedDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const roleBadge =
    user.role === 'admin' ? (
      <span className="inline-block rounded-full bg-violet-100 px-3 py-0.5 text-sm font-medium text-violet-700 ring-1 ring-violet-300">
        admin
      </span>
    ) : (
      <span className="inline-block rounded-full bg-indigo-100 px-3 py-0.5 text-sm font-medium text-indigo-700 ring-1 ring-indigo-300">
        user
      </span>
    );

  const isDeleteDisabled = isHardcodedAdmin || isCurrentUser;

  const deleteTitle = isHardcodedAdmin
    ? 'Default admin cannot be deleted.'
    : isCurrentUser
      ? 'You cannot delete your own account.'
      : undefined;

  const deleteButton = (
    <button
      onClick={() => onDelete(user.id)}
      disabled={isDeleteDisabled}
      title={deleteTitle}
      className={
        'rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1' +
        (isDeleteDisabled ? ' cursor-not-allowed opacity-50' : '')
      }
    >
      Delete
    </button>
  );

  return (
    <>
      {/* ── Desktop: table row ── */}
      <tr className="hidden border-b border-stone-100 transition-colors hover:bg-stone-50/60 md:table-row">
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            {getAvatar(user.role, 'sm')}
            <span className="font-medium text-stone-800">{user.displayName}</span>
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-stone-600">{user.username}</td>
        <td className="px-6 py-4">{roleBadge}</td>
        <td className="px-6 py-4 text-sm text-stone-500">{formattedDate}</td>
        <td className="px-6 py-4 text-right">{deleteButton}</td>
      </tr>

      {/* ── Mobile: stacked card ── */}
      <div className="block rounded-xl bg-white p-5 ring-1 ring-stone-200 md:hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {getAvatar(user.role, 'md')}
            <div>
              <p className="font-semibold text-stone-800">{user.displayName}</p>
              <p className="text-sm text-stone-500">{user.username}</p>
            </div>
          </div>
          {roleBadge}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3">
          <span className="text-xs text-stone-400">{formattedDate}</span>
          {deleteButton}
        </div>
      </div>
    </>
  );
}