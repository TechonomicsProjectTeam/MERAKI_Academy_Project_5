import { createSlice } from "@reduxjs/toolkit";

export const reviewSlice = createSlice({
    name: "reviews",
    initialState: {
        reviews: {},
    },
    reducers: {
        setReviewsByProduct: (state, action) => {
            const { product_id, reviews } = action.payload;
            state.reviews[product_id] = reviews;
        },
        addReview: (state, action) => {
            const { product_id, review } = action.payload;
            if (!state.reviews[product_id]) {
                state.reviews[product_id] = [];
            }
            state.reviews[product_id].push(review);
        },
        updateReview: (state, action) => {
            const { product_id, review_id, rating, review_text } = action.payload;
            const productReviews = state.reviews[product_id];
            if (productReviews) {
                const review = productReviews.find(review => review.review_id === review_id);
                if (review) {
                    review.rating = rating;
                    review.review_text = review_text;
                }
            }
        },
        deleteReview: (state, action) => {
            const { product_id, review_id } = action.payload;
            const productReviews = state.reviews[product_id];
            if (productReviews) {
                state.reviews[product_id] = productReviews.filter(review => review.review_id !== review_id);
            }
        },
    },
});

export const { setReviewsByProduct, addReview, updateReview, deleteReview } = reviewSlice.actions;

export default reviewSlice.reducer;
