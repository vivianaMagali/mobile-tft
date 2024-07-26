import React, {useContext, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {FirebaseContext} from '../App';
import {typeProducts, typeRole} from '../utils';

const MenuCard = ({
  product,
  orders,
  setOrders,
  setShowOrderSummary,
  quantity,
  setQuantity,
}) => {
  const {user} = useContext(FirebaseContext);

  useEffect(() => {
    if (orders.length > 0) {
      setShowOrderSummary(true);
    }
  }, [orders, setShowOrderSummary]);

  const addProduct = () => {
    setQuantity(quantity + 1);
    let updatedOrders = [...orders];
    const existingItem = updatedOrders.find(item => item.name === product.name);

    if (existingItem) {
      updatedOrders = updatedOrders.map(item =>
        item.name === product.name ? {...item, amount: item.amount + 1} : item,
      );
    } else {
      updatedOrders = [...orders, {...product, amount: 1}];
    }
    setOrders(updatedOrders);
  };

  const removeProduct = () => {
    setQuantity(quantity - 1);
    let updatedOrders = [...orders];
    updatedOrders = updatedOrders
      .map(item => {
        if (item.name === product.name) {
          if (item.amount !== 1) {
            return {...item, amount: item.amount - 1};
          } else {
            return null;
          }
        } else {
          return item;
        }
      })
      .filter(item => item !== null);
    setOrders(updatedOrders);
  };

  return (
    <ScrollView>
      <View
        style={[
          styles.card,
          product.type === typeProducts.drink && styles.cardDrink,
        ]}>
        {user?.role !== typeRole.waiter && (
          <View style={styles.imageContainer}>
            <Image source={{uri: product.img}} style={styles.image} />
          </View>
        )}

        <View
          style={[
            styles.details,
            user?.role === typeRole.waiter && styles.detailsNoImage,
            product.type === typeProducts.drink && styles.detailsDrink,
          ]}>
          <Text style={styles.productName}>{product.name}</Text>
          {product.type !== typeProducts.drink && (
            <Text style={styles.productIngredients}>{product.ingredients}</Text>
          )}
          <View style={styles.footer}>
            <Text style={styles.productPrice}>{product.price}€</Text>
            <View style={styles.quantityContainer}>
              {quantity !== 0 && (
                <TouchableOpacity style={styles.button} onPress={removeProduct}>
                  <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
              )}
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity style={styles.button} onPress={addProduct}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginVertical: 10,
    marginHorizontal: 10,
    height: 180,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  cardDrink: {
    height: 120,
  },
  imageContainer: {
    width: '40%',
    height: '100%',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  details: {
    padding: 15,
    justifyContent: 'space-between',
    width: '60%',
  },
  detailsNoImage: {
    width: '100%',
  },
  detailsDrink: {
    height: '100%',
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#008080',
    textTransform: 'uppercase',
  },
  productIngredients: {
    fontSize: 16,
    color: '#777',
    marginTop: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    padding: 10,
    backgroundColor: '#008080',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
  },
  quantityText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default MenuCard;
