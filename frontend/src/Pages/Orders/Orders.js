import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {getOrders} from "../../redux/reducers/Orders/Orders"

const Orders = () => {

  const dispatch = useDispatch();
  const orders = useSelector(state => state.orders.orders)
  const token = localStorage.getItem("token");

  useEffect(()=>{
    axios.get("http://localhost:5000/orders/order-products",
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response)=>{
      if(response.data.success){
        console.log(response.data.result);
        dispatch(getOrders(response.data.result))
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
      {orders.map((order,key)=> (
        <li key={order.order_id}>Order id : {order.order_id} Product id : {order.product_id}</li>
      ))}
     </ul>
    </div>
  )
};

export default Orders
