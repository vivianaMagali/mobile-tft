import React, {useContext, useState} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
// import { useNavigation } from '@react-navigation/native';
import {FirebaseContext} from '../firebase';
// import RestaurantSearch from "./RestaurantSearch";
// import WaitTime from "./WaitTime";
// import CallToWaiter from "./CallToWaiter";
// import Record from "./Record";

// Import your images
const logo = require('../assets/logo.png');
const waiter = require('../assets/camarero.png');
const order = require('../assets/comida.png');

const Footer = () => {
  // const navigation = useNavigation();
  // const { user, record } = useContext(FirebaseContext);
  const [callToWaiter, setCallToWaiter] = useState(false);
  const [showWaitTime, setShowWaitTime] = useState(false);
  const [showRecord, setShowRecord] = useState(false);

  // const goHome = () => {
  //   navigation.navigate("Home");
  // };

  // const goProfile = () => {
  //   navigation.navigate("Profile");
  // };

  return (
    <View style={styles.footer}>
      {/* {showWaitTime && <WaitTime setShowWaitTime={setShowWaitTime} />} */}
      <TouchableOpacity
      // onPress={() => {
      //   !user?.role && goHome();
      // }}
      >
        <Image source={logo} style={styles.logo} />
      </TouchableOpacity>
      {/* {!user?.role && ( */}
      <>
        {/* <RestaurantSearch /> */}
        {/* {callToWaiter && <CallToWaiter setCallToWaiter={setCallToWaiter} />}
          {record.length > 0 &&
            record.map(
              (rcd, index) =>
                rcd.category === "local" && (
                  <TouchableOpacity key={index} onPress={() => setCallToWaiter(true)}>
                    <Image source={waiter} style={styles.icon} />
                  </TouchableOpacity>
                )
            )} */}
        <TouchableOpacity onPress={() => setShowWaitTime(true)}>
          <Image source={order} style={styles.icon} />
        </TouchableOpacity>
        {/* {showRecord && <Record setShowRecord={setShowRecord} />} */}
        <TouchableOpacity onPress={() => setShowRecord(true)}>
          <Text style={styles.textIcon}>📋</Text>
        </TouchableOpacity>
      </>
      {/* )} */}
      {/* <TouchableOpacity onPress={() => goProfile()}>
        <Text style={styles.textIcon}>👤</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#38B2AC',
    position: 'absolute',
    bottom: 0,
  },
  logo: {
    width: 64,
    height: 64,
  },
  icon: {
    width: 40,
    height: 40,
  },
  textIcon: {
    fontSize: 24,
    color: '#B2F5EA',
  },
});

export default Footer;
