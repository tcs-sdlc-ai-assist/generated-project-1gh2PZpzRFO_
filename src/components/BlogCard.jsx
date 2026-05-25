import { Link } from 'react-router-dom';
import { getAvatar } from './Avatar';

const ACCENT_BORDERS = [
  'border-indigo-500',
  'border-violet-500',
  'border-pink-500',
  'border-teal-500',
];

/**
 * Formats a date string into a human-readable "MMM DD, YYYY" format.
 * @param {string} dateStr - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Truncates content to a maximum of 120 characters, appending '...' if needed.
 * @param {string} content - The full post content
 * @returns {string} Truncated excerpt
 */
function getExcerpt(content) {
  if (content.length > 120) {
    return content.substring(0, 120) + '...';
  }
  return content;
}

/**
 * BlogCard — A reusable blog post preview card for WriteSpace.
 *
 * @param {Object} props
 * @param {Object} props.post - The post object with id, title, content, createdAt, authorId, authorName
 * @param {number} props.index - Cycling accent border color index
 * @param {boolean} props.showEdit - Whether to show the edit icon button
 */
export default function BlogCard({ post, index = 0, showEdit = false }) {
  const accentBorder = ACCENT_BORDERS[index % 4];
  const excerpt = getExcerpt(post.content);
  const formattedDate = formatDate(post.createdAt);

  return (
    <article className="relative rounded-xl bg-white p-6 md:p-8 ring-1 ring-stone-200 hover:ring-stone-300 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
      {/* Accent top bar */}
      <div
        className={`h-1 -mx-6 -mt-6 md:-mx-8 md:-mt-8 mb-4 rounded-t-xl ${accentBorder} border-t-4`}
        aria-hidden="true"
      />

      {/* Edit button — absolutely positioned */}
      {showEdit && (
        <Link
          to={`/edit/${post.id}`}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-4 right-4 p-2 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          aria-label="Edit post"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
          </svg>
        </Link>
      )}

      {/* Entire card wrapped in Link */}
      <Link to={`/blog/${post.id}`} className="block">
        {/* Title */}
        <h3 className="text-xl font-medium text-stone-900 line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-base leading-relaxed text-stone-600 mt-2 line-clamp-3">
          {excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
          {/* Left: avatar + author name */}
          <div className="flex items-center gap-2.5">
            {getAvatar(post.authorId, 'sm')}
            <span className="text-sm text-stone-500">{post.authorName}</span>
          </div>

          {/* Right: formatted date */}
          <time
            dateTime={post.createdAt}
            className="text-sm text-stone-400 tabular-nums"
          >
            {formattedDate}
          </time>
        </div>
      </Link>
    </article>
  );
}