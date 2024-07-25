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
        },
        updateUserById:(state , action)=>{
            state.users=state.users.map((user)=>{
                if (user.user_id==action.payload.user_id){
                user=action.payload
                }
            })
           },
        deleteUserById:(state , action)=>{
            const {user_id} = action.payload;
            state.users = state.users.filter((user)=>{
                return user.user_id !== user_id
            })
           }
    }
})
export const {setUsers , addUsers,updateUserById,deleteUserById} = userSlice.actions;
export default userSlice.reducer;