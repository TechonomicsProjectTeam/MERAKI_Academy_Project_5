import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name:"users",
    initialState:{
       users:[] 
    },

    reducers:{
        setUsers:(state , action)=>{
            state.users = action.payload;
        },
        addUsers:(state , action)=>{
            state.users.push(action.payload);
        }
    }
})
export const {setUsers , addUsers} = userSlice.actions;
export default userSlice.reducer;