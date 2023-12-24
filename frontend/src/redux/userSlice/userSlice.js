import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: null,
  userId: null,
};

const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.username = action.payload.username;
      state.userId = action.payload.userId;
    },
    resetUser: (state) => {
      state.username = null;
      state.userId = null;
    },
  },
});

export const { setUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
