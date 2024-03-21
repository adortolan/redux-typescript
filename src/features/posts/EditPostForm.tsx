import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useState } from "react";
import { postUpdate } from "./postsSlice";

export const EditPostForm = () => {
  const { postId } = useParams();
  const post = useAppSelector((state) =>
    state.posts.find((post) => post.id === postId)
  );
  const [title, setTitle] = useState(post?.title);
  const [content, setContent] = useState(post?.content);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSavePost = () => {
    if (title && content) {
      dispatch(postUpdate({ id: postId, title, content }));
      navigate(`/post/${postId}`);
    }
  };

  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title</label>
        <input
          type="text"
          id="postTitle"
          name="posTitle"
          placeholder="No que esta pensando"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="postContent">Post Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="button" onClick={handleSavePost}>
          Save Post
        </button>
      </form>
    </section>
  );
};
