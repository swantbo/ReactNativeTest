import {StatusBar} from 'expo-status-bar'
import React, {useState, useRef} from 'react'
import {
	Text,
	Heading,
	Center,
	VStack,
	Pressable,
	KeyboardAvoidingView
} from 'native-base'
import {ImageBackground} from 'react-native'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import moment from 'moment'

import createStyles from '../../styles/base'
import {InputField, ErrorMessage} from '../../components'
import Firebase from '../../config/firebase'
import {Icon} from 'native-base'

//#region logic
const auth = Firebase.auth()
//#region validation regex rules

const phoneRegExp =
	/^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/i
//honestly if you touch this....https://tinyurl.com/2p9dd985

const passwordReqRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
//	/^
//	(?=.*\d)          // should contain at least one digit
//(?=.* [a - z])       // should contain at least one lower case
//	(?=.* [A - Z])       // should contain at least one upper case
//[a - zA - Z0 - 9]{ 8,}   // should contain at least 8 from the mentioned characters
//$ /

//#endregion
//TODO figure out a way to display password requirements better
const LoginSchema = Yup.object().shape({
	firstName: Yup.string().max(100).required('Required'),
	lastName: Yup.string().max(100).required('Required'),
	dob: Yup.date()
		.transform((value) => {
			return value ? moment(value).toDate() : value
		})
		.typeError('please follow the following format: MM/DD/YYYY')
		.required('Required'),
	referral: Yup.string()
		.matches(phoneRegExp, 'Phone number is not valid')
		.max(100),
	phone: Yup.string()
		.matches(phoneRegExp, 'Phone number is not valid')
		.required('Required'),
	email: Yup.string()
		.max(225)
		.email('email is not valid')
		.required('Required'),
	password: Yup.string()
		.matches(passwordReqRegex, 'Password must be stronger')
		.required('Required'),
	verfiyPassword: Yup.string().oneOf(
		[Yup.ref('password'), null],
		'Passwords must match'
	)
})

export default function Signup({navigation}) {
	const [signupError, setSignupError] = useState('')
	const {handleChange, handleBlur, handleSubmit, values, errors, touched} =
		useFormik({
			validationSchema: LoginSchema,
			initialValues: {
				firstName: '',
				lastName: '',
				dob: '',
				referral: '',
				phone: '',
				email: '',
				password: '',
				verfiyPassword: ''
			},
			onSubmit: (values) => onHandleSignup(values)
		})

	const onHandleSignup = async (values) => {
		try {
			await auth
				.createUserWithEmailAndPassword(values.email, values.password)
				.then((data) => {
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
					Firebase.firestore()
						.collection('users')
						.doc(data.user.uid)
						.set(user)
					Firebase.firestore()
						.collection('users')
						.doc(data.user.uid)
						.collection('Haircuts')
						.set()
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
		<VStack flex={1} safeArea p={2}>
			<StatusBar style='dark-content' />
			<Center>
				<Heading size={'xl'} color={'#000'}>
					Create Account
				</Heading>
			</Center>
			<KeyboardAvoidingView behavior='position'>
				<Text style={{color: 'red'}}>
					{!!errors.firstName &&
						touched.firstName &&
						errors.firstName}
				</Text>
				<InputField
					icon='user'
					placeholder='First name'
					autoCapitalize='none'
					autoCompleteType='email'
					keyboardAppearance='dark'
					returnKeyType='next'
					returnKeyLabel='next'
					onChangeText={handleChange('firstName')}
					onBlur={handleBlur('firstName')}
					error={errors.firstName}
					touched={touched.firstName}
					onSubmitEditing={() => lastName.current?.focus()}
				/>
				<Text style={{color: 'red'}}>
					{!!errors.lastName && touched.lastName && errors.lastName}
				</Text>
				<InputField
					ref={lastName}
					icon='user'
					placeholder='Last name'
					autoCapitalize='none'
					autoCompleteType='email'
					keyboardAppearance='dark'
					returnKeyType='next'
					returnKeyLabel='next'
					onChangeText={handleChange('lastName')}
					onBlur={handleBlur('lastName')}
					error={errors.lastName}
					touched={touched.lastName}
					onSubmitEditing={() => referral.current?.focus()}
				/>
				{/*TODO: lets make this a modal on the next page for the first time a user logs in. I think we are asking too many questions for sign up.*/}
				<Text style={{color: 'red'}}>
					{!!errors.referral && touched.referral && errors.referral}
				</Text>
				<InputField
					ref={referral}
					icon='user'
					placeholder='Phone number of refferal(optional)'
					autoCapitalize='none'
					autoCompleteType='email'
					keyboardAppearance='dark'
					returnKeyType='next'
					returnKeyLabel='next'
					onChangeText={handleChange('referral')}
					onBlur={handleBlur('referral')}
					error={errors.referral}
					touched={touched.referral}
					onSubmitEditing={() => dob.current?.focus()}
				/>
				<Text style={{color: 'red'}}>
					{!!errors.dob && touched.dob && errors.dob}
				</Text>
				<InputField
					ref={dob}
					icon='cake'
					placeholder='Enter your birthday'
					autoCapitalize='none'
					autoCompleteType='email'
					keyboardAppearance='dark'
					returnKeyType='next'
					returnKeyLabel='next'
					onChangeText={handleChange('dob')}
					onBlur={handleBlur('dob')}
					error={errors.dob}
					touched={touched.dob}
					onSubmitEditing={() => phone.current?.focus()}
				/>
				<Text style={{color: 'red'}}>
					{!!errors.phone && touched.phone && errors.phone}
				</Text>
				<InputField
					ref={phone}
					icon='phone'
					placeholder='Enter your phone'
					autoCapitalize='none'
					autoCompleteType='email'
					keyboardAppearance='dark'
					returnKeyType='next'
					returnKeyLabel='next'
					onChangeText={handleChange('phone')}
					onBlur={handleBlur('phone')}
					error={errors.phone}
					touched={touched.phone}
					onSubmitEditing={() => email.current?.focus()}
				/>
				<Text style={{color: 'red'}}>
					{!!errors.email && touched.email && errors.email}
				</Text>
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
				<Text style={{color: 'red'}}>
					{!!errors.password && touched.password && errors.password}
				</Text>
				{!!errors.verfiyPassword && touched.verfiyPassword && (
					<Text style={{color: 'red'}}>{errors.verfiyPassword}</Text>
				)}
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
				<Text style={{color: 'red'}}>
					{!!errors.verfiyPassword &&
						touched.verfiyPassword &&
						errors.verfiyPassword}
				</Text>
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
			</KeyboardAvoidingView>
			{signupError !== '' && (
				<Text style={{color: 'red'}}>{signupError}</Text>
			)}
			<Pressable
				p={2}
				my={4}
				bgColor={'#000'}
				borderRadius={5}
				onPress={() => handleSubmit()}>
				<Text color={'#fff'} fontSize={'lg'} alignSelf={'center'} bold>
					Create Account
				</Text>
			</Pressable>
			<Center my={2}>
				<Pressable onPress={() => navigation.navigate('Login')}>
					<Text fontSize={'lg'} color={'#000'}>
						Go to Login
					</Text>
				</Pressable>
			</Center>
			{/* <ImageBackground source={require('../../assets/123_1.jpeg')} style={styles.authImage} resizeMode='cover'></ImageBackground> */}
		</VStack>
	)
}

const styles = createStyles()
