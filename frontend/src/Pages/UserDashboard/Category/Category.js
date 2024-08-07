import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../../../redux/reducers/Categories/Categories';
import { setShopsByCategory } from '../../../redux/reducers/Shops/Shops';
import BestRatedShops from '../BestRatedShops/BestRatedShops';
import "../Category/Category.css";

const Category = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const categories = useSelector((state) => state.category.categories);

  useEffect(() => {
    axios
      .get('http://localhost:5000/categories/')
      .then((response) => {
        if (response.data.success) {
          dispatch(getCategories(response.data.category));
        }
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, [dispatch]);

  const handleCategoryClick = (categoryId, categoryName) => {
    axios
      .get(`http://localhost:5000/shop/category/${categoryId}`)
      .then((response) => {
        if (response.data.success) {
          dispatch(setShopsByCategory(response.data.shops));
          navigate(`/user-dashboard/${categoryName}`);
        }
      })
      .catch((error) => {
        console.error('Error fetching shops by category:', error);
      });
  };

  return (
    <>
     <div className="dashboard">
    <header className="header">
      <div className="hero">
        <div className="hero-text">
          <h1>Enjoy quick delivery
            <br/> with QuickServ ..
            <br/>
            All you have to do is
            <br/> fill the basket.</h1>
        </div>
        <div className="hero-image">
          <img src="https://i.pinimg.com/564x/61/ab/a3/61aba3c42a0f00ffb2f36551bcb28efc.jpg" alt="Delivery" />
        </div>
      </div>
    </header>
  </div> 
    <div className="Category">
      <h2>Categories</h2>
      <ul className="category-list">
        {categories.map((category) => (
          <li key={category.category_id} onClick={() => handleCategoryClick(category.category_id, category.name)}>
            {category.name}
            <img src={category.images} alt={category.name} className="category-image" />
          </li>
        ))}
      </ul>
      <BestRatedShops />
    </div>
    <div className="how-it-works">
  <h2 className='h2'>How Does It Work?</h2>
  <div className="steps">
    <div className="step">
      <img src="https://i.pinimg.com/564x/68/79/8d/68798d5d09b34e4fee737ef3afd0a776.jpg" alt="Step 1" className="step-image" />
      <h2 className="step-description">Easy To Order</h2>
      <p className="step-description">You only need a few steps in ordering food.</p>
    </div>
    <div className="step">
      <img src="https://i.pinimg.com/236x/c6/97/26/c69726c824dccb7f812e562799c3d8ec.jpg" alt="Step 2" className="step-image" />
      <h2 className="step-description">Fastest Delivery</h2>
      <p className="step-description">Delivery that is always ontime even faster.</p>
    </div>
    <div className="step">
      <img src="https://i.pinimg.com/236x/54/1f/68/541f686b0a3f5a777c150a589daf3301.jpg" alt="Step 3" className="step-image" />
      <h2 className="step-description">Best Quality</h2>
      <p className="step-description">Not only fast for us quality is also nubmer one.</p>
    </div>
  </div>
</div>

    <footer className="footer">
    <div className="footer-content">
      <div className="footer-info">
        <h2>Contact Info</h2>
        <p>Address: CT34 Building, Street 195, Amman Jordan, Country</p>
        <p>Telephone: 071234 5678</p>
        <p>Fax: 9876 5432</p>
        <p>Email: admin@pj.com</p>
        <div className="social-media">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      </div>
      <div className="footer-map">
        <img src="https://i.pinimg.com/564x/0a/12/13/0a12131d595ca1ac8625fc43a5a87443.jpg" alt="Map" />
      </div>
    </div>
  </footer>
    </>
  );
};

export default Category;
