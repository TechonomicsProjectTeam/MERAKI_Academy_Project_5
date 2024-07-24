import { createSlice } from "@reduxjs/toolkit";

export const categoriesSlice = createSlice({
    name:"categories",
    initialState:{
        categories:[]
    },
    reducers:{
        getCatogories: (state,action) =>{
            state.categories = action.payload
        },
        addCategories: (state, action)=>{
            state.categories.push(action.payload);
        },
    }
})