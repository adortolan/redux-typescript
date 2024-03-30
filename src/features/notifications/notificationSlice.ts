import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { client } from "../../api/client";
import { RootState } from "../../app/store";

interface Notifications {
  id: string;
  date: string;
  message: string;
  user: string;
  read: boolean;
  isNew: boolean;
}

interface InitialState {
  notifications: Notifications[];
}

const initialState = {
  notifications: [],
} as InitialState;

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { getState }) => {
    const allNotification = selectAllNotifications(getState() as RootState);
    const [lastNotification] = allNotification;
    const lastTimeStamp = lastNotification ? lastNotification.date : "";
    const response = await client.get(
      `/fakeApi/notifications?since=${lastTimeStamp}`
    );
    return response.data;
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    allNotificationsRead(state, actions) {
      state.notifications.forEach((notification) => {
        notification.read = true;
      });
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.notifications.push(...action.payload);
      state.notifications.forEach((notifications) => {
        notifications.isNew = !notifications.read;
      });
      state.notifications.sort((a, b) => b.date.localeCompare(a.date));
    });
  },
});

export const { allNotificationsRead } = notificationSlice.actions;

export default notificationSlice.reducer;

export const selectAllNotifications = (state: RootState) =>
  state.notifications.notifications;
