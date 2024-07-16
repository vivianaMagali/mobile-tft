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
import RestaurantSearch from './RestaurantSearch';

const Home = () => {
  const [restaurantList, setRestaurantList] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const restaurantsCollection = await firestore()
          .collection('restaurants')
          .get();
        const restaurantList = restaurantsCollection.docs.map(doc =>
          doc.data(),
        );
        setRestaurantList(restaurantList);
      } catch (error) {
        console.error('Error fetching Firestore data: ', error);
      }
    };

    fetchData();
  }, []);

  const getRestaurant = restaurant => {
    navigation.navigate('Restaurant', {restaurant});
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <Text>¿Dónde deseas comer?</Text>
        <RestaurantSearch />
        <View>
          {restaurantList?.length > 0 &&
            restaurantList.map(restaurant => (
              <TouchableOpacity
                key={restaurant.uid}
                onPress={() => getRestaurant(restaurant)}>
                <RestaurantCard restaurant={restaurant} />
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
