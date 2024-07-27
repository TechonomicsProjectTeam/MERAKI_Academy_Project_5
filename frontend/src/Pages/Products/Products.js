import React, { useState ,useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setProducts , deleteProductsById , updateProductsById} from '../../redux/reducers/Products/Products';


const Products = () => {
  const dispatch = useDispatch();
  const products = useSelector((state)=> state.product.products)
  const token = useSelector((state) => state.auth.token);
  
  const carts = useSelector((state)=> state.cart.carts)

  const [name , setName ] = useState("");
  const [description , setDescription] = useState("");
  const [images , setImages ] = useState("");
  const [price , setPrice ] = useState("");
  const [message , setMessage ] = useState("");
  const [status , setStatus ] = useState(false);
  const [selectedProductId , setSelectedProductId] = useState(null);
  
  


  const getAllProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/product/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log(response.data);
      dispatch(setProducts(response.data.products))

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAllProduct()
  }, [])

  const deleteProductById = async (id) =>{
    console.log(id);
    try{
      const response = await axios.delete(`http://localhost:5000/product/${id}`,{ headers: {
        Authorization: `Bearer ${token}`
      }})
      console.log(token);
      dispatch(deleteProductsById({product_id:id}))
    }catch(error){
      console.log(error);
    }
  }


  return (
    <div className='Products'>
    <h1>Products Component</h1>
    <div>
      {products.map((product) => (
        <div key={product.product_id}>
          {selectedProductId === product.product_id ? (
            <form>
              <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
              <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
              <input type="text" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
              <input type="file" onChange={(e) => setImages(e.target.files[0])} />
              <button type="button" onClick={() => handelUpdateProduct(product.product_id)}>Save</button>
              <button type="button" onClick={() => setSelectedProductId(null)}>Cancel</button>
            </form>
          ) : (
            <div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p>{product.price}</p>
              <button onClick={() => deleteProductById(product.product_id)}>Delete</button>
              <button onClick={() => {
                setSelectedProductId(product.product_id);
                setName(product.name);
                setDescription(product.description);
                setPrice(product.price);
                setImages(product.images);
              }}>Update</button>
            </div>
          )}
        </div>
      ))}
    </div>
    {message && <p>{message}</p>}
  </div>
  )
};

export default Products
