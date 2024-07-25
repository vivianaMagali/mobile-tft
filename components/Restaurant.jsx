import React, {useState, useEffect, useContext} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
// import { useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import MenuCard from './MenuCard';
import OrderSummary from './OrderSummary';
import ConfirmOrder from './ConfirmOrder';
import {RestaurantContext} from '../context/context';
import Searcher from './Searcher';
import {typeProducts, typeRole} from '../utils';
import {FirebaseContext} from '../App';
// import Header from './Header';

const Restaurant = ({route}) => {
  const {uidRestaurant} = route.params;
  const [restaurant, setRestaurant] = useState();
  const [menus, setMenus] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [starters, setStarters] = useState([]);
  const [mains, setMains] = useState([]);
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState();
  const [showConfirmOrderModal, setShowConfirmOrderModal] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const {user} = useContext(FirebaseContext);
  useEffect(() => {
    const restaurantDocRef = firestore()
      .collection('restaurants')
      .doc(uidRestaurant);
    const unsubscribeBasicInformation = restaurantDocRef.onSnapshot(
      snapshot => {
        setRestaurant(snapshot.data());
      },
    );

    const menuCollectionRef = restaurantDocRef.collection('menu');
    const unsubscribeMenu = menuCollectionRef.onSnapshot(snapshot => {
      setMenus(
        snapshot.docs
          .map(doc => doc.data())
          .filter(data => data.type === typeProducts.menu),
      );
      setDrinks(
        snapshot.docs
          .map(doc => doc.data())
          .filter(data => data.type === typeProducts.drink),
      );
      setStarters(
        snapshot.docs
          .map(doc => doc.data())
          .filter(data => data.type === typeProducts.starter),
      );
      setMains(
        snapshot.docs
          .map(doc => doc.data())
          .filter(data => data.type === typeProducts.main),
      );
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
    setFilteredProducts(combinedProducts); // Inicializo filteredProducts con todos los productos
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

  const resetQuantities = () => {
    setQuantities({});
  };
  return (
    <RestaurantContext.Provider value={{restaurant}}>
      {user?.role === typeRole.waiter && (
        <Searcher filterList={filterProducts} />
      )}
      <View style={styles.container}>
        {showConfirmOrderModal && (
          <ConfirmOrder
            orders={orders}
            setShowConfirmOrderModal={setShowConfirmOrderModal}
            setShowOrderSummary={setShowOrderSummary}
            total={total}
            resetQuantities={resetQuantities}
          />
        )}
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.section}>
            {user.role === typeRole.waiter ? (
              <View style={styles.menuContainer}>
                {filteredProducts?.length > 0 ? (
                  filteredProducts.map(product => (
                    <MenuCard
                      key={product.name}
                      product={product}
                      orders={orders}
                      setOrders={setOrders}
                      setShowOrderSummary={setShowOrderSummary}
                      quantity={quantities[product.name] || 0}
                      setQuantity={newQuantity =>
                        setQuantities(prev => ({
                          ...prev,
                          [product.name]: newQuantity,
                        }))
                      }
                    />
                  ))
                ) : (
                  <Text>
                    No hay ningun producto que coincida con la busqueda
                  </Text>
                )}
              </View>
            ) : (
              <>
                <View style={styles.container}>
                  <Text style={styles.headerText}>Entrantes</Text>
                  {starters?.length > 0 &&
                    starters.map(starter => (
                      <MenuCard
                        key={starter.uid}
                        product={starter}
                        orders={orders}
                        setOrders={setOrders}
                        setShowOrderSummary={setShowOrderSummary}
                        quantity={quantities[starter.name] || 0}
                        setQuantity={newQuantity =>
                          setQuantities(prev => ({
                            ...prev,
                            [starter.name]: newQuantity,
                          }))
                        }
                      />
                    ))}
                </View>
                <View style={styles.container}>
                  <Text style={styles.headerText}>Menús</Text>
                  {menus?.length > 0 &&
                    menus.map(menu => (
                      <MenuCard
                        key={menu.uid}
                        product={menu}
                        orders={orders}
                        setOrders={setOrders}
                        setShowOrderSummary={setShowOrderSummary}
                        quantity={quantities[menu.name] || 0}
                        setQuantity={newQuantity =>
                          setQuantities(prev => ({
                            ...prev,
                            [menu.name]: newQuantity,
                          }))
                        }
                      />
                    ))}
                </View>
                <View style={styles.container}>
                  <Text style={styles.headerText}>Principal</Text>
                  {mains?.length > 0 &&
                    mains.map(main => (
                      <MenuCard
                        key={main.uid}
                        product={main}
                        orders={orders}
                        setOrders={setOrders}
                        setShowOrderSummary={setShowOrderSummary}
                        quantity={quantities[main.name] || 0}
                        setQuantity={newQuantity =>
                          setQuantities(prev => ({
                            ...prev,
                            [main.name]: newQuantity,
                          }))
                        }
                      />
                    ))}
                </View>
                <View style={styles.container}>
                  <Text style={styles.headerText}>Bebidas</Text>
                  {drinks?.length > 0 &&
                    drinks.map(drink => (
                      <MenuCard
                        key={drink.uid}
                        product={drink}
                        orders={orders}
                        setOrders={setOrders}
                        setShowOrderSummary={setShowOrderSummary}
                        quantity={quantities[drink.name] || 0}
                        setQuantity={newQuantity =>
                          setQuantities(prev => ({
                            ...prev,
                            [drink.name]: newQuantity,
                          }))
                        }
                      />
                    ))}
                </View>
              </>
            )}
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
    backgroundColor: '#6ea9a8',
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
  headerText: {
    paddingHorizontal: 32,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default Restaurant;
