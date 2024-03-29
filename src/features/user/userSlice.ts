import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { client } from "../../api/client";
import { RootState } from "../../app/store";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await client.get("fakeApi/users");
  return response.data;
});

interface User {
  id: string;
  name: string;
}

const initialState: User[] = [];

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export default userSlice.reducer;

export const selectAllUsers = (state: RootState) => state.users;
export const selectUserById = (state: RootState, userId: string | undefined) =>
  state.users.find((user) => user.id === userId);
