import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useState } from 'react';
import { ImageBackground, StyleSheet, Text, View, Button as RNButton } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Button, InputField, ErrorMessage } from '../components';
import Firebase from '../config/firebase';
import * as firebase from 'firebase';

const auth = Firebase.auth();


export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [referral, setReferral] = useState('');
  const [rightIcon, setRightIcon] = useState('eye');
  const [signupError, setSignupError] = useState('');

  const handlePasswordVisibility = () => {
    if (rightIcon === 'eye') {
      setRightIcon('eye-off');
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === 'eye-off') {
      setRightIcon('eye');
      setPasswordVisibility(!passwordVisibility);
    }
  };

  const onHandleSignup = async () => {
    try {
      if (email !== '' && password !== '') {
        await auth.createUserWithEmailAndPassword(email, password).then(data => {  
          const user = {
              email: email,
              phone: phone,
              name: name,
              referral: referral,
              points: '0',
              strikes: '0'
          };
          firebase.firestore().collection('users').doc(data.user.uid).set(user);
      })}
    } catch (error) {
      setSignupError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style='dark-content' />
      <Text style={styles.title}>Create new account</Text>
      <InputField
        inputStyle={{
          fontSize: 14
        }}
        containerStyle={{
          backgroundColor: '#fff',
          marginBottom: 20,
          borderColor: 'black', 
          borderWidth: 1
        }}
        leftIcon='account'
        placeholder='Enter name'
        autoCapitalize='none'
        autoFocus={true}
        value={name}
        onChangeText={text => setName(text)}
      />
      <InputField
        inputStyle={{
          fontSize: 14
        }}
        containerStyle={{
          backgroundColor: '#fff',
          marginBottom: 20,
          borderColor: 'black', 
          borderWidth: 1
        }}
        leftIcon='phone'
        placeholder='Enter phone number'
        autoCapitalize='none'
        keyboardType='phone-pad'
        autoFocus={true}
        value={phone}
        onChangeText={text => setPhone(text)}
      />
      <InputField
        inputStyle={{
          fontSize: 14,
        }}
        containerStyle={{
          backgroundColor: '#fff',
          marginBottom: 20,
          borderColor: 'black', 
          borderWidth: 1
        }}
        leftIcon='account-supervisor'
        placeholder='Enter name of Referral'
        autoCapitalize='none'
        autoCorrect={false}
        value={referral}
        onChangeText={text => setReferral(text)}
      />
      <InputField
        inputStyle={{
          fontSize: 14
        }}
        containerStyle={{
          backgroundColor: '#fff',
          marginBottom: 20,
          borderColor: 'black', 
          borderWidth: 1
        }}
        leftIcon='email'
        placeholder='Enter email'
        autoCapitalize='none'
        keyboardType='email-address'
        autoFocus={true}
        value={email}
        onChangeText={text => setEmail(text)}
      />
      <InputField
        inputStyle={{
          fontSize: 14,
        }}
        containerStyle={{
          backgroundColor: '#fff',
          marginBottom: 20,
          borderColor: 'black', 
          borderWidth: 1
        }}
        leftIcon='lock'
        placeholder='Enter password'
        autoCapitalize='none'
        autoCorrect={false}
        secureTextEntry={passwordVisibility}
        rightIcon={rightIcon}
        value={password}
        onChangeText={text => setPassword(text)}
        handlePasswordVisibility={handlePasswordVisibility}
      />
      {signupError ? <ErrorMessage error={signupError} visible={true} /> : null}
      <Button
        onPress={onHandleSignup}
        backgroundColor='#000000'
        title='Signup'
        tileColor='#fff'
        titleSize={20}
        containerStyle={{
          marginBottom: 24
        }}
      />
      <RNButton
        onPress={() => navigation.navigate('Login')}
        title='Go to Login'
        color='#000000'
      />
      <ImageBackground source={require('../assets/123_1.jpeg')} style={ styles.image} resizeMode="cover"> 
        
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 12
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
    alignSelf: 'center',
    paddingBottom: 24
  },
  image: {
    flex: 1,
    justifyContent: "center",
    opacity:0.5
  },
});