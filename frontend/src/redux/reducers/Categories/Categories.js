import { createSlice } from "@reduxjs/toolkit";

export const categoriesSlice = createSlice({
    name:"categories",
    initialState:{
        categories:[]
    },
    reducers:{
        getCategories: (state,action) =>{
            state.categories = action.payload
        },
        addCategories: (state, action)=>{
            state.categories.push(action.payload);
        },
        deleteCategoryById: (state,action) =>{
            state.categories.splice(action.payload.category_id,1);
        },
        updateCategoryById: (state,action)=>{
            state.categories= state.categories.map((category)=>{
                if (category.category_id === action.payload.category_id){
                    category = action.payload
                }
                return category
            })
        }
    }
})

export const {getCategories,addCategories,addShops,updateCategoryById} = categoriesSlice.actions;

export default categoriesSlice.reducer;