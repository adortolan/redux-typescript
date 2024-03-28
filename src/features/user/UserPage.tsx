import { Link, useParams } from "react-router-dom";
import { selectAllPosts } from "../posts/postsSlice";
import { selectUserById } from "./userSlice";
import { useAppSelector } from "../../app/hooks";

export const UserPage = () => {
  const { userId } = useParams();
  const user = useAppSelector((state) => selectUserById(state, userId));

  const userPosts = useAppSelector((state) => {
    const allPosts = selectAllPosts(state);
    return allPosts.filter((post) => post.user === userId);
  });

  const postTitle = userPosts.map((post) => (
    <li key={post.id}>
      <Link to={`/post/${post.id}`}>{post.title}</Link>
    </li>
  ));

  return (
    <section>
      <h2>{user?.name}</h2>
      <ul>{postTitle}</ul>
    </section>
  );
};
