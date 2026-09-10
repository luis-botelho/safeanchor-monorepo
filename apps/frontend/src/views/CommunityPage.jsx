import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getPosts,
  getTopicList,
  getAuthorsFor,
  addPost,
  addComment,
  isSaved,
  toggleSaved,
  isFollowing,
  toggleFollow,
} from "../services/communityService";
import { useAuth } from "../context/AuthContext";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import Avatar from "../components/Avatar";
import Icon from "../components/Icon";

const COMPOSE_TAGS = ["Dica", "Pergunta", "Discussão", "Evento", "Viagens", "Experiência"];

export default function CommunityPage() {
  const { user } = useAuth();

  const [topics, setTopics] = useState([]);
  const [topic, setTopic] = useState("Todas");
  const [posts, setPosts] = useState([]);
  const [liked, setLiked] = useState([]);
  const [saved, setSaved] = useState([]);
  const [following, setFollowing] = useState([]);
  const [commentDrafts, setCommentDrafts] = useState({});

  const [composing, setComposing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("Dica");

  useEffect(() => {
    setTopics(getTopicList());
  }, []);

  useEffect(() => {
    getPosts(topic).then((data) => setPosts(getAuthorsFor(data)));
  }, [topic]);

  function toggleLike(postId) {
    setLiked((current) =>
      current.includes(postId)
        ? current.filter((id) => id !== postId)
        : [...current, postId],
    );
  }

  function handleSave(postId) {
    toggleSaved(postId);
    setSaved((current) =>
      current.includes(postId)
        ? current.filter((id) => id !== postId)
        : [...current, postId],
    );
  }

  function handleFollow(authorKey) {
    toggleFollow(authorKey);
    setFollowing((current) =>
      current.includes(authorKey)
        ? current.filter((id) => id !== authorKey)
        : [...current, authorKey],
    );
  }

  function updateDraft(postId, value) {
    setCommentDrafts((current) => ({ ...current, [postId]: value }));
  }

  async function submitComment(postId) {
    const text = (commentDrafts[postId] || "").trim();
    if (text.length < 2) return;

    addComment(postId, text);
    updateDraft(postId, "");
    setPosts(getAuthorsFor(await getPosts(topic)));
  }

  async function handleCompose(event) {
    event.preventDefault();

    if (title.trim().length < 3 || content.trim().length < 2) {
      return;
    }

    addPost({ title, content, tag });
    setComposing(false);
    setTitle("");
    setContent("");
    setTopic("Todas");
    setPosts(getAuthorsFor(await getPosts("Todas")));
  }

  return (
    <div>
      <PageHeader
        eyebrow="Comunidade"
        title="Comunidade SafeAnchor"
        subtitle="Compartilhe dicas, visões, viagens e conecte-se com outros proprietários, prestadores e marinas."
        actions={
          <button className="btn btn--primary" onClick={() => setComposing((value) => !value)}>
            <Icon name="plus" size={17} />
            Nova publicação
          </button>
        }
      />

      {composing && (
        <form className="card card--padding" style={{ marginBottom: 18 }} onSubmit={handleCompose}>
          <div className="form-card__title">Nova publicação</div>
          <div className="grid grid--2">
            <div className="field">
              <label className="field__label" htmlFor="post-tag">
                Tópico
              </label>
              <select
                id="post-tag"
                className="select"
                value={tag}
                onChange={(event) => setTag(event.target.value)}
              >
                {COMPOSE_TAGS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label className="field__label" htmlFor="post-title">
                Título
              </label>
              <input
                id="post-title"
                className="input"
                type="text"
                placeholder="Ex.: Checklist antes da travessia"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
            <div className="field" style={{ gridColumn: "1 / -1" }}>
              <label className="field__label" htmlFor="post-content">
                Conteúdo
              </label>
              <textarea
                id="post-content"
                className="textarea"
                placeholder="Compartilhe sua dica, viagem ou experiência..."
                value={content}
                onChange={(event) => setContent(event.target.value)}
              />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn--ghost" type="button" onClick={() => setComposing(false)}>
              Cancelar
            </button>
            <button className="btn btn--primary" type="submit">
              Publicar
            </button>
          </div>
        </form>
      )}

      <div className="filters">
        <div className="field" style={{ marginBottom: 12 }}>
          <label className="field__label" htmlFor="post-topic">
            Tópico
          </label>
          <select
            id="post-topic"
            className="select"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
          >
            {topics.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="tags">
          {topics
            .filter((item) => item !== "Todas")
            .map((item) => (
              <button
                type="button"
                className={`tag ${topic === item ? "tag--active" : ""}`}
                key={item}
                onClick={() => setTopic(item)}
              >
                {item}
              </button>
            ))}
        </div>
      </div>

      <section className="card">
        {posts.length === 0 ? (
          <div className="card--padding">
            <p className="page-header__subtitle">Nenhuma publicação neste tópico.</p>
          </div>
        ) : (
          posts.map((post) => {
            const isLiked = liked.includes(post.id);
            const isSavedPost = isSaved(post.id) || saved.includes(post.id);
            const isFollowingAuthor = isFollowing(post.authorKey) || following.includes(post.authorKey);

            return (
              <article className="post" key={post.id}>
                <div className="post__header">
                  <Avatar initials={post.author.initials} size={38} />
                  <div>
                    <p className="post__author">{post.author.name}</p>
                    <p className="post__author-role">
                      {post.author.role}
                      {isFollowingAuthor && (
                        <StatusBadge label="Seguindo" tone="accent" />
                      )}
                    </p>
                  </div>
                  <span className="post__time">{post.time}</span>
                </div>

                <div className="post__title">
                  {post.title} <StatusBadge label={post.tag} tone="accent" />
                </div>
                <p className="post__content">{post.content}</p>

                {post.tripId && (
                  <Link className="inline-link" to={`/trips/${post.tripId}`}>
                    <Icon name="locationPin" size={14} />
                    Ver plano da viagem
                  </Link>
                )}

                <div className="post__actions">
                  <button
                    className={`post__action ${isLiked ? "post__action--active" : ""}`}
                    onClick={() => toggleLike(post.id)}
                  >
                    <Icon name="check" size={15} />
                    {isLiked ? `Apoiado (${post.likes + 1})` : `Apoiar (${post.likes})`}
                  </button>
                  <button
                    type="button"
                    className={`post__action ${isSavedPost ? "post__action--active" : ""}`}
                    onClick={() => handleSave(post.id)}
                  >
                    <Icon name="star" size={15} />
                    {isSavedPost ? "Salvo" : "Salvar"}
                  </button>
                  <button
                    type="button"
                    className={`post__action ${isFollowingAuthor ? "post__action--active" : ""}`}
                    onClick={() => handleFollow(post.authorKey)}
                  >
                    <Icon name="users" size={15} />
                    {isFollowingAuthor ? "Seguindo" : "Seguir autor"}
                  </button>
                </div>

                {post.comments.length > 0 && (
                  <div className="post__comments">
                    {post.comments.map((comment) => (
                      <p className="post__comment" key={`${comment.text}-${comment.author.name}`}>
                        <span className="post__comment-author">{comment.author.name}:</span>{" "}
                        <span className="post__comment-text">{comment.text}</span>
                      </p>
                    ))}
                  </div>
                )}

                <div className="post__comment-box">
                  <input
                    className="input"
                    type="text"
                    placeholder="Comentar..."
                    value={commentDrafts[post.id] || ""}
                    onChange={(event) => updateDraft(post.id, event.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn--primary btn--sm"
                    onClick={() => submitComment(post.id)}
                  >
                    Comentar
                  </button>
                </div>
              </article>
            );
          })
        )}
      </section>

      <p className="page-header__subtitle" style={{ margin: "14px 0 0", fontSize: 12 }}>
        Publicado por {user?.fullName || user?.name}. Publicações a partir de hoje ficam
        salvas apenas na sessão da demonstração.
      </p>
    </div>
  );
}