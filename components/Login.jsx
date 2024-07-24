import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from '@react-native-firebase/auth';
import {doc, getDoc, setDoc} from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import logo from '../assets/logo.png';
import {FirebaseContext} from '../App';
import EyeOpen from './icons/EyeOpen';
import EyeClosed from './icons/EyeClosed';

const Login = () => {
  const [registering, setRegistering] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const {token} = useContext(FirebaseContext);

  const handleSubmit = async e => {
    e.preventDefault();

    if (!registering) {
      try {
        await signInWithEmailAndPassword(auth(), email, password);
        setError('');
        const user = auth().currentUser;

        const userDocRef = doc(firestore(), 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists) {
          const userData = userDoc.data();
          const userRole = userData.role;

          if (userRole === 'Camarero') {
            navigation.navigate('HomeWaiter');
          } else {
            navigation.navigate('Home');
          }
          //guardar o actualizar el token para el usuario que sea
          await setDoc(userDocRef, {token: token, ...userDoc.data()});
        } else {
          console.log('no entra'); // Si el documento del usuario no existe
        }
      } catch (err) {
        if (err.code === 'auth/user-not-found') {
          setError('Error: El usuario es incorrecto');
        } else if (err.code === 'auth/wrong-password') {
          setError('Error: La contraseña es incorrecta');
        } else {
          setError(err.message);
          console.error('Error:', err.message);
        }
      }
    } else {
      try {
        const {user} = await createUserWithEmailAndPassword(
          auth(),
          email,
          password,
        );
        const userData = {email, name, phone, token, uidUser: user.uid};
        const userRef = doc(firestore(), 'users', user.uid);
        await setDoc(userRef, userData);
        setError('');
        navigation.navigate('Home');
      } catch (err) {
        if (err.code === 'auth/weak-password') {
          setError(
            'Error: La contraseña es demasiado débil. Debe tener al menos 6 caracteres.',
          );
        } else if (err.code === 'auth/email-already-in-use') {
          setError('Error: Este correo ya ha sido registrado');
        } else {
          setError(err.message);
          console.error('Error:', err.message);
        }
      }
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.title}>
          {!registering ? 'Iniciar sesión' : 'Registrarse'}
        </Text>
      </View>
      <View style={styles.formContainer}>
        {registering && (
          <>
            <Text style={styles.label}>Nombre*</Text>
            <TextInput
              style={styles.input}
              autoComplete="name"
              value={name}
              onChangeText={setName}
            />
            <Text style={styles.label}>Teléfono*</Text>
            <TextInput
              style={styles.input}
              autoComplete="phone"
              keyboardType="numeric"
              value={phone}
              onChangeText={setPhone}
            />
          </>
        )}
        <Text style={styles.label}>Correo electrónico*</Text>
        <TextInput
          style={styles.input}
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
        />
        <Text style={styles.label}>Contraseña*</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputWithIcon}
            autoComplete="password"
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            value={password}
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.icon}>
            {isPasswordVisible ? (
              <EyeOpen size={24} color="#38b2ac" />
            ) : (
              <EyeClosed size={24} color="#38b2ac" />
            )}
          </TouchableOpacity>
        </View>
        <Button
          title={!registering ? 'Iniciar sesión' : 'Registrarse'}
          onPress={handleSubmit}
          color="#38b2ac"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Text style={styles.switchText}>
          {!registering ? (
            <>
              {'¿No tienes cuenta? '}
              <Text
                onPress={() => {
                  setRegistering(!registering);
                  setError('');
                }}
                style={styles.switchLink}>
                Regístrate
              </Text>
            </>
          ) : (
            <Text
              onPress={() => {
                setRegistering(!registering);
                setError('');
              }}
              style={styles.switchLink}>
              Inicia sesión
            </Text>
          )}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#38b2ac',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: '50%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  title: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  formContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginVertical: 10,
  },
  passwordContainer: {
    position: 'relative',
    marginVertical: 10,
  },
  inputWithIcon: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    paddingRight: 40,
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{translateY: -12}],
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  switchText: {
    marginTop: 20,
    textAlign: 'center',
  },
  switchLink: {
    color: '#008080',
  },
});

export default Login;
