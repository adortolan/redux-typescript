import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectPosts } from "./postsSlice";
import { ReactionButtons } from "./ReactionButtons";

export const Posts = () => {
  const posts = useAppSelector(selectPosts);
  const orderedPosts = posts
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {orderedPosts.map((post) => (
        <article className="post-excerpt" key={post.id}>
          <Link to={`/post/${post.id}`}>
            <h3>{post.title}</h3>
          </Link>
          <p className="post-content">{post.content.substring(0, 100)}</p>
          <ReactionButtons post={post} />
        </article>
      ))}
    </section>
  );
};
