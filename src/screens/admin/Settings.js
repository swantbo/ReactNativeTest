import React, {useEffect, useState, useContext} from 'react'
import {
	View,
	StyleSheet,
	TextInput,
	Alert,
	ActivityIndicator,
	TouchableOpacity
} from 'react-native'
import {
	Avatar,
	Center,
	VStack,
	Heading,
	HStack,
	Box,
	Text,
	Input,
	ScrollView,
	Button,
	Pressable
} from 'native-base'
import {Entypo as Icon} from '@expo/vector-icons'

import {ListItem, Card} from 'react-native-elements'

import Firebase from '../../config/firebase'
const auth = Firebase.auth()
import {AuthenticatedUserContext} from '../../navigation/AuthenticatedUserProvider'

import * as ImagePicker from 'expo-image-picker'
import createStyles from '../../styles/base'

import {connect} from 'react-redux'

import {useFormik} from 'formik'
import * as Yup from 'yup'

const LoginSchema = Yup.object().shape({
	name: Yup.string().required('Required'),
	phone: Yup.string()
		.matches(/^[0-9]+$/, 'Must be only digits')
		.min(10, 'Must be exactly 10 digits')
		.max(10, 'Must be exactly 10 digits'),
	bio: Yup.string().required('Required'),
	mensPrice: Yup.string().required('Required'),
	website: Yup.string().required('Required'),
	instagram: Yup.string().required('Required'),
	profilePhone: Yup.string().required('Required'),
	address: Yup.string().required('Required'),
	tuesday: Yup.string().required('Required'),
	wednesday: Yup.string().required('Required'),
	thursday: Yup.string().required('Required'),
	friday: Yup.string().required('Required'),
	saturday: Yup.string().required('Required')
})

function Settings(props) {
	const {user} = useContext(AuthenticatedUserContext)
	const [isLoading, setIsLoading] = useState(false)
	const [barberProfile, setBarberProfile] = useState({})
	const [changeData, setChangeData] = useState('')
	const [barberDataType, setBarberDataType] = useState('')
	const [newBarberData, setNewBarberData] = useState('')
	const [userInfo, setUserInfo] = useState({name: '', phone: ''})
	const [changeBarberImage, setChangeBarberImage] = useState('')

	const {handleChange, handleBlur, handleSubmit, values, errors, touched} =
		useFormik({
			validationSchema: LoginSchema,
			initialValues: {
				bio: `${barberProfile.bio}`,
				mensPrice: `${barberProfile.price}`,
				kidsPrice: `${barberProfile.kidsPrice}`,
				website: `${barberProfile.website}`,
				instagram: `${barberProfile.instagram}`,
				profilePhone: `${barberProfile.phone}`,
				address: `${barberProfile.location}`,
				tuesday: `${barberProfile.Tuesday}`,
				wednesday: `${barberProfile.Wednesday}`,
				thursday: `${barberProfile.Thursday}`,
				friday: `${barberProfile.Friday}`,
				saturday: `${barberProfile.Saturday}`,
				name: `${userInfo.name}`,
				phone: `${userInfo.phone}`
			},
			enableReinitialize: true,
			onSubmit: (values) => onChangeData(values.name, values.phone)
		})

	async function getBarberImage() {
		await Firebase.storage()
			.ref('Barber/ProfilePicture')
			.getDownloadURL()
			.then((ProfileImage) => {
				setChangeBarberImage(ProfileImage)
			})
	}

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1
		})
		setImage(result.uri)
		uploadImageAsync(result.uri)

		result = null
	}

	async function uploadImageAsync(uri) {
		const response = await fetch(uri)
		const blob = await response.blob()

		await Firebase.storage().ref('Barber/ProfilePicture').put(blob)
	}

	const onChangeData = (values) => {
		const barberData = {
			bio: values.bio,
			price: values.mensPrice,
			kidsPrice: values.kidsPrice,
			website: values.website,
			instagram: values.instagram,
			phone: values.profilePhone,
			location: values.address,
			Tuesday: values.tuesday,
			Wednesday: values.wednesday,
			Thursday: values.thursday,
			Friday: values.friday,
			Saturday: values.saturday
		}
		const BarberInfo = {
			name: values.name,
			phone: values.phone
		}
		Firebase.firestore()
			.collection('Barber')
			.doc('Nate')
			.set(barberData, {merge: true})
			.then(() => {
				Alert.alert('Success', `Your information has been changed.`)
			})
			.catch((error) => {
				alert('Something went wrong try again')
			})
		Firebase.firestore()
			.collection('users')
			.doc(user.uid)
			.set(BarberInfo, {merge: true})
			.then(() => {
				Alert.alert(
					'Success',
					`Your Account information has been changed`
				)
			})
			.catch((error) => {
				alert('Something went wrong try again')
			})
	}

	const setBarberData = () => {
		let barberData
		if (barberDataType === 'userphone' || 'username') {
			barberData = {
				[barberDataType.replace('user', '')]: newBarberData
			}
		} else {
			barberData = {
				[barberDataType]: newBarberData
			}
		}
		if (
			barberDataType !== 'username' &&
			barberDataType !== 'userphone' &&
			newBarberData !== ''
		) {
			Firebase.firestore()
				.collection('Barber')
				.doc('Nate')
				.set(barberData, {merge: true})
				.then(() => {
					Alert.alert(
						'Success',
						`Your Barber data ${barberDataType} has been changed to ${newBarberData}`
					)
				})
				.catch((error) => {
					alert('Something went wrong try again')
				})
		}
		if (
			barberDataType === 'username' ||
			(barberDataType === 'userphone' && newBarberData !== '')
		) {
			Firebase.firestore()
				.collection('users')
				.doc(user.uid)
				.set(barberData, {merge: true})
				.then(() => {
					Alert.alert(
						'Success',
						`Your Account ${barberDataType} has been changed to ${newBarberData}`
					)
				})
				.catch((error) => {
					alert('Something went wrong try again' + error)
				})
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
		const {currentUser, barber} = props
		setBarberProfile(barber)
		setUserInfo(currentUser)
		getBarberImage()
	}, [props])

	return (
		<ScrollView bgColor={'#000'} flex={1}>
			<VStack>
				<Box bgColor={'#121212'} borderRadius={20} mt={5} p={2}>
					<Pressable onPress={() => pickImage()}>
						<Center>
							<Avatar
								size='xl'
								source={{uri: changeBarberImage}}></Avatar>
							<Text p={'1'} fontSize={'md'}>
								Change Profile Picture
							</Text>
						</Center>
					</Pressable>
				</Box>
				<Box bgColor={'#121212'} borderRadius={20} mt={5} p={2} px={10}>
					<Heading fontSize={'xl'} mb={5} color={'#E8BD70'}>
						Profile Info
					</Heading>
					<HStack alignItems={'center'}>
						<Text pl={1} fontSize={'xl'}>
							Bio
						</Text>
					</HStack>
					{!!errors.bio && touched.bio && (
						<Text style={{color: 'red'}}>{errors.bio}</Text>
					)}
					<Input
						variant='underlined'
						width={'100%'}
						size={'lg'}
						placeholder='Bio'
						defaultValue={values.bio}
						onChangeText={handleChange('bio')}
						onBlur={handleBlur('bio')}
						error={errors.bio}
						touched={touched.bio}
					/>
					<Text pl={1} fontSize={'xl'}>
						Men's Price
					</Text>
					{!!errors.mensPrice && touched.mensPrice && (
						<Text style={{color: 'red'}}>{errors.mensPrice}</Text>
					)}
					<Input
						variant='underlined'
						width={'100%'}
						size={'lg'}
						placeholder="Men's Price"
						defaultValue={values.mensPrice}
						onChangeText={handleChange('mensPrice')}
						onBlur={handleBlur('mensPrice')}
						error={errors.mensPrice}
						touched={touched.mensPrice}
					/>
					<Text pl={1} fontSize={'xl'}>
						Website
					</Text>
					{!!errors.website && touched.website && (
						<Text style={{color: 'red'}}>{errors.website}</Text>
					)}
					<Input
						variant='underlined'
						width={'100%'}
						size={'lg'}
						placeholder='Website'
						defaultValue={values.website}
						onChangeText={handleChange('website')}
						onBlur={handleBlur('website')}
						error={errors.website}
						touched={touched.website}
					/>
					<Text pl={1} fontSize={'xl'}>
						Instagram
					</Text>
					{!!errors.instagram && touched.instagram && (
						<Text style={{color: 'red'}}>{errors.instagram}</Text>
					)}
					<Input
						variant='underlined'
						width={'100%'}
						size={'lg'}
						placeholder='Instagram'
						defaultValue={values.instagram}
						onChangeText={handleChange('instagram')}
						onBlur={handleBlur('instagram')}
						error={errors.instagram}
						touched={touched.instagram}
					/>
					<Text pl={1} fontSize={'xl'}>
						Phone
					</Text>
					{!!errors.profilePhone && touched.profilePhone && (
						<Text style={{color: 'red'}}>
							{errors.profilePhone}
						</Text>
					)}
					<Input
						variant='underlined'
						width={'100%'}
						size={'lg'}
						placeholder='Phone'
						defaultValue={values.profilePhone}
						onChangeText={handleChange('profilePhone')}
						onBlur={handleBlur('profilePhone')}
						error={errors.profilePhone}
						touched={touched.profilePhone}
					/>
				</Box>
				<Box bgColor={'#121212'} borderRadius={20} mt={5} p={2} px={10}>
					<Heading fontSize={'xl'} mb={5} color={'#E8BD70'}>
						Address & Location
					</Heading>
					<Text pl={1} fontSize={'xl'}>
						Address
					</Text>
					{!!errors.address && touched.address && (
						<Text style={{color: 'red'}}>{errors.address}</Text>
					)}
					<Input
						variant='underlined'
						width={'100%'}
						size={'lg'}
						placeholder='Address'
						defaultValue={values.address}
						onChangeText={handleChange('address')}
						onBlur={handleBlur('address')}
						error={errors.address}
						touched={touched.address}
					/>
					<Text pl={1} fontSize={'xl'}>
						Tuesday
					</Text>
					{!!errors.tuesday && touched.tuesday && (
						<Text style={{color: 'red'}}>{errors.tuesday}</Text>
					)}
					<Input
						variant='underlined'
						width={'100%'}
						size={'lg'}
						placeholder='Tuesday'
						defaultValue={values.tuesday}
						onChangeText={handleChange('tuesday')}
						onBlur={handleBlur('tuesday')}
						error={errors.tuesday}
						touched={touched.tuesday}
					/>
					<Text pl={1} fontSize={'xl'}>
						Wednesday
					</Text>
					{!!errors.wednesday && touched.wednesday && (
						<Text style={{color: 'red'}}>{errors.wednesday}</Text>
					)}
					<Input
						variant='underlined'
						width={'100%'}
						size={'lg'}
						placeholder='Wednesday'
						defaultValue={values.wednesday}
						onChangeText={handleChange('wednesday')}
						onBlur={handleBlur('wednesday')}
						error={errors.wednesday}
						touched={touched.wednesday}
					/>
					<Text pl={1} fontSize={'xl'}>
						Thursday
					</Text>
					{!!errors.thursday && touched.thursday && (
						<Text style={{color: 'red'}}>{errors.thursday}</Text>
					)}
					<Input
						variant='underlined'
						width={'100%'}
						size={'lg'}
						placeholder='Thursday'
						defaultValue={values.thursday}
						onChangeText={handleChange('thursday')}
						onBlur={handleBlur('thursday')}
						error={errors.thursday}
						touched={touched.thursday}
					/>
					<Text pl={1} fontSize={'xl'}>
						Friday
					</Text>
					{!!errors.friday && touched.friday && (
						<Text style={{color: 'red'}}>{errors.friday}</Text>
					)}
					<Input
						variant='underlined'
						width={'100%'}
						size={'lg'}
						placeholder='Friday'
						defaultValue={values.friday}
						onChangeText={handleChange('friday')}
						onBlur={handleBlur('friday')}
						error={errors.friday}
						touched={touched.friday}
					/>
					<Text pl={1} fontSize={'xl'}>
						Saturday
					</Text>
					{!!errors.saturday && touched.saturday && (
						<Text style={{color: 'red'}}>{errors.saturday}</Text>
					)}
					<Input
						variant='underlined'
						width={'100%'}
						size={'lg'}
						placeholder='Saturday'
						defaultValue={values.saturday}
						onChangeText={handleChange('saturday')}
						onBlur={handleBlur('saturday')}
						error={errors.saturday}
						touched={touched.saturday}
					/>
				</Box>
				<Box
					bgColor={'#121212'}
					borderRadius={20}
					mt={5}
					mb={5}
					p={2}
					px={10}>
					<Heading fontSize={'xl'} mb={5} color={'#E8BD70'}>
						Account Details
					</Heading>
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
				{touched ? (
					<Button
						bgColor={'#E8BD70'}
						borderRadius={20}
						my={5}
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
		</ScrollView>
	)
}

const styles = createStyles()

const mapStateToProps = (store) => ({
	currentUser: store.userState.currentUser,
	barber: store.userState.barber
})

export default connect(mapStateToProps, null)(Settings)
