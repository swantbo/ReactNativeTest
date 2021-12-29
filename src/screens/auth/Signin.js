import {StatusBar} from 'expo-status-bar'
import React from 'react'
import {useState} from 'react'
import {ImageBackground, Text, View, Button as RNButton, SafeAreaView, TouchableOpacity} from 'react-native'
import {ListItem} from 'react-native-elements'

import createStyles from '../../styles/base'
import {InputField, ErrorMessage} from '../../components'
import Firebase from '../../config/firebase'

const auth = Firebase.auth()

export default function Signin({navigation}) {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [passwordVisibility, setPasswordVisibility] = useState(true)
	const [rightIcon, setRightIcon] = useState('eye')
	const [loginError, setLoginError] = useState('')

	const handlePasswordVisibility = () => {
		if (rightIcon === 'eye') {
			setRightIcon('eye-off')
			setPasswordVisibility(!passwordVisibility)
		} else if (rightIcon === 'eye-off') {
			setRightIcon('eye')
			setPasswordVisibility(!passwordVisibility)
		}
	}

	const onLogin = async () => {
		try {
			if (email !== '' && password !== '') {
				await auth.signInWithEmailAndPassword(email, password)
			}
		} catch (error) {
			setLoginError(error.message)
		}
	}

	return (
		<SafeAreaView style={styles.authContainer}>
			<View style={{padding: 10}}>
				<StatusBar style='dark-content' />
				<Text style={styles.authTitle}>Login</Text>
				<InputField
					inputStyle={{
						fontSize: 14
					}}
					containerStyle={styles.inputField}
					leftIcon='email'
					placeholder='Enter email'
					autoCapitalize='none'
					keyboardType='email-address'
					textContentType='emailAddress'
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
					textContentType='password'
					rightIcon={rightIcon}
					value={password}
					onChangeText={(text) => setPassword(text)}
					handlePasswordVisibility={handlePasswordVisibility}
				/>
				{loginError ? <ErrorMessage error={loginError} visible={true} /> : null}
				<TouchableOpacity
					style={{
						backgroundColor: '#000',
						borderRadius: 5,
						padding: 10
					}}
					onPress={() => onLogin()}>
					<ListItem.Title
						style={{
							color: '#fff',
							alignSelf: 'center',
							fontWeight: 'bold'
						}}>
						Login
					</ListItem.Title>
				</TouchableOpacity>
				<RNButton onPress={() => navigation.navigate('Signup')} title='Go to Signup' color='#000000' />
				<RNButton onPress={() => navigation.navigate('ForgotPassword')} title='Forgot Password?' color='#000000' />
			</View>
			<ImageBackground source={require('../../assets/123_1.jpeg')} style={styles.authImage} resizeMode='cover'></ImageBackground>
		</SafeAreaView>
	)
}

const styles = createStyles()

// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: '#fff',
// 		paddingTop: 50,
// 		paddingHorizontal: 12
// 	},
// 	title: {
// 		fontSize: 24,
// 		fontWeight: '600',
// 		color: '#000000',
// 		alignSelf: 'center',
// 		paddingBottom: 24
// 	},
// 	image: {
// 		flex: 1,
// 		justifyContent: 'center',
// 		opacity: 0.5
// 	}
// })
