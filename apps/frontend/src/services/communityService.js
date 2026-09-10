import { posts, communityTopics } from "../mock/community";
import { communityAuthors, demoProfile } from "../mock/users";

function resolveAuthor(authorKey) {
  if (authorKey === "luis") {
    return {
      name: demoProfile.name,
      initials: demoProfile.initials,
      role: demoProfile.role,
    };
  }

  return communityAuthors[authorKey] || {
    name: "Membro",
    initials: "M",
    role: "Comunidade",
  };
}

export async function getPosts(topic = "Todas") {
  if (topic === "Todas") {
    return posts;
  }

  return posts.filter((post) => post.tag === topic);
}

export async function getPostById(id) {
  return posts.find((post) => post.id === id) || null;
}

export function getTopicList() {
  return communityTopics;
}

export function getAuthorsFor(postsList) {
  return postsList.map((post) => ({
    ...post,
    author: resolveAuthor(post.authorKey),
    comments: (post.comments || []).map((comment) => ({
      ...comment,
      author: resolveAuthor(comment.authorKey),
    })),
  }));
}

export function addPost({ title, content, tag }) {
  const newPost = {
    id: `post-${Date.now()}`,
    authorKey: "luis",
    time: "agora",
    tag,
    title,
    content,
    likes: 0,
    comments: [],
  };

  posts.unshift(newPost);

  return newPost;
}

export function addTripPost(trip) {
  const firstStop = trip.stops?.[0];
  const newPost = {
    id: `post-${Date.now()}`,
    authorKey: "luis",
    time: "agora",
    tag: "Viagens",
    title: trip.title,
    content: `Nova viagem planejada: ${trip.routeName} com ${trip.totalDistanceNm} nm e paradas em ${firstStop || "destinos da Costa Verde"}. Veja o itinerário completo e inspire-se.`,
    likes: 0,
    comments: [],
    tripId: trip.id,
  };

  posts.unshift(newPost);

  return newPost;
}

export function addComment(postId, text) {
  const post = posts.find((item) => item.id === postId);
  if (!post) return null;

  const comment = {
    authorKey: "luis",
    text,
    author: {
      name: demoProfile.name,
      initials: demoProfile.initials,
      role: demoProfile.role,
    },
    time: "agora",
  };

  post.comments = post.comments || [];
  post.comments.unshift(comment);

  return comment;
}

const savedIds = new Set();
const followedAuthors = new Set();

export function isSaved(postId) {
  return savedIds.has(postId);
}

export function toggleSaved(postId) {
  if (savedIds.has(postId)) {
    savedIds.delete(postId);
    return false;
  }
  savedIds.add(postId);
  return true;
}

export function isFollowing(authorKey) {
  return followedAuthors.has(authorKey);
}

export function toggleFollow(authorKey) {
  if (followedAuthors.has(authorKey)) {
    followedAuthors.delete(authorKey);
    return false;
  }
  followedAuthors.add(authorKey);
  return true;
}