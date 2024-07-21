import React, {useState, useEffect, useContext, createContext} from 'react';
import {View, Text, StyleSheet, ScrollView, Modal} from 'react-native';
// import { useRoute } from '@react-navigation/native';
import {firestore, auth} from '../firebaseConfig';
import MenuCard from './MenuCard';
import OrderSummary from './OrderSummary';
import ConfirmOrder from './ConfirmOrder';
import {RestaurantContext} from '../context/context';
// import {FirebaseContext} from '../App';
import Searcher from './Searcher';
// import Header from './Header';

const Restaurant = ({route}) => {
  const {uidRestaurant} = route.params;
  const [restaurant, setRestaurant] = useState();
  const [menus, setMenus] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState();
  const [showConfirmOrderModal, setShowConfirmOrderModal] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  // const {user} = useContext(FirebaseContext);

  useEffect(() => {
    const restaurantDocRef = firestore()
      .collection('restaurants')
      .doc(uidRestaurant);
    const unsubscribeBasicInformation = restaurantDocRef.onSnapshot(
      snapshot => {
        setRestaurant(snapshot.data().basic_information);
      },
    );

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
      unsubscribeBasicInformation();
    };
  }, [uidRestaurant]);

  useEffect(() => {
    const combinedProducts = [...menus, ...drinks];
    setProducts(combinedProducts);
    setFilteredProducts(combinedProducts); // Inicializamos filteredProducts con todos los productos
  }, [menus, drinks]);

  const filterProducts = text => {
    if (text.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredProducts(filtered);
    }
  };
  return (
    <RestaurantContext.Provider value={{restaurant}}>
      <Searcher filterList={filterProducts} />
      <View style={styles.container}>
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
            {/* <Text style={styles.heading}>Comidas</Text> */}
            <View style={styles.menuContainer}>
              {filteredProducts?.length > 0 ? (
                filteredProducts.map(product => (
                  <MenuCard
                    key={product.name}
                    product={product}
                    orders={orders}
                    setOrders={setOrders}
                    setShowOrderSummary={setShowOrderSummary}
                  />
                ))
              ) : (
                <Text>No hay ningun producto que coincida con la busqueda</Text>
              )}
            </View>
            {/* <Text style={styles.heading}>Bebidas</Text>
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
            </View> */}
          </View>
          {showOrderSummary && (
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
      </View>
    </RestaurantContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#008080',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmOrderContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
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
