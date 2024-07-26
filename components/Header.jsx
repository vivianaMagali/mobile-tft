import React, {useContext, useEffect, useState} from 'react';
import {View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import WaitTime from './WaitTime';
import CallToWaiter from './CallToWaiter';
import Record from './Record';
import logo from '../assets/logo.png';
import waiter from '../assets/camarero.png';
import order from '../assets/comida.png';
import profile from '../assets/profile.png';
import recordImg from '../assets/record-logo.png';
import {FirebaseContext} from '../App';
import firestore from '@react-native-firebase/firestore';

const Header = () => {
  const navigation = useNavigation();
  const {user} = useContext(FirebaseContext);
  const [record, setRecord] = useState([]);
  const [callToWaiter, setCallToWaiter] = useState(false);
  const [showWaitTime, setShowWaitTime] = useState(false);
  const [showRecord, setShowRecord] = useState(false);
  const [table, setTable] = useState();

  const localRecord = record.find(
    rcd => rcd.category === 'local' && rcd.paymentStatus === false,
  );

  useEffect(() => {
    if (localRecord) {
      setTable(localRecord.table);
    } else {
      setTable(undefined);
    }
  }, [localRecord, record]);

  useEffect(() => {
    if (user && !user?.role) {
      const recordCollectionRef = firestore()
        .collection('users')
        .doc(user?.uid)
        .collection('record');
      const unsubscribeRecord = recordCollectionRef.onSnapshot(
        snapshot => {
          setRecord(
            snapshot.docs.map(docRecord => {
              const data = docRecord.data();
              return data;
            }),
          );
        },
        error => {
          console.error('Error al suscribirse a onSnapshot: ', error);
        },
      );
      return () => unsubscribeRecord();
    }
  }, [user]);

  const goHome = () => {
    navigation.navigate('Home');
  };

  const goProfile = () => {
    user ? navigation.navigate('Profile') : navigation.navigate('Login');
  };

  return (
    <FirebaseContext.Provider value={{user, record}}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => !user?.role && goHome()}>
          <Image style={styles.logo} source={logo} />
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          {callToWaiter && (
            <CallToWaiter setCallToWaiter={setCallToWaiter} table={table} />
          )}
          {table && (
            <TouchableOpacity onPress={() => setCallToWaiter(true)}>
              <Image style={styles.icon} source={waiter} />
            </TouchableOpacity>
          )}
          {showWaitTime && <WaitTime setShowWaitTime={setShowWaitTime} />}
          <TouchableOpacity onPress={() => setShowWaitTime(true)}>
            <Image style={styles.logo} source={order} />
          </TouchableOpacity>
          {showRecord && <Record setShowRecord={setShowRecord} />}
          <TouchableOpacity onPress={() => setShowRecord(true)}>
            <Image style={styles.icon} source={recordImg} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={goProfile}>
          <Image style={styles.logo} source={profile} />
        </TouchableOpacity>
      </View>
    </FirebaseContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    width: 96,
    height: 96,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
    alignItems: 'center',
    spaceBetween: 10,
  },
  icon: {
    width: 54,
    height: 54,
  },
  profileButton: {
    marginLeft: 'auto',
  },
});

export default Header;
