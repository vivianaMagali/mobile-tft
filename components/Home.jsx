import React, {useEffect, useState} from 'react';
import RestaurantCard from './RestaurantCard';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {firestore} from '../firebaseConfig';
import Searcher from './Searcher';

const Home = () => {
  const [restaurantList, setRestaurantList] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const restaurantsCollection = await firestore()
          .collection('restaurants')
          .get();

        const fetchedRestaurants = restaurantsCollection.docs.map(doc =>
          doc.data(),
        );

        setRestaurantList(fetchedRestaurants);
      } catch (error) {
        console.error('Error fetching Firestore data:', error);
      }
    };

    fetchRestaurants();
  }, []);

  const getRestaurant = uidRestaurant => {
    navigation.navigate('Restaurant', {uidRestaurant});
  };

  const filterRestaurants = text => {
    if (text?.trim() === '') {
      setFilteredRestaurants(restaurantList);
    } else {
      const filtered = restaurantList?.filter(restaurant =>
        restaurant?.basic_information?.name
          ?.toLowerCase()
          .includes(text?.toLowerCase()),
      );
      setFilteredRestaurants(filtered);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <Text>¿Dónde deseas comer?</Text>
        <Searcher filterList={filterRestaurants} />
        <View>
          {filteredRestaurants?.length > 0
            ? filteredRestaurants.map(restaurant => (
                <TouchableOpacity
                  key={restaurant.uid}
                  onPress={() => getRestaurant(restaurant.uid)}>
                  <RestaurantCard restaurant={restaurant} />
                </TouchableOpacity>
              ))
            : restaurantList.map(restaurant => (
                <TouchableOpacity
                  key={restaurant.uid}
                  onPress={() => getRestaurant(restaurant.uid)}>
                  <RestaurantCard restaurant={restaurant} />
                </TouchableOpacity>
              ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
