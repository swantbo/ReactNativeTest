import {StatusBar} from 'expo-status-bar'
import React from 'react'
import {useState} from 'react'
import {ImageBackground, Text, View, Button as RNButton, SafeAreaView, TouchableOpacity} from 'react-native'
import {ListItem} from 'react-native-elements'

import createStyles from '../../styles/base'
import {InputField} from '../../components'
import Firebase from '../../config/firebase'

const auth = Firebase.auth()

export default function Forgot({navigation}) {
	const [email, setEmail] = useState('')

	const onChangePassword = async () => {
		try {
			if (email !== '' && password !== '') {
				await auth.sendPasswordResetEmail(email)
			}
		} catch (error) {
			setLoginError(error.message)
		}
	}

	return (
		<SafeAreaView style={styles.authContainer}>
			<View style={{padding: 10}}>
				<StatusBar style='dark-content' />
				<Text style={styles.authTitle}>Forgot Password</Text>
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
				<TouchableOpacity
					style={{
						backgroundColor: '#000',
						borderRadius: 5,
						padding: 10
					}}
					onPress={() => onChangePassword()}>
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
