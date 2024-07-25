import { createSlice } from "@reduxjs/toolkit";

export const roleSlice = createSlice({
    name:"roles",
    initialState:{
        roles:[],
        permissions:[],
        rolePermissions:[],
    },
    reducers:{
        getRoles : (state,action) =>{
            state.roles = action.payload
        },
        getPermissions : (state,action) =>{
            state.permissions = action.payload
        },
    }
})
