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
	const [dob, setDob] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [checkPassword, setCheckPassword] = useState('')
	const [passwordVisibility, setPasswordVisibility] = useState(true)
	const [checkPasswordVisibility, setCheckPasswordVisibility] = useState(true)
	const [referral, setReferral] = useState('')
	const [rightIcon, setRightIcon] = useState('eye')
	const [checkRightIcon, setCheckRightIcon] = useState('eye')
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

	const handleCheckPasswordVisibility = () => {
		if (checkRightIcon === 'eye') {
			setCheckRightIcon('eye-off')
			setCheckPasswordVisibility(!checkPasswordVisibility)
		} else if (checkRightIcon === 'eye-off') {
			setCheckRightIcon('eye')
			setCheckPasswordVisibility(!checkPasswordVisibility)
		}
	}

	const passwordMatch = (value) => {
		setCheckPassword(value)
		if (value !== password) {
			setSignupError('Passwords do not match')
		} else {
			setSignupError('')
		}
	}

	const onPhoneChange = (value, type) => {
		const phoneNumber = value.replace(/[^\d]/g, '')
		const phoneNumberLength = phoneNumber.length
		if (phoneNumberLength < 4) {
			type !== 'referral' ? setPhone(phoneNumber) : setReferral(phoneNumber)
		}
		if (phoneNumberLength < 7) {
			type !== 'referral' ? setPhone(`(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`) : setReferral(`(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`)
		}
		type !== 'referral' ? setPhone(`(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`) : setReferral(`(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`)
	}

	const onHandleSignup = async () => {
		try {
			if (password !== checkPassword) {
				setSignupError('Passwords do not match')
			} else {
				if (email && phone && name && dob && password && checkPassword) {
					await auth.createUserWithEmailAndPassword(email, password).then((data) => {
						const user = {
							email: email,
							phone: phone,
							name: name,
							referral: referral,
							dob: dob,
							points: '0',
							strikes: '0',
							created: Firebase.firestore.Timestamp.now()
						}
						Firebase.firestore().collection('users').doc(data.user.uid).set(user)
						Firebase.firestore().collection('users').doc(data.user.uid).collection('Haircuts').set()
					})
				} else {
					setSignupError('Please enter all fields')
				}
			}
		} catch (error) {
			setSignupError(error.message)
		}
	}

	return (
		<SafeAreaView style={styles.authContainer}>
			<View style={{padding: 10}}>
				<StatusBar style='dark-content' />
				<Text style={styles.authTitle}>Create Account</Text>
				<InputField
					inputStyle={{
						fontSize: 14
					}}
					containerStyle={styles.inputField}
					leftIcon='account'
					placeholder='Name'
					autoCapitalize='none'
					value={name}
					onChangeText={(text) => setName(text)}
				/>
				<InputField
					inputStyle={{
						fontSize: 14
					}}
					containerStyle={styles.inputField}
					leftIcon='phone'
					placeholder='(___)-___-____'
					autoCapitalize='none'
					keyboardType='phone-pad'
					value={phone}
					onChangeText={(text) => onPhoneChange(text, 'phone')}
				/>
				<InputField
					inputStyle={{
						fontSize: 14
					}}
					containerStyle={styles.inputField}
					leftIcon='account-supervisor'
					placeholder='(___)-___-____ (Referrals phone Optional)'
					autoCapitalize='none'
					keyboardType='phone-pad'
					autoCorrect={false}
					value={referral}
					onChangeText={(text) => onPhoneChange(text, 'referral')}
				/>
				<InputField
					inputStyle={{
						fontSize: 14
					}}
					containerStyle={styles.inputField}
					leftIcon='cake'
					placeholder='mm/dd/yyyy'
					autoCapitalize='none'
					keyboardType='phone-pad'
					value={dob}
					onChangeText={(text) => setDob(text)}
				/>
				<InputField
					inputStyle={{
						fontSize: 14
					}}
					containerStyle={styles.inputField}
					leftIcon='email'
					placeholder='Email'
					autoCapitalize='none'
					keyboardType='email-address'
					value={email}
					onChangeText={(text) => setEmail(text)}
				/>
				<InputField
					inputStyle={{
						fontSize: 14
					}}
					containerStyle={styles.inputField}
					leftIcon='lock'
					placeholder='Password'
					autoCapitalize='none'
					autoCorrect={false}
					secureTextEntry={passwordVisibility}
					rightIcon={rightIcon}
					value={password}
					onChangeText={(text) => setPassword(text)}
					handlePasswordVisibility={handlePasswordVisibility}
				/>
				<InputField
					inputStyle={{
						fontSize: 14
					}}
					containerStyle={styles.inputField}
					leftIcon='lock'
					placeholder='Verify Password'
					autoCapitalize='none'
					autoCorrect={false}
					secureTextEntry={checkPasswordVisibility}
					rightIcon={checkRightIcon}
					value={checkPassword}
					onChangeText={(text) => passwordMatch(text)}
					handlePasswordVisibility={handleCheckPasswordVisibility}
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
