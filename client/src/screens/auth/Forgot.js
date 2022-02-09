import {StatusBar} from 'expo-status-bar'
import React, {useState} from 'react'
import {ImageBackground} from 'react-native'
import {Text, Heading, Center, VStack, Pressable} from 'native-base'
import {useFormik} from 'formik'
import * as Yup from 'yup'

import createStyles from '../../styles/base'
import {InputField} from '../../components'
import Firebase from '../../config/firebase'

const auth = Firebase.auth()

const LoginSchema = Yup.object().shape({
	email: Yup.string().email('Invalid Email').required('Required')
})

export default function Signin({navigation}) {
	const [emailError, setEmailError] = useState('')
	const {handleChange, handleBlur, handleSubmit, values, errors, touched} =
		useFormik({
			validationSchema: LoginSchema,
			initialValues: {email: ''},
			onSubmit: (values) => onChangePassword(values.email)
		})

	const onChangePassword = async (email) => {
		try {
			await auth.sendPasswordResetEmail(email)
		} catch (error) {
			setEmailError('Unable to send email')
		}
	}

	return (
		<VStack flex={1} safeArea p={2}>
			<StatusBar style='dark-content' />
			<Center>
				<Heading size={'xl'} color={'#000'}>
					Forgot Password
				</Heading>
			</Center>
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
				returnKeyType='go'
				returnKeyLabel='go'
				onChangeText={handleChange('email')}
				onBlur={handleBlur('email')}
				error={errors.email}
				touched={touched.email}
				onSubmitEditing={() => handleSubmit()}
			/>
			{emailError !== '' && (
				<Text style={{color: 'red'}}>{emailError}</Text>
			)}
			<Pressable
				p={2}
				my={4}
				bgColor={'#000'}
				borderRadius={5}
				onPress={() => handleSubmit()}>
				<Text color={'#fff'} fontSize={'lg'} alignSelf={'center'} bold>
					Send Email
				</Text>
			</Pressable>
			<Center>
				<Pressable onPress={() => navigation.navigate('Login')}>
					<Text fontSize={'lg'} color={'#000'}>
						Go to Login
					</Text>
				</Pressable>
			</Center>
			{/* <ImageBackground
				source={require('../../assets/123_1.jpeg')}
				style={styles.authImage}
				resizeMode='cover'></ImageBackground> */}
		</VStack>
	)
}

const styles = createStyles()
