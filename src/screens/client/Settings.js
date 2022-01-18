import React, {useEffect, useState, useContext} from 'react'
import {Alert} from 'react-native'
import {Avatar, Center, ScrollView, VStack, Pressable, Box, Text, Button, Input} from 'native-base'

import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import {connect} from 'react-redux'

import {AuthenticatedUserContext} from '../../navigation/AuthenticatedUserProvider'

import Firebase from '../../config/firebase'
const auth = Firebase.auth()

import {useFormik} from 'formik'
import * as Yup from 'yup'

const LoginSchema = Yup.object().shape({
	name: Yup.string().required('Required'),
	phone: Yup.string()
		.matches(/^[0-9]+$/, 'Must be only digits')
		.min(10, 'Must be exactly 10 digits')
		.max(10, 'Must be exactly 10 digits')
})

function Settings(props) {
	const {user} = useContext(AuthenticatedUserContext)
	const [currentUser, setCurrentUser] = useState({})
	const [changeProfilePicture, setChangeProfilePicture] = useState('')

	const {handleChange, handleBlur, handleSubmit, values, errors, touched} = useFormik({
		validationSchema: LoginSchema,
		initialValues: {name: '', phone: ''},
		onSubmit: (values) => onChangeData(values.name, values.phone)
	})

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1
		})

		let cameraImageUri = ''
		if (result) {
			const fileName = result.uri.split('/').pop()
			cameraImageUri = FileSystem.documentDirectory + fileName
			try {
				await FileSystem.moveAsync({from: result.uri, to: cameraImageUri})
				const picture = {
					profilePicture: cameraImageUri
				}
				await Firebase.firestore().collection('users').doc(user.uid).set(picture, {merge: true})
				setChangeProfilePicture(cameraImageUri)
				Alert.alert('Success', `Your Profile Picture has been saved and changed.`)
			} catch (err) {
				Alert.alert('Error', `Unable to save and change Profile Picture. Try again.`)
			}
		}
	}

	const onChangeData = (name, phone) => {
		let updateUserData
		if (name !== '' && name !== currentUser.name) {
			updateUserData = {
				name: name
			}
		}
		if (phone !== '' && phone !== currentUser.phone) {
			updateUserData = {
				phone: phone
			}
		}
		try {
			Firebase.firestore().collection('users').doc(user.uid).update(updateUserData)
			Alert.alert('Success', `Your information has been changed to ${name !== '' ? name : phone}`)
		} catch (error) {
			Alert.alert('There is an error.', err.message)
		}
	}

	const handleSignOut = async () => {
		try {
			await auth.signOut()
		} catch (error) {
			Alert.alert('Error', `Unable to Logout, try again. ${error}`)
		}
	}

	useEffect(() => {
		const {currentUser} = props
		setCurrentUser(currentUser)
		setChangeProfilePicture(currentUser.profilePicture)
	}, [props])

	return (
		<ScrollView bgColor={'#000'}>
			<Box bgColor={'#121212'} borderRadius={20} m={1} ml={3} mr={3} p={2} pl={10} pr={10}>
				<Pressable onPress={() => pickImage()}>
					<Center>
						<Avatar size='xl' source={{uri: changeProfilePicture}}></Avatar>
						<Text p={'1'} fontSize={'md'}>
							Change Profile Picture
						</Text>
					</Center>
				</Pressable>
			</Box>
			<VStack bgColor={'#121212'} borderRadius={20} m={1} ml={3} mr={3} p={2} pl={10} pr={10}>
				<Text fontSize={'md'}>Name</Text>
				{!!errors.name && touched.name && <Text style={{color: 'red'}}>{errors.name}</Text>}
				<Input width={'100%'} size={'md'} placeholder='Name' defaultValue={currentUser.name} onChangeText={handleChange('name')} onBlur={handleBlur('name')} error={errors.name} touched={touched.name} onSubmitEditing={() => handleSubmit()} />

				{touched.name && values?.name && (
					<Button alignSelf={'flex-end'} mt={2} size={'xs'} bgColor={'#E8BD70'} onPress={() => handleSubmit()}>
						<Text bold color={'#000'}>
							Save
						</Text>
					</Button>
				)}
			</VStack>
			<VStack bgColor={'#121212'} borderRadius={20} m={1} ml={3} mr={3} p={2} pl={10} pr={10}>
				<Text fontSize={'md'}>Phone</Text>
				{!!errors.phone && touched.phone && <Text style={{color: 'red'}}>{errors.phone}</Text>}
				<Input
					width={'100%'}
					size={'md'}
					placeholder='Phone'
					defaultValue={currentUser.phone}
					onChangeText={handleChange('phone')}
					onBlur={handleBlur('phone')}
					error={errors.phone}
					touched={touched.phone}
					onSubmitEditing={() => handleSubmit()}
				/>

				{touched.phone && values?.phone && (
					<Button alignSelf={'flex-end'} mt={2} size={'xs'} bgColor={'#E8BD70'} onPress={() => handleSubmit()}>
						<Text bold color={'#000'}>
							Save
						</Text>
					</Button>
				)}
			</VStack>
			<Button bgColor={'#121212'} borderRadius={20} m={3} p={2} pl={10} pr={10} onPress={() => handleSignOut()}>
				<Text bold fontSize={'lg'} alignSelf={'center'} color={'#E8BD70'}>
					Sign Out
				</Text>
			</Button>
		</ScrollView>
	)
}

const mapStateToProps = (store) => ({
	currentUser: store.userState.currentUser
})

export default connect(mapStateToProps, null)(Settings)
