import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAllPosts } from "./postsSlice";
import { ReactionButtons } from "./ReactionButtons";
import { fetchPosts } from "./postsSlice";
import { useEffect } from "react";

export const Posts = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectAllPosts);

  const postStatus = useAppSelector((state) => state.posts.status);

  useEffect(() => {
    if (postStatus === "idle") {
      dispatch(fetchPosts());
    }
  }, [postStatus, dispatch]);

  const orderedPosts = posts
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {orderedPosts.map((post) => (
        <article className="post-excerpt" key={post.id}>
          <h3>{post.title}</h3>
          <p className="post-content">{post.content.substring(0, 100)}</p>
          <div>
            <Link to={`/post/${post.id}`}>
              <h4>Edit</h4>
            </Link>
          </div>
          <ReactionButtons post={post} />
        </article>
      ))}
    </section>
  );
};
