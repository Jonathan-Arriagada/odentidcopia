//import React, { useEffect, useState } from 'react';
//import axios from 'axios';

const Reviews = ({ ReviewsFetched }) => {
  /*const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const getGoogleReviews = async () => {
      try {
        const placeId = 'ChIJzeodp8yFq5ERENpM3yxnKwg'; // Reemplaza con el ID del negocio que deseas obtener las reseñas
        const apiKey = 'AIzaSyBihv5eiLwxOVKcDKTz-aF5RM67o_ShJDo'; // Reemplaza con tu propia API key de Google Places

        const corsAnywhereUrl = 'https://api.allorigins.win/raw?url=';

        const response = await axios.get(
          `${corsAnywhereUrl}https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`,
          {
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
            },
            timeout: 5000,
          }
        );

        const fetchedReviews = response.data
        setReviews(fetchedReviews);
        ReviewsFetched(fetchedReviews);
      } catch (error) {
        console.error('Error al obtener las reseñas:', error);
      }
    };

    getGoogleReviews();
  }, [ReviewsFetched]);*/
};

export default Reviews;
