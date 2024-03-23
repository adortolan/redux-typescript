import { useAppDispatch } from "../../app/hooks";
import { Post, reactionAdd, reactionEmoji } from "./postsSlice";

const reactionEmojis = {
  thumbsUp: "👍",
  hooray: "🎉",
  heart: "❤️",
  rocket: "🚀",
  eyes: "👀",
};
export const ReactionButtons = ({ post }: { post: Post }) => {
  const dispatch = useAppDispatch();

  const reactionButtons = Object.entries(reactionEmojis).map(
    ([name, emoji]) => {
      return (
        <button
          key={name}
          className="muted-button reaction-button"
          onClick={() =>
            dispatch(reactionAdd({ postId: post.id, reaction: name }))
          }
        >
          {emoji} {post.reactions[name as keyof reactionEmoji]}
        </button>
      );
    }
  );

  return <div>{reactionButtons}</div>;
};
