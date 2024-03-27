import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAllPosts } from "./postsSlice";
import { ReactionButtons } from "./ReactionButtons";
import { fetchPosts } from "./postsSlice";
import { useEffect } from "react";
import { Spinner } from "../../components/Spinner";
import { PostAuthor } from "./PostAuthor";
import { TimeAgo } from "./TimeAgo";

export const Posts = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectAllPosts);

  const postStatus = useAppSelector((state) => state.posts.status);
  const error = useAppSelector((state) => state.posts.error);

  useEffect(() => {
    if (postStatus === "idle") {
      dispatch(fetchPosts());
    }
  }, [postStatus, dispatch]);

  let content;

  if (postStatus === "loading") {
    content = <Spinner text="loading" />;
  } else if (postStatus === "succeeded") {
    const orderedPosts = posts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date));

    content = orderedPosts.map((post) => (
      <article className="post-excerpt" key={post.id}>
        <h3>{post.title}</h3>
        <div>
          <PostAuthor userId={post.user} />
          <TimeAgo timestamp={post.date} />
        </div>
        <p className="post-content">{post.content.substring(0, 100)}</p>
        <div>
          <Link to={`/post/${post.id}`}>
            <h4>View post</h4>
          </Link>
        </div>
        <ReactionButtons post={post} />
      </article>
    ));
  } else if (postStatus === "fail") {
    content = <div>{error}</div>;
  }
  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  );
};
