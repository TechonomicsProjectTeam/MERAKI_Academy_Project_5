import { createSlice } from "@reduxjs/toolkit";

export const productSlice = createSlice({
    name:"products",
    initialState:{
       products:[] 
    },

    reducers:{
        setProducts:(state , action)=>{
            state.products = action.payload;
        },
        addProducts:(state , action)=>{
            state.products.push(action.payload);
        },
    }
})
export const {setProducts , addProducts} = productSlice.actions;
export default productSlice.reducer;