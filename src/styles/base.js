import {StyleSheet} from 'react-native'

const baseStyles = {
	container: {
		flex: 1,
		backgroundColor: '#000'
	},
	goldContainer: {
		flex: 1,
		backgroundColor: '#E8BD70'
	},
	title: {
		fontWeight: 'bold',
		color: '#fff'
	},
	text: {
		fontWeight: 'normal',
		color: '#fff'
	},
	cardHeader: {
		flex: 0,
		backgroundColor: '#E8BD70',
		borderColor: '#E8BD70',
		padding: 0,
		margin: 0,
		borderWidth: 0
	},
	scrollView: {
		backgroundColor: '#000',
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15
	},
	goldTitle: {
		fontWeight: 'bold',
		color: '#E8BD70'
	},
	listItemContainer: {
		backgroundColor: '#121212'
	},
	listItemButton: {
		minHeight: '100%',
		backgroundColor: 'red'
	},
	row: {
		flex: 1,
		flexDirection: 'row'
	},
	rowStart: {
		flex: 2,
		alignItems: 'flex-start'
	},
	rowEnd: {
		flex: 1,
		alignItems: 'flex-end'
	},
	subtitle: {
		color: '#fff'
	},
	titleCenter: {
		fontWeight: 'bold',
		color: '#fff',
		alignSelf: 'center'
	},
	cardBio: {
		backgroundColor: '#000',
		margin: 0,
		borderColor: '#000',
		color: '#E8BD70'
	},
	barberSocialIcons: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: '#121212',
		marginTop: 10,
		marginBottom: 10,
		marginLeft: 5,
		marginRight: 5,
		padding: 5,
		borderRadius: 10
	},
	socialIcons: {
		backgroundColor: '#E8BD70'
	},
	barberInfoView: {
		borderRadius: 10,
		marginTop: 10,
		marginBottom: 10,
		marginLeft: 5,
		marginRight: 5,
		backgroundColor: '#121212',
		borderColor: '#121212'
	},
	barberPhotoContainer: {
		margin: 15,
		borderRadius: 10,
		backgroundColor: '#121212',
		borderColor: '#121212'
	},
	containerGallery: {
		flex: 1,
		flexDirection: 'row'
	},
	image: {
		flex: 1,
		aspectRatio: 1 / 1
	},
	containerImage: {
		flex: 1 / 2,
		margin: 5
	},
	avatarBackground: {
		alignSelf: 'center',
		backgroundColor: '#121212',
		marginBottom: 10
	},
	barberInfoTitles: {
		alignSelf: 'flex-start',
		color: '#E8BD70'
	},
	signOut: {
		fontWeight: 'bold',
		alignSelf: 'center',
		color: '#E8BD70'
	},
	signOutButton: {
		fontWeight: 'bold',
		alignSelf: 'center',
		color: '#E8BD70',
		backgroundColor: '#121212',
		marginTop: 20
	},
	goldButton: {
		backgroundColor: '#E8BD70',
		borderRadius: 5,
		padding: 5
	},
	inputField: {
		backgroundColor: '#fff',
		marginBottom: 20,
		borderColor: 'black',
		borderWidth: 1
	},
	checkBox: {
		backgroundColor: '#121212',
		width: '100%',
		padding: 5,
		margin: 5
	},
	listItemContent: {
		backgroundColor: '#E8BD70',
		borderRadius: 10,
		padding: 5
	},
	scrollViewAppointment: {
		padding: 0,
		alignSelf: 'center'
	},
	buttonTitle: {
		color: '#000',
		fontWeight: 'bold',
		alignSelf: 'center'
	},
	textInput: {
		borderWidth: 1,
		borderColor: 'grey',
		padding: 10,
		margin: 10,
		borderRadius: 5,
		color: '#fff'
	},
	revenueText: {
		color: 'lightgrey',
		alignSelf: 'center'
	},
	card: {
		backgroundColor: '#121212',
		borderColor: '#121212',
		borderRadius: 10
	},
	swipableButton: {
		fontWeight: 'bold',
		paddingBottom: 10,
		color: 'red'
	},
	calendarButton: {
		minHeight: '100%',
		backgroundColor: 'red'
	},
	selectedDate: {
		color: '#fff',
		alignSelf: 'center'
	},
	addView: {
		padding: 5,
		margin: 15,
		backgroundColor: '#121212'
	},
	pickedDateContainer: {
		padding: 10,
		backgroundColor: '#121212',
		color: 'white',
		flexDirection: 'row'
	},
	pickedDate: {
		padding: 10,
		borderWidth: 1,
		borderColor: '#fff',
		fontSize: 18,
		color: 'white',
		borderRadius: 10,
		textAlign: 'center',
		fontWeight: 'normal'
	},
	pickedDatePressed: {
		padding: 10,
		borderWidth: 1,
		borderColor: '#fff',
		fontSize: 18,
		color: 'white',
		borderRadius: 10,
		textAlign: 'center',
		fontWeight: 'bold'
	},
	alignContentLeft: {
		flex: 1,
		alignContent: 'flex-start'
	},
	alignTextCenter: {
		color: '#fff',
		fontSize: 20,
		alignSelf: 'center'
	},
	listItemContainerBlack: {
		backgroundColor: '#000'
	},
	authContainer: {
		flex: 1,
		backgroundColor: '#fff'
	},
	authTitle: {
		fontSize: 24,
		fontWeight: '600',
		color: '#000000',
		alignSelf: 'center',
		paddingBottom: 24
	},
	authImage: {
		flex: 1,
		justifyContent: 'center',
		opacity: 0.5
	},
	settingsTextInput: {
		flex: 1,
		borderWidth: 1,
		borderColor: 'grey',
		padding: 10,
		margin: 10,
		borderRadius: 5,
		color: '#fff',
		alignSelf: 'center'
	},
	settingsView: {
		flexDirection: 'row',
		alignContent: 'space-between',
		margin: 5
	},
	settingsText: {
		color: '#fff',
		textAlign: 'center',
		alignSelf: 'center'
	},
	calendarTitle: {
		flex: 1,
		alignSelf: 'center'
	},
	calendarRightTitle: {
		height: '100%',
		width: 1,
		backgroundColor: '#909090',
		marginRight: 5,
		marginLeft: 5
	},
	calendarSubtitle: {
		color: '#fff',
		textAlign: 'right'
	},
	calendarGoldTitleRight: {
		color: '#E8BD70',
		textAlign: 'right'
	},
	overViewTitle: {
		fontWeight: 'bold',
		color: '#E8BD70',
		textAlign: 'center',
		padding: 5
	},
	overViewSubtitle: {
		color: '#fff',
		textAlign: 'center',
		padding: 5
	},
	accountTitle: {
		fontWeight: 'bold',
		color: '#E8BD70',
		textAlign: 'center',
		padding: 10,
	}
}

export default function createStyles(overrides = {}) {
	return StyleSheet.create({...baseStyles, ...overrides})
}
