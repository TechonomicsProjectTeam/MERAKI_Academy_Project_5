import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {getOrderProductsByUserId} from "../../redux/reducers/Orders/Orders"
import {jwtDecode} from "jwt-decode"; 

const Orders = () => {
  const dispatch = useDispatch();
  const userOrders = useSelector(state => state.orders.userOrders)

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const user_id = decodedToken.userId;

  useEffect(()=>{
    axios.get(`http://localhost:5000/orders/order-products/${user_id}`,
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response)=>{
      if(response.data.success){
        console.log(response.data.result);
        dispatch(getOrderProductsByUserId(response.data.result))
        //result = orders 
      }
    })
    .catch((error)=>{
      console.log("Fetching error ",error);
    })
  },[dispatch])
  return (
    <div className='Orders'>
     <ul>
      {userOrders.map((order,key)=> (
        <li key={order.order_id}>Order id : {order.order_id} Product id : {order.product_id}</li>
      ))}
     </ul>
    </div>
  )
};

export default Orders
