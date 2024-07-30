import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  addProductFromCart,
  decreaseProductQuantityById,
  deleteProductCartById,
  deleteAllProductFromCart,
  SetCartId,
  setProductFromCart,
} from "../../redux/reducers/Carts/Carts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import "./Style.css";

const Carts = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const cart = useSelector((state) => state.cart.carts);
  const cartId = useSelector((state) => state.cart.cartId);
  const isLoggedIn = useSelector((state) => state.auth.token);
  const roleId = useSelector((state) => state.auth.roleId);

  const getCartIdByUserId = async () => {
    try {
      const result = await axios.get(`http://localhost:5000/carts/cart/userId`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(SetCartId({ cartId: result.data.cart[0].cart_id }));
    } catch (error) {
      console.error("Error fetching cart ID:", error);
    }
  };

  const getCartProductByCartId = async () => {
    try {
      const result = await axios.get(`http://localhost:5000/carts/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setProductFromCart({ products: result.data.products }));
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn && parseInt(roleId) === 1) {
      getCartProductByCartId();
      getCartIdByUserId();
    }
  }, [isLoggedIn, roleId]);

  const increaseProductQuantity = async (productId, quantity) => {
    try {
      await axios.post(
        `http://localhost:5000/carts/${productId}`,
        { cart_id: cartId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(addProductFromCart({ product_id: productId, quantity }));
    } catch (error) {
      console.error("Error increasing product quantity:", error);
    }
  };

  const decreaseProductQuantity = async (productId) => {
    try {
      await axios.post(
        `http://localhost:5000/carts/decrease/${cartId}/products/${productId}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(decreaseProductQuantityById({ product_id: productId }));
    } catch (error) {
      console.error("Error decreasing product quantity:", error);
    }
  };
  
  return (
    <div className="Cart">
      <h2>Shopping Cart</h2>
      {cart?.length > 0 ? (
        <ul>
          {cart.map((item) => (
            <li key={item.product_id}>
              <img src={item.images} alt={item.name} className="cart-item-image" />
              <p>{item.name} - {item.quantity} x ${item.price}</p>
              <div className="icon-container">
                <FontAwesomeIcon
                  icon={faPlus}
                  onClick={() => increaseProductQuantity(item.product_id, 1)}
                  className="icon"
                />
                <FontAwesomeIcon
                  icon={faMinus}
                  onClick={() => decreaseProductQuantity(item.product_id)}
                  className="icon"
                />
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  onClick={() => deleteProductFromCart(item.product_id)}
                  className="icon"
                />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No items in cart</p>
      )}
      <button className="clear-cart-button" onClick={deleteAllProductsFromCart}>
        Remove All Products
      </button>
    </div>
  );
};

export default Carts;



