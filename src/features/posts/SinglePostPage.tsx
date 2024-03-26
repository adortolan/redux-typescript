import { Link, useParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectPostById } from "./postsSlice";

export const SinglePostPage = () => {
  const { postId } = useParams();

  const post = useAppSelector((state) => selectPostById(state, postId));

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  return (
    <section>
      <article className="post">
        <h2>{post[0].title}</h2>
        <p className="post-content">{post[0].content}</p>
        <Link to={`/editpost/${postId}`} className="button">
          Editar Post
        </Link>
      </article>
    </section>
  );
};
