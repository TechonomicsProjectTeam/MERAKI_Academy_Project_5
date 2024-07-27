import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: localStorage.getItem("token") || null,
        userId: localStorage.getItem("userId") || null,
        roleId: localStorage.getItem("roleId") || null,
        isLoggedIn : localStorage.getItem("token")?true:false,
        images: localStorage.getItem("image") || null,
        username: localStorage.getItem("username")|| null,
    },
    reducers: {
        setLogin: (state, action) => {
            const { token, userId, roleId } = action.payload;
            state.token = token;
            state.userId = userId;
            state.roleId = roleId;
            state.isLoggedIn = true;
            localStorage.setItem("token", token);
            localStorage.setItem("userId", userId);
            localStorage.setItem("roleId", roleId);
            localStorage.setItem("isLoggedIn",state.isLoggedIn)
        },
        setUserId: (state, action) => {
            state.userId = action.payload;
            localStorage.setItem("userId", action.payload);
        },
        setLogout: (state) => {
            state.token = null;
            state.userId = null;
            state.roleId = null;
            state.isLoggedIn = false;
            localStorage.clear();
        },
        setUserInfo: (state, action) => {
            const {username,images}=action.payload
            state.username = username;
            state.images = images;
            localStorage.setItem("image",images)
            localStorage.setItem("username",username)
          }
    }
});

export const { setLogin, setUserId, setLogout,setUserInfo } = authSlice.actions;
export default authSlice.reducer;
