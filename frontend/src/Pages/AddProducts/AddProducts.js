import axios from "axios";
import { useState ,useContext, useEffect } from "react";
import { setProducts} from '../../redux/reducers/Products/Products';
import {jwtDecode} from "jwt-decode"; 
import { useDispatch, useSelector } from 'react-redux';

const Product = ()=>{
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.products);
  const token = useSelector((state) => state.auth.token);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
 
//========================================================= Add Product ===================================================================    
 const handelOnClicAddProduct =async ()=>{
  let imageUrl = "";
  if (image) {
    imageUrl = await uploadImageToCloudinary();
    if (!imageUrl) {
      setMessage("Image upload failed");
      setTimeout(() => setMessage(""), 3000);
      return;
    }
  }

  const newProduct = {
    name,
    description,
    price,
    images: imageUrl || image, 
  };
  

  axios.post("http://localhost:5000/product/",newProduct,{headers:{
    Authorization:`Bearer ${token}` 
  }})
  .then((result)=>{
    console.log(result);
    dispatch(setProducts())
    setMessage(result.data.message)
  })
  .catch((error)=>{
    setMessage(error.response.data.message)
    
  })
 }

 const handleFileChange = (e) => {
  setImage(e.target.files[0]);
};


 const uploadImageToCloudinary = async () => {
  const data = new FormData();
  data.append("file", image);
  data.append("upload_preset", "rgtsukxl");
  data.append("cloud_name", "dqefjpmuo");

  try {
    const response = await fetch("https://api.cloudinary.com/v1_1/dqefjpmuo/image/upload", {
      method: "post",
      body: data
    });
    const result = await response.json();
    return result.url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    return null;
  }
};

return(
    <>
     <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card add-product-card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Add a new product</h2>
              {message && <div className="alert alert-info">{message}</div>}
              <form>
                <div className="mb-3">
                  <label htmlFor="productName" className="form-label">
                    Product name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="productName"
                    placeholder="Enter product name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="productDescription" className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="productDescription"
                    rows="3"
                    placeholder="Enter product description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="productPrice" className="form-label">
                    Price
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="productPrice"
                    placeholder="Enter the price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="productImage" className="form-label">
                    Product image
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="productImage"
                    onChange={handleFileChange
                      
                    }
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={handelOnClicAddProduct}
                >
                  Add product
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    </>
)
}

export default Product;
 