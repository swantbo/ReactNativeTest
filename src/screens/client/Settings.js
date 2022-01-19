import React, {useEffect, useState, useContext} from 'react'
import {Alert} from 'react-native'
import {
	Avatar,
	Center,
	VStack,
	Pressable,
	Box,
	Text,
	Button,
	Input,
	HStack
} from 'native-base'
import {Entypo as Icon} from '@expo/vector-icons'

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

	const {handleChange, handleBlur, handleSubmit, values, errors, touched} =
		useFormik({
			validationSchema: LoginSchema,
			initialValues: {
				name: `${currentUser.name}`,
				phone: `${currentUser.phone}`
			},
			enableReinitialize: true,
			onSubmit: (values) => onChangeData(values.name, values.phone)
		})

	console.log('values', values.name)
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
				await FileSystem.moveAsync({
					from: result.uri,
					to: cameraImageUri
				})
				const picture = {
					profilePicture: cameraImageUri
				}
				await Firebase.firestore()
					.collection('users')
					.doc(user.uid)
					.set(picture, {merge: true})
				setChangeProfilePicture(cameraImageUri)
				Alert.alert(
					'Success',
					`Your Profile Picture has been saved and changed.`
				)
			} catch (err) {
				Alert.alert(
					'Error',
					`Unable to save and change Profile Picture. Try again.`
				)
			}
		}
	}

	const onChangeData = (name, phone) => {
		const updateUserData = {
			name: name,
			phone: phone
		}
		try {
			Firebase.firestore()
				.collection('users')
				.doc(user.uid)
				.update(updateUserData)
			Alert.alert(
				'Success',
				`Your information has been changed to ${name}, ${phone}`
			)
		} catch (error) {
			Alert.alert(
				'Error',
				'Unable to change information. Please try again'
			)
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
		<VStack bgColor={'#000'} flex={1}>
			<VStack flex={3}>
				<Box bgColor={'#121212'} borderRadius={20} mt={5} p={2}>
					<Pressable onPress={() => pickImage()}>
						<Center>
							<Avatar
								size='xl'
								source={{uri: changeProfilePicture}}></Avatar>
							<Text p={'1'} fontSize={'md'}>
								Change Profile Picture
							</Text>
						</Center>
					</Pressable>
				</Box>
				<Box bgColor={'#121212'} borderRadius={20} mt={5} p={2} px={10}>
					<HStack alignItems={'center'}>
						<Icon name={'user'} color={'#fff'} size={16} />
						<Text pl={1} fontSize={'xl'}>
							Name
						</Text>
					</HStack>
					{!!errors.name && touched.name && (
						<Text style={{color: 'red'}}>{errors.name}</Text>
					)}
					<Input
						variant='underlined'
						width={'100%'}
						size={'lg'}
						placeholder='Name'
						defaultValue={values.name}
						onChangeText={handleChange('name')}
						onBlur={handleBlur('name')}
						error={errors.name}
						touched={touched.name}
					/>
				</Box>
				<Box bgColor={'#121212'} borderRadius={20} mt={5} p={2} px={10}>
					<HStack alignItems={'center'}>
						<Icon name={'phone'} color={'#fff'} size={16} />
						<Text pl={1} fontSize={'xl'}>
							Phone
						</Text>
					</HStack>
					{!!errors.phone && touched.phone && (
						<Text style={{color: 'red'}}>{errors.phone}</Text>
					)}
					<Input
						variant='underlined'
						width={'100%'}
						size={'lg'}
						placeholder='Phone'
						defaultValue={values.phone}
						onChangeText={handleChange('phone')}
						onBlur={handleBlur('phone')}
						error={errors.phone}
						touched={touched.phone}
					/>
				</Box>
				{touched.name || touched.phone ? (
					<Button
						bgColor={'#E8BD70'}
						borderRadius={20}
						mt={7}
						p={2}
						onPress={() => handleSubmit()}>
						<Text
							bold
							fontSize={'lg'}
							alignSelf={'center'}
							color={'#000'}>
							Save Changes
						</Text>
					</Button>
				) : null}
			</VStack>
			<VStack flex={1} justifyContent={'flex-end'}>
				<Button
					bgColor={'#121212'}
					borderRadius={20}
					mb={5}
					p={2}
					onPress={() => handleSignOut()}>
					<Text
						bold
						fontSize={'xl'}
						alignSelf={'center'}
						color={'#E8BD70'}>
						Sign Out
					</Text>
				</Button>
			</VStack>
		</VStack>
	)
}

const mapStateToProps = (store) => ({
	currentUser: store.userState.currentUser
})

export default connect(mapStateToProps, null)(Settings)
