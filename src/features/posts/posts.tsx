import { useAppSelector } from "../../app/hooks";
import { selectPosts } from "./postsSlice";

export const Posts = () => {
  const posts = useAppSelector(selectPosts);

  return <div>Posts do Adilson</div>;
};
