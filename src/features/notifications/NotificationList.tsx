import { useLayoutEffect } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useAppSelector } from "../../app/hooks";
import {
  selectAllNotifications,
  allNotificationsRead,
} from "./notificationSlice";
import { selectAllUsers } from "../user/userSlice";
import classNames from "classnames";
import { useDispatch } from "react-redux";

export const NotificationList = () => {
  const notification = useAppSelector(selectAllNotifications);
  const users = useAppSelector(selectAllUsers);
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(allNotificationsRead(notification));
  });

  const renderedNotification = notification.map((notification) => {
    const date = parseISO(notification.date);
    const timeAgo = formatDistanceToNow(date);
    const user = users.find((user) => user.id === notification.user) || {
      name: "Unknow user",
    };

    const notificationClassName = classNames("notification", {
      new: notification.isNew,
    });

    return (
      <div key={notification.id} className={notificationClassName}>
        <div>
          <b>{user.name}</b> {notification.message}
        </div>
        <div title={notification.date}>
          <i>{timeAgo}</i> ago
        </div>
      </div>
    );
  });

  return (
    <section className="notificationList">
      <h2>Notification</h2>
      {renderedNotification}
    </section>
  );
};
