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

  const handleCategoryClick = (categoryId, categoryName) => {
    localStorage.setItem('selectedCategory', categoryId);
    axios
      .get(`https://quickserv.onrender.com/shop/category/${categoryId}`)
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
          
            <img src={category.images} alt={category.name} className="category-image" />
            <h3>{category.name}</h3>
          </li>
        ))}
      </ul>
      <BestRatedShops />
    </div>
    <div className="how-it-works">
  <h2>How Does It Work?</h2>
  <div className="steps">
    <div className="step">
      <img src="https://i.pinimg.com/564x/68/79/8d/68798d5d09b34e4fee737ef3afd0a776.jpg" alt="Step 1" className="step-image" />
      <div className="separator"/>
      <h3 className="step-description">Easy To Order</h3>
      <p className="step-description">You only need a few steps in ordering food.</p>
    </div>
    <div className="step">
      <img src="https://i.pinimg.com/236x/c6/97/26/c69726c824dccb7f812e562799c3d8ec.jpg" alt="Step 2" className="step-image" />
      <div className="separator"/>
      <h3 className="step-description">Fastest Delivery</h3>
      <p className="step-description">Delivery that is always ontime even faster.</p>
    </div>
    <div className="step">
      <img src="https://i.pinimg.com/236x/54/1f/68/541f686b0a3f5a777c150a589daf3301.jpg" alt="Step 3" className="step-image" />
      <div className="separator"/>
      <h3 className="step-description">Best Quality</h3>
      <p className="step-description">Not only fast for us quality is also nubmer one.</p>
    </div>
  </div>
</div>
<footer class="footer">
  <div class="footer-top">
    <div class="footer-column">
      <h3>Restaurants</h3>
      <ul>
        <li>Cozy Pizza</li>
        <li>Sizzle Grill</li>
        <li>MindHub</li>
        <li>WOK U LIKE</li>
        <li>McDonald's</li>
        <li>More Restaurants...</li>
      </ul>
    </div>
    {/* <div class="footer-column">
      <h3>Popular Cuisines</h3>
      <ul>
        <li>American</li>
        <li>Arabic</li>
        <li>Asian</li>
        <li>Beverages</li>
        <li>Breakfast</li>
        <li>More Cuisines...</li>
      </ul>
    </div> */}
    <div class="footer-column">
      <h3>Popular Areas</h3>
      <ul>
        <li>Al Mala'ab</li>
        <li>Al Huson</li>
        <li>Al Sareeh</li>
        <li>Al Mohammadiyeh Amman</li>
        <li>Bait Ras</li>
        <li>More Areas...</li>
      </ul>
    </div>
    <div class="footer-column">
      <h3>Cities</h3>
      <ul>
        <li>Ajloun</li>
        <li>Amman</li>
        <li>Aqaba</li>
        <li>Irbid</li>
        <li>Jerash</li>
        <li>More Cities...</li>
      </ul>
    </div>
    <div class="footer-column">
      <h3>Follow us on</h3>
      <ul class="social-media">
        <li><a href="#"><i class="fab fa-facebook-f"></i></a></li>
        <li><a href="#"><i class="fab fa-twitter"></i></a></li>
        <li><a href="#"><i class="fab fa-instagram"></i></a></li>
        <li><a href="#"><i class="fab fa-linkedin-in"></i></a></li>
        <li><a href="#"><i class="fab fa-youtube"></i></a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <ul>
      <li><a href="#">Careers</a></li>
      <li><a href="#">Terms and Conditions</a></li>
      <li><a href="#">FAQ</a></li>
      <li><a href="#">Privacy Policy</a></li>
      <li><a href="#">Contact Us</a></li>
      <li><a href="#">Sitemap</a></li>
    </ul>
    <p>©2024 QuickServ.com</p>
    <p>For any support or help you can contact us via our Live Chat</p>
  </div>
</footer>
    </>
  );
};

export default Category;
