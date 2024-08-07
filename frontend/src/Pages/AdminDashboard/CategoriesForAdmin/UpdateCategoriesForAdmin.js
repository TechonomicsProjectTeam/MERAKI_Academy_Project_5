import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { updateCategoryById } from '../../../redux/reducers/Categories/Categories';
import "./UpdateCategoriesForAdmin.css"
const UpdateCategoriesForAdmin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { categoryId } = useParams(); 
    const category = useSelector((state) =>
        state.category.categories.find((cat) => cat.category_id === parseInt(categoryId))
    );

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (category) {
            setName(category.name);
            setDescription(category.description);
            setImages(category.images);
        }
    }, [category]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        let imageUrl = images;

        if (imageFile) {
            imageUrl = await uploadImageToCloudinary(imageFile);
            if (!imageUrl) {
                setMessage("Image upload failed");
                setTimeout(() => setMessage(""), 3000);
                return;
            }
        }

        axios.put(`http://localhost:5000/categories/${category.category_id}`, {
            name,
            description,
            images: imageUrl,
        })
        .then(response => {
            if (response.data.success) {
                dispatch(updateCategoryById({ 
                    category_id: category.category_id, 
                    name, 
                    description, 
                    images: imageUrl 
                }));
                navigate('/categories');
            }
        })
        .catch(error => {
            console.error('Error updating category:', error);
        });
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const uploadImageToCloudinary = async (file) => {
        const data = new FormData();
        data.append("file", file);
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

    if (!category) {
        return <div>Loading...</div>;
    }

    return (
        <div className="UpdateCategory">
            <h2>Update Category</h2>
            {message && <div className="alert">{message}</div>}
            <form onSubmit={handleUpdate}>
                <div>
                    <label>Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <label>Description</label>
                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div>
                    <label>Images</label>
                    <input type="file" onChange={handleFileChange} />
                </div>
                <button type="submit">Update</button>
            </form>
        </div>
    );
};

export default UpdateCategoriesForAdmin;
