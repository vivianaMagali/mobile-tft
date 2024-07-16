import React, {useState, useEffect, useContext, createContext} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
// import { useRoute } from '@react-navigation/native';
import {firestore, auth} from '../firebaseConfig';
import MenuCard from './MenuCard';
import OrderSummary from './OrderSummary';
import ConfirmOrder from './ConfirmOrder';
import {RestaurantContext} from '../context/context';
// import Header from './Header';

const Restaurant = ({route}) => {
  const {restaurant} = route.params;
  const [menus, setMenus] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState();
  const [showConfirmOrderModal, setShowConfirmOrderModal] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  // const { restaurant } = useContext(RestaurantContext);

  useEffect(() => {
    const restaurantDocRef = firestore()
      .collection('restaurants')
      .doc(restaurant.uid);

    const menuCollectionRef = restaurantDocRef.collection('menu');
    const unsubscribeMenu = menuCollectionRef.onSnapshot(snapshot => {
      setMenus(snapshot.docs.map(doc => doc.data()));
    });

    const drinksCollectionRef = restaurantDocRef.collection('drinks');
    const unsubscribeDrinks = drinksCollectionRef.onSnapshot(snapshot => {
      setDrinks(snapshot.docs.map(doc => doc.data()));
    });

    return () => {
      unsubscribeMenu();
      unsubscribeDrinks();
    };
  }, [restaurant.uid]);

  return (
    <View style={styles.container}>
      <RestaurantContext.Provider value={{restaurant}}>
        {showConfirmOrderModal && (
          <ConfirmOrder
            orders={orders}
            setOrders={setOrders}
            setShowConfirmOrderModal={setShowConfirmOrderModal}
            setShowOrderSummary={setShowOrderSummary}
            total={total}
          />
        )}
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.section}>
            <Text style={styles.heading}>Comidas</Text>
            <View style={styles.menuContainer}>
              {menus?.length > 0 &&
                menus.map(menu => (
                  <MenuCard
                    key={menu.name}
                    product={menu}
                    orders={orders}
                    setOrders={setOrders}
                    setShowOrderSummary={setShowOrderSummary}
                  />
                ))}
            </View>
            <Text style={styles.heading}>Bebidas</Text>
            <View style={styles.menuContainer}>
              {drinks?.length > 0 &&
                drinks.map(drink => (
                  <MenuCard
                    key={drink.name}
                    product={drink}
                    orders={orders}
                    setOrders={setOrders}
                    setShowOrderSummary={setShowOrderSummary}
                  />
                ))}
            </View>
          </View>
          {orders.length > 0 && (
            <OrderSummary
              orders={orders}
              setShowConfirmOrderModal={setShowConfirmOrderModal}
              showOrderSummary={showOrderSummary}
              setShowOrderSummary={setShowOrderSummary}
              total={total}
              setTotal={setTotal}
            />
          )}
        </ScrollView>
      </RestaurantContext.Provider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flexGrow: 1,
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
});

export default Restaurant;
