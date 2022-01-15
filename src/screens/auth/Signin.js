import {StatusBar} from 'expo-status-bar'
import React, {useState, useRef} from 'react'

import {ImageBackground, Text, View, Button as RNButton, SafeAreaView, TouchableOpacity} from 'react-native'
import {ListItem} from 'react-native-elements'
import {useFormik} from 'formik'
import * as Yup from 'yup'

import createStyles from '../../styles/base'
import {InputField, ErrorMessage} from '../../components'
import Firebase from '../../config/firebase'

const auth = Firebase.auth()

const LoginSchema = Yup.object().shape({
	email: Yup.string().required('Required'),
	password: Yup.string().required('Required')
})

export default function Signin({navigation}) {
	const [passwordVisibility, setPasswordVisibility] = useState(true)
	const [rightIcon, setRightIcon] = useState('eye')
	const [loginError, setLoginError] = useState('')

	const {handleChange, handleBlur, handleSubmit, values, errors, touched} = useFormik({
		validationSchema: LoginSchema,
		initialValues: {email: '', password: ''},
		onSubmit: (values) => onLogin(values.email, values.password)
	})

	const handlePasswordVisibility = () => {
		if (rightIcon === 'eye') {
			setRightIcon('eye-off')
			setPasswordVisibility(!passwordVisibility)
		} else if (rightIcon === 'eye-off') {
			setRightIcon('eye')
			setPasswordVisibility(!passwordVisibility)
		}
	}

	const onLogin = async (email, password) => {
		try {
			console.log('email', email, password)
			if (email !== '' && password !== '') {
				await auth.signInWithEmailAndPassword(email, password)
			}
		} catch (error) {
			setLoginError('Email or Password are incorrect')
			console.log('error', error)
		}
	}

	const password = useRef(null)

	return (
		<SafeAreaView style={styles.authContainer}>
			<View style={{padding: 10}}>
				<StatusBar style='dark-content' />
				<Text style={styles.authTitle}>Login</Text>
				<Text style={{color: 'red'}}>{!!errors.email && touched.email && errors.email}</Text>
				<InputField
					icon='mail'
					placeholder='Enter your email'
					autoCapitalize='none'
					autoCompleteType='email'
					keyboardType='email-address'
					keyboardAppearance='dark'
					returnKeyType='next'
					returnKeyLabel='next'
					onChangeText={handleChange('email')}
					onBlur={handleBlur('email')}
					error={errors.email}
					touched={touched.email}
					onSubmitEditing={() => password.current?.focus()}
				/>
				<Text style={{color: 'red'}}>{!!errors.password && touched.password && errors.password}</Text>
				<InputField
					ref={password}
					icon='key'
					placeholder='Enter your password'
					secureTextEntry
					autoCompleteType='password'
					autoCapitalize='none'
					keyboardAppearance='dark'
					returnKeyType='go'
					returnKeyLabel='go'
					onChangeText={handleChange('password')}
					onBlur={handleBlur('password')}
					error={errors.password}
					touched={touched.password}
					onSubmitEditing={() => handleSubmit()}
				/>
				{loginError !== '' && <Text style={{color: 'red'}}>{loginError}</Text>}
				<TouchableOpacity
					style={{
						backgroundColor: '#000',
						borderRadius: 5,
						padding: 10,
						marginTop: 15
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
