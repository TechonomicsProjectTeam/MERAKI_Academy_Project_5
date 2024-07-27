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
        updateProductsById:(state , action)=>{
            state.products = state.products.map((product) => {
                if (product.product_id === action.payload.product_id) {
                  return action.payload;
                }
                return product;
              });
           },
        deleteProductsById:(state , action)=>{
            const {product_id} = action.payload;
            state.products = state.products.filter((pro)=>{
                return pro.product_id !== product_id
            })
           }
    }
})
export const {setProducts , addProducts,updateProductsById,deleteProductsById} = productSlice.actions;
export default productSlice.reducer;