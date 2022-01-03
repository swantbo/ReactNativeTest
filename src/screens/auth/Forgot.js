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
	email: Yup.string().email('Invalid Email').required('Required')
})

export default function Signin({navigation}) {
	const [loginError, setLoginError] = useState('')
	const {handleChange, handleBlur, handleSubmit, values, errors, touched} = useFormik({
		validationSchema: LoginSchema,
		initialValues: {email: ''},
		onSubmit: (values) => onChangePassword(values.email)
	})

	const onChangePassword = async (email) => {
		try {
			await auth.sendPasswordResetEmail(email)
		} catch (error) {
			setLoginError('Unable to send email')
		}
	}

	return (
		<SafeAreaView style={styles.authContainer}>
			<View style={{padding: 10}}>
				<StatusBar style='dark-content' />
				<Text style={styles.authTitle}>Forgot Password</Text>
				<Text style={{color: 'red'}}>{!!errors.email && touched.email && errors.email}</Text>
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
				{loginError !== '' && <Text style={{color: 'red'}}>{loginError}</Text>}
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
						Send Email
					</ListItem.Title>
				</TouchableOpacity>
				<RNButton onPress={() => navigation.navigate('Login')} title='Go to Login' color='#000000' />
			</View>
			<ImageBackground source={require('../../assets/123_1.jpeg')} style={styles.authImage} resizeMode='cover'></ImageBackground>
		</SafeAreaView>
	)
}

const styles = createStyles()
