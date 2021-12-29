import {StatusBar} from 'expo-status-bar'
import React from 'react'
import {useState} from 'react'
import {ImageBackground, Text, View, Button as RNButton, SafeAreaView, TouchableOpacity} from 'react-native'
import {ListItem} from 'react-native-elements'

import createStyles from '../../styles/base'
import {InputField, ErrorMessage} from '../../components'
import Firebase from '../../config/firebase'

const auth = Firebase.auth()

export default function Signup({navigation}) {
	const [name, setName] = useState('')
	const [phone, setPhone] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [passwordVisibility, setPasswordVisibility] = useState(true)
	const [referral, setReferral] = useState('')
	const [rightIcon, setRightIcon] = useState('eye')
	const [signupError, setSignupError] = useState('')

	const handlePasswordVisibility = () => {
		if (rightIcon === 'eye') {
			setRightIcon('eye-off')
			setPasswordVisibility(!passwordVisibility)
		} else if (rightIcon === 'eye-off') {
			setRightIcon('eye')
			setPasswordVisibility(!passwordVisibility)
		}
	}

	const onHandleSignup = async () => {
		try {
			if (email !== '' && password !== '') {
				await auth.createUserWithEmailAndPassword(email, password).then((data) => {
					const user = {
						email: email,
						phone: phone,
						name: name,
						referral: referral,
						points: '0',
						strikes: '0',
						created: Firebase.firestore.Timestamp.now()
					}
					Firebase.firestore().collection('users').doc(data.user.uid).set(user)
					Firebase.firestore().collection('users').doc(data.user.uid).collection('Haircuts').set()
				})
			}
		} catch (error) {
			setSignupError(error.message)
		}
	}

	return (
		<SafeAreaView style={styles.authContainer}>
			<View style={{padding: 10}}>
				<StatusBar style='dark-content' />
				<Text style={styles.authTitle}>Create An Account</Text>
				<InputField
					inputStyle={{
						fontSize: 14
					}}
					containerStyle={styles.inputField}
					leftIcon='account'
					placeholder='Enter name'
					autoCapitalize='none'
					autoFocus={true}
					value={name}
					onChangeText={(text) => setName(text)}
				/>
				<InputField
					inputStyle={{
						fontSize: 14
					}}
					containerStyle={styles.inputField}
					leftIcon='phone'
					placeholder='Enter phone number'
					autoCapitalize='none'
					keyboardType='phone-pad'
					autoFocus={true}
					value={phone}
					onChangeText={(text) => setPhone(text)}
				/>
				<InputField
					inputStyle={{
						fontSize: 14
					}}
					containerStyle={styles.inputField}
					leftIcon='account-supervisor'
					placeholder='Enter Phone Number of Referral(optional)'
					autoCapitalize='none'
					keyboardType='phone-pad'
					autoCorrect={false}
					value={referral}
					onChangeText={(text) => setReferral(text)}
				/>
				<InputField
					inputStyle={{
						fontSize: 14
					}}
					containerStyle={styles.inputField}
					leftIcon='email'
					placeholder='Enter email'
					autoCapitalize='none'
					keyboardType='email-address'
					autoFocus={true}
					value={email}
					onChangeText={(text) => setEmail(text)}
				/>
				<InputField
					inputStyle={{
						fontSize: 14
					}}
					containerStyle={styles.inputField}
					leftIcon='lock'
					placeholder='Enter password'
					autoCapitalize='none'
					autoCorrect={false}
					secureTextEntry={passwordVisibility}
					rightIcon={rightIcon}
					value={password}
					onChangeText={(text) => setPassword(text)}
					handlePasswordVisibility={handlePasswordVisibility}
				/>
				{signupError ? <ErrorMessage error={signupError} visible={true} /> : null}
				<TouchableOpacity
					style={{
						backgroundColor: '#000',
						borderRadius: 5,
						padding: 10
					}}
					onPress={() => onHandleSignup()}>
					<ListItem.Title
						style={{
							color: '#fff',
							alignSelf: 'center',
							fontWeight: 'bold'
						}}>
						Create Account
					</ListItem.Title>
				</TouchableOpacity>
				<RNButton onPress={() => navigation.navigate('Login')} title='Go to Login' color='#000000' />
				<ImageBackground source={require('../../assets/123_1.jpeg')} style={styles.authImage} resizeMode='cover'></ImageBackground>
			</View>
		</SafeAreaView>
	)
}

const styles = createStyles()
