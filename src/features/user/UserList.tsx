import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectAllUsers } from "./userSlice";

export const UserList = () => {
  const users = useAppSelector(selectAllUsers);

  const renderedUserList = users.map((user) => (
    <li key={user.id}>
      <Link to={`/users/${user.id}`}>{user.name}</Link>
    </li>
  ));

  return (
    <section>
      <h2>Users</h2>
      <ul>{renderedUserList}</ul>
    </section>
  );
};
