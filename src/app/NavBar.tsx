import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./hooks";
import {
  fetchNotifications,
  selectAllNotifications,
} from "../features/notifications/notificationSlice";
export const NavBar = () => {
  const dispatch = useAppDispatch();
  const notification = useAppSelector(selectAllNotifications);
  const numUnreadNotifications = notification.filter((n) => !n.read).length;

  let unreadNotificationsBadge;

  if (numUnreadNotifications > 0) {
    unreadNotificationsBadge = (
      <span className="badge">{numUnreadNotifications}</span>
    );
  }

  const fetchNewNotifications = () => {
    dispatch(fetchNotifications());
  };
  return (
    <nav>
      <section>
        <h1>Redux Essentials Example</h1>
        <div className="navContent">
          <div className="navLinks">
            <Link to="/">Posts</Link>
            <Link to="/addpost">Add Post</Link>
            <Link to="/users">Users</Link>
            <Link to="/notifications">
              Notifications {unreadNotificationsBadge}
            </Link>
          </div>
          <button className="button" onClick={fetchNewNotifications}>
            Refresh Notifications
          </button>
        </div>
      </section>
    </nav>
  );
};
