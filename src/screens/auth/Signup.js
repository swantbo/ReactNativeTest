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
	firstName: Yup.string().required('Required'),
	lastName: Yup.string().required('Required'),
	dob: Yup.string().required('Required'),
	referral: Yup.string(),
	phone: Yup.string().required('Required'),
	email: Yup.string().required('Required'),
	password: Yup.string().required('Required'),
	verfiyPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
})

export default function Signup({navigation}) {
	const [passwordVisibility, setPasswordVisibility] = useState(true)
	const [rightIcon, setRightIcon] = useState('eye')
	const [signupError, setSignupError] = useState('')

	const {handleChange, handleBlur, handleSubmit, values, errors, touched} = useFormik({
		validationSchema: LoginSchema,
		initialValues: {firstName: '', lastName: '', dob: '', referral: '', phone: '', email: '', password: '', verfiyPassword: ''},
		onSubmit: (values) => onHandleSignup(values)
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

	const onHandleSignup = async () => {
		try {
			await auth.createUserWithEmailAndPassword(values.email, values.password).then((data) => {
				const user = {
					email: values.email,
					phone: values.phone,
					name: values.name,
					referral: values.referral,
					dob: values.dob,
					points: '0',
					strikes: '0',
					created: Firebase.firestore.Timestamp.now()
				}
				Firebase.firestore().collection('users').doc(data.user.uid).set(user)
				Firebase.firestore().collection('users').doc(data.user.uid).collection('Haircuts').set()
			})
		} catch (error) {
			setSignupError('Unable to sign up')
		}
	}

	const lastName = useRef(null)
	const email = useRef(null)
	const dob = useRef(null)
	const referral = useRef(null)
	const phone = useRef(null)
	const password = useRef(null)
	const verfiyPassword = useRef(null)

	return (
		<SafeAreaView style={styles.authContainer}>
			<View style={{padding: 10}}>
				<StatusBar style='dark-content' />
				<Text style={styles.authTitle}>Register</Text>
				<Text style={{color: 'red'}}>{!!errors.firstName && touched.firstName && errors.firstName}</Text>
				<InputField
					icon='user'
					placeholder='First name'
					autoCapitalize='none'
					autoCompleteType='email'
					keyboardType='normal'
					keyboardAppearance='dark'
					returnKeyType='next'
					returnKeyLabel='next'
					onChangeText={handleChange('firstName')}
					onBlur={handleBlur('firstName')}
					error={errors.firstName}
					touched={touched.firstName}
					onSubmitEditing={() => lastName.current?.focus()}
				/>
				<Text style={{color: 'red'}}>{!!errors.lastName && touched.lastName && errors.lastName}</Text>
				<InputField
					ref={lastName}
					icon='user'
					placeholder='Last name'
					autoCapitalize='none'
					autoCompleteType='email'
					keyboardType='normal'
					keyboardAppearance='dark'
					returnKeyType='next'
					returnKeyLabel='next'
					onChangeText={handleChange('lastName')}
					onBlur={handleBlur('lastName')}
					error={errors.lastName}
					touched={touched.lastName}
					onSubmitEditing={() => referral.current?.focus()}
				/>
				<Text style={{color: 'red'}}>{!!errors.referral && touched.referral && errors.referral}</Text>
				<InputField
					ref={referral}
					icon='user'
					placeholder='Phone number of refferal(optional)'
					autoCapitalize='none'
					autoCompleteType='email'
					keyboardType='normal'
					keyboardAppearance='dark'
					returnKeyType='next'
					returnKeyLabel='next'
					onChangeText={handleChange('referral')}
					onBlur={handleBlur('referral')}
					error={errors.referral}
					touched={touched.referral}
					onSubmitEditing={() => dob.current?.focus()}
				/>
				<Text style={{color: 'red'}}>{!!errors.dob && touched.dob && errors.dob}</Text>
				<InputField
					ref={dob}
					icon='cake'
					placeholder='Enter your birthday'
					autoCapitalize='none'
					autoCompleteType='email'
					keyboardType='normal'
					keyboardAppearance='dark'
					returnKeyType='next'
					returnKeyLabel='next'
					onChangeText={handleChange('dob')}
					onBlur={handleBlur('dob')}
					error={errors.dob}
					touched={touched.dob}
					onSubmitEditing={() => phone.current?.focus()}
				/>
				<Text style={{color: 'red'}}>{!!errors.phone && touched.phone && errors.phone}</Text>
				<InputField
					ref={phone}
					icon='phone'
					placeholder='Enter your phone'
					autoCapitalize='none'
					autoCompleteType='email'
					keyboardType='number-pad'
					keyboardAppearance='dark'
					returnKeyType='next'
					returnKeyLabel='next'
					onChangeText={handleChange('phone')}
					onBlur={handleBlur('phone')}
					error={errors.phone}
					touched={touched.phone}
					onSubmitEditing={() => email.current?.focus()}
				/>
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
				{!!errors.verfiyPassword && touched.verfiyPassword && <Text style={{color: 'red'}}>{errors.verfiyPassword}</Text>}
				<InputField
					ref={password}
					icon='key'
					placeholder='Enter your password'
					secureTextEntry
					autoCompleteType='password'
					autoCapitalize='none'
					keyboardAppearance='dark'
					returnKeyType='next'
					returnKeyLabel='next'
					onChangeText={handleChange('password')}
					onBlur={handleBlur('password')}
					error={errors.password}
					touched={touched.password}
					onSubmitEditing={() => verfiyPassword.current?.focus()}
				/>
				<Text style={{color: 'red'}}>{!!errors.verfiyPassword && touched.verfiyPassword && errors.verfiyPassword}</Text>
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
					onChangeText={handleChange('verfiyPassword')}
					onBlur={handleBlur('verfiyPassword')}
					error={errors.verfiyPassword}
					touched={touched.verfiyPassword}
					onSubmitEditing={() => handleSubmit()}
				/>
				{signupError !== '' && <Text style={{color: 'red'}}>{signupError}</Text>}
				<TouchableOpacity
					style={{
						backgroundColor: '#000',
						borderRadius: 5,
						padding: 10,
						marginTop: 15
					}}
					onPress={() => handleSubmit()}>
					<ListItem.Title
						style={{
							color: '#fff',
							alignSelf: 'center',
							fontWeight: 'bold'
						}}>
						Register
					</ListItem.Title>
				</TouchableOpacity>
				<RNButton onPress={() => navigation.navigate('Login')} title='Go to Login' color='#000000' />
			</View>
			<ImageBackground source={require('../../assets/123_1.jpeg')} style={styles.authImage} resizeMode='cover'></ImageBackground>
		</SafeAreaView>
	)
}

const styles = createStyles()
