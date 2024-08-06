import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name:'chat',
    initialState:{
        messages:[],
        users:[],
    },

    reducers:{
        addMessage:(state,action)=>{
            state.messages.push(action.payload);
        },
        setUsers:(state,action)=>{
            state.users = action.payload
        }
    }
})

export const {addMessage,setUsers} = chatSlice.actions;
export default chatSlice.reducer;