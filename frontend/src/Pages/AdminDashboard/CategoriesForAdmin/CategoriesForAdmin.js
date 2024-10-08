import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { getCategories } from '../../../redux/reducers/Categories/Categories';
import "../CategoriesForAdmin/Categories.css";

const CategoriesForAdmin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const categories = useSelector((state) => state.category.categories); 

    useEffect(() => {
        axios
            .get('https://quickserv.onrender.com/categories/')
            .then((response) => {
                if (response.data.success) {
                    dispatch(getCategories(response.data.category));
                }
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
            });
    }, [dispatch]);

    const handleEdit = (category_id) => {
        navigate(`/admin-dashboard/update-category/${category_id}`);
    };
    

    return (
        <div className="Categories">
            <h2>Categories</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Images</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <tr key={category.category_id}>
                            <td>{category.category_id}</td>
                            <td>{category.name}</td>
                            <td>{category.description}</td>
                            <td><img src={category.images} alt={category.name}/></td>
                            <td>
                               
                                    <FontAwesomeIcon icon={faEdit} 
                                    onClick={() => handleEdit(category.category_id)}/>
                                
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CategoriesForAdmin;
