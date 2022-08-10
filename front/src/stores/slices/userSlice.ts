import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: undefined,
  userName: "",
  userGender: undefined,
  userDesc: "",
  socialId: undefined,
  socialType: undefined,
  profileImagePath: undefined,
  isLogin: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    reset(state) {
      Object.assign(state, initialState);
    },
    setUserId(state, action) {
      state.userId = action.payload;
    },
    setUserName(state, action) {
      state.userName = action.payload;
    },
    setUserGender(state, action) {
      state.userGender = action.payload;
    },
    setUserDesc(state, action) {
      state.userDesc = action.payload;
    },
    setSocialId(state, action) {
      state.socialId = action.payload;
    },
    setSocialType(state, action) {
      state.socialType = action.payload;
    },
    setProfileImagePath(state, action) {
      state.profileImagePath = action.payload;
    },
    setIsLogin(state, action) {
      state.isLogin = action.payload;
    },
  },
});

export const {
  reset,
  setUserId,
  setUserName,
  setUserGender,
  setUserDesc,
  setSocialId,
  setSocialType,
  setProfileImagePath,
  setIsLogin,
} = userSlice.actions;

export default userSlice.reducer;
