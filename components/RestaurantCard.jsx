import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import PhoneIcon from './icons/PhoneIcon';
import ClockIcon from './icons/ClockIcon';
import MapPinIcon from './icons/MapPinIcon';
import Geolocation from 'react-native-geolocation-service';
import {haversineDistance} from '../utils';

const RestaurantCard = ({restaurant}) => {
  const [locationCurrent, setLocationCurrent] = useState(null);
  const [distance, setDistance] = useState();

  useEffect(() => {
    const calculateDistance = async () => {
      const restaurantLocation = {
        latitude: restaurant.basic_information.latitude,
        longitude: restaurant.basic_information.longitude,
      };
      const dist = haversineDistance(
        locationCurrent?.coords,
        restaurantLocation,
      );
      setDistance(dist);
    };

    calculateDistance();
  }, [
    locationCurrent,
    restaurant.basic_information.latitude,
    restaurant.basic_information.longitude,
  ]);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('whenInUse');
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permiso de Localización',
            message: 'La aplicación necesita acceso a tu ubicación.',
            buttonNeutral: 'Preguntar después',
            buttonNegative: 'Cancelar',
            buttonPositive: 'Aceptar',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getLocation();
          console.log('Permiso de localización concedido');
        } else {
          console.log('Permiso de localización denegado');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setLocationCurrent(position);
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  return (
    <View style={styles.card}>
      <Image
        style={styles.image}
        source={{uri: restaurant.img}}
        alt="Sunset in the mountains"
      />
      <View style={styles.infoContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{restaurant.basic_information.name}</Text>
          <Text style={styles.tag}>
            {restaurant.basic_information.kind_food}
          </Text>
        </View>

        <View style={styles.info}>
          <MapPinIcon size={16} color="#38b2ac" />
          <Text style={styles.text}>
            {restaurant.basic_information.direction}
          </Text>
        </View>
        <View style={styles.info}>
          <ClockIcon size={16} color="#38b2ac" />
          <Text style={styles.text}>
            {restaurant.basic_information.schedule}
          </Text>
        </View>
        <View style={styles.info}>
          <PhoneIcon size={16} color="#38b2ac" />
          <Text style={styles.text}>{restaurant.basic_information.phone}</Text>
        </View>
      </View>
      {!Number.isNaN(distance) ? (
        <View style={styles.distanceContainer}>
          <Text style={styles.distanceText}>
            Distancia: {distance?.toFixed(2)} km
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 3,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 250,
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 160,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  tag: {
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#4a5568',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  text: {
    fontSize: 12,
    color: '#4a5568',
    marginLeft: 8,
  },
  distanceContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  distanceText: {
    fontSize: 12,
  },
});

export default RestaurantCard;
