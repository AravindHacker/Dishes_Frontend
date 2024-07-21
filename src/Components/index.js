import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import './index.css';

const backendUrl = 'https://dishes-backend-93mv.onrender.com'; // Use your Render backend URL here

const socket = io(backendUrl);

const DishDashBoard = () => {
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    fetchDishes();

    socket.on('update', fetchDishes);

    return () => {
      socket.off('update', fetchDishes);
    };
  }, []);

  const fetchDishes = async () => {
    try {
      const response = await axios.get(`${backendUrl}/dishes`);
      setDishes(response.data);
    } catch (error) {
      console.error('Error fetching dishes:', error);
    }
  };

  const togglePublish = async (id) => {
    try {
      await axios.post(`${backendUrl}/toggle-publish/${id}`);

      // Optimistically update the state
      setDishes(prevDishes => 
        prevDishes.map(dish => 
          dish.dishId === id ? { ...dish, isPublished: !dish.isPublished } : dish
        )
      );
    } catch (error) {
      console.error('Error toggling publish status:', error);
    }
  };

  return (
    <div className='dish-container'>
      <h1 className='dish-header'>Dish Dashboard</h1>
      <ul className='each-dish'>
        {dishes.map(dish => (
          <li key={dish.dishId} className='separate-dish-box'>
            <h2 className='dish-name'>{dish.dishName}</h2>
            <img src={dish.imageUrl} alt={dish.dishName} className='dish-image'/>
            {/* <p className='dish-status'>Published: {dish.isPublished ? 'Yes' : 'No'}</p> */}
            <button onClick={() => togglePublish(dish.dishId)} className='toggel-btn'>
              {dish.isPublished ? 'Unpublish' : 'Publish'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DishDashBoard;
