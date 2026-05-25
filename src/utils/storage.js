// WARNING: Plain-text storage — MVP only. Do not use real passwords.

// ---------------------------------------------------------------------------
// localStorage CRUD helpers for WriteSpace
// ---------------------------------------------------------------------------

const POSTS_KEY = 'writespace_posts';
const USERS_KEY = 'writespace_users';

// ---------------------------------------------------------------------------
// Posts
// ---------------------------------------------------------------------------

/**
 * Reads 'writespace_posts' from localStorage.
 * @returns {Array} Parsed array of posts, or [] on failure.
 */
export function getPosts() {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    if (raw === null) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Writes the given array to 'writespace_posts' in localStorage.
 * @param {Array} posts
 */
export function savePosts(posts) {
  try {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  } catch (err) {
    console.error('Failed to save posts to localStorage:', err);
  }
}

/**
 * Convenience: gets existing posts, pushes a new post, and saves.
 * Generates `id` via crypto.randomUUID() and sets `createdAt` to
 * new Date().toISOString() if not already present on the incoming object.
 * @param {Object} post
 * @returns {Object} The saved post (with id + createdAt).
 */
export function savePost(post) {
  const posts = getPosts();

  const newPost = {
    ...post,
    id: post.id ?? crypto.randomUUID(),
    createdAt: post.createdAt ?? new Date().toISOString(),
  };

  posts.push(newPost);
  savePosts(posts);
  return newPost;
}

/**
 * Finds a post by id, merges the supplied updates, and saves.
 * @param {string} id
 * @param {Object} updates
 * @returns {Object|null} The updated post, or null if not found.
 */
export function updatePost(id, updates) {
  const posts = getPosts();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return null;

  posts[index] = { ...posts[index], ...updates, id }; // id is immutable
  savePosts(posts);
  return posts[index];
}

/**
 * Removes a post by id from the array and saves.
 * @param {string} id
 * @returns {boolean} true if deleted, false if not found.
 */
export function deletePost(id) {
  const posts = getPosts();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return false;

  posts.splice(index, 1);
  savePosts(posts);
  return true;
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

/**
 * Reads 'writespace_users' from localStorage.
 * @returns {Array} Parsed array of users, or [] on failure.
 */
export function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw === null) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Writes the given array to 'writespace_users' in localStorage.
 * @param {Array} users
 */
export function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users to localStorage:', err);
  }
}

/**
 * Convenience: gets existing users, pushes a new user, and saves.
 * Generates `id` via crypto.randomUUID() and sets `createdAt` to
 * new Date().toISOString() if not already present on the incoming object.
 * @param {Object} user
 * @returns {Object} The saved user (with id + createdAt).
 */
export function saveUser(user) {
  const users = getUsers();

  const newUser = {
    ...user,
    id: user.id ?? crypto.randomUUID(),
    createdAt: user.createdAt ?? new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);
  return newUser;
}

/**
 * Removes a user by id from the array and saves.
 * @param {string} id
 * @returns {boolean} true if deleted, false if not found.
 */
export function deleteUser(id) {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return false;

  users.splice(index, 1);
  saveUsers(users);
  return true;
}