import React, {useContext, useState} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import WaitTime from './WaitTime';
import CallToWaiter from './CallToWaiter';
import Record from './Record';

// Importa las imágenes
import logo from '../assets/logo.png';
import waiter from '../assets/camarero.png';
import order from '../assets/comida.png';
import profile from '../assets/logo_perfil.png';
// import recordImg from '../assets/record_logo.png';
import {FirebaseContext} from '../App';

const Header = () => {
  const navigation = useNavigation();
  const {user, record} = useContext(FirebaseContext);
  const [callToWaiter, setCallToWaiter] = useState(false);
  const [showWaitTime, setShowWaitTime] = useState(false);
  const [showRecord, setShowRecord] = useState(false);

  const goHome = () => {
    navigation.navigate('Home');
  };

  const goProfile = () => {
    navigation.navigate('Profile');
  };

  const localRecord = record.find(rcd => rcd.category === 'local');

  return (
    <View style={styles.container}>
      {showWaitTime && <WaitTime setShowWaitTime={setShowWaitTime} />}
      <TouchableOpacity onPress={() => !user?.role && goHome()}>
        <Image style={styles.logo} source={logo} />
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        {callToWaiter && <CallToWaiter setCallToWaiter={setCallToWaiter} />}
        {localRecord && (
          <TouchableOpacity onPress={() => setCallToWaiter(true)}>
            <Image style={styles.icon} source={waiter} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => setShowWaitTime(true)}>
          <Image style={styles.iconLarge} source={order} />
        </TouchableOpacity>
        {showRecord && <Record setShowRecord={setShowRecord} />}
        <TouchableOpacity onPress={() => setShowRecord(true)}>
          <Image style={styles.icon} source={profile} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.profileButton} onPress={goProfile}>
        <Image style={styles.icon} source={waiter} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#6ea9a8',
    width: '100%',
  },
  logo: {
    width: 64,
    height: 64,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
    alignItems: 'center',
    spaceBetween: 10,
  },
  icon: {
    width: 40,
    height: 40,
  },
  iconLarge: {
    width: 48,
    height: 48,
  },
  recordIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordText: {
    color: '#00bcd4', // Cambia esto según el color
  },
  profileButton: {
    marginLeft: 'auto',
  },
  profileIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    color: '#00bcd4', // Cambia esto según el color
  },
});

export default Header;
