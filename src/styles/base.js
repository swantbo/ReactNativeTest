import {StyleSheet} from 'react-native'

const baseStyles = {
	container: {
		flex: 1,
		backgroundColor: '#E8BD70'
	},
	listItemRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: '#000'
	},
	listItemLeft: {
		color: '#fff',
		justifyContent: 'flex-start'
	},
	listItemRight: {
		justifyContent: 'flex-end',
		color: '#fff'
	},
	settingsContainer: {
		flex: 1,
		backgroundColor: '#000'
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#fff'
	},
	appointmentTitle: {
		fontWeight: 'bold',
		color: '#fff'
	},
	text: {
		fontSize: 16,
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
	cardGold: {
		backgroundColor: '#E8BD70',
		padding: 0,
		margin: 0,
		borderColor: '#E8BD70'
	},
	scrollView: {
		backgroundColor: '#000',
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15
	},
	pricingCard: {
		backgroundColor: '#121212',
		borderColor: '#000',
		color: '#E8BD70',
		marginTop: 0
	},
	cardTitle: {
		fontSize: 24,
		color: '#E8BD70'
	},
	listItemContainer: {
		backgroundColor: '#121212'
	},
	searchContainer: {
		backgroundColor: '#121212'
	},
	listItemTitle: {
		fontWeight: 'bold',
		color: '#E8BD70'
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
	listItemSubTitle: {
		color: '#fff'
	},
	listItemNoAppointments: {
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
	barberPricing: {
		fontSize: 20,
		color: '#fff'
	},
	barberSocialIcons: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: '#121212',
		margin: 0,
		marginLeft: 15,
		marginRight: 15,
		padding: 5
	},
	socialIcons: {
		backgroundColor: '#E8BD70'
	},
	barberAddress: {
		borderRadius: 5,
		backgroundColor: '#121212',
		borderColor: '#121212'
	},
	addressTitle: {
		fontSize: 15,
		fontWeight: 'bold',
		color: '#fff'
	},
	addressText: {
		fontSize: 15,
		fontWeight: 'normal',
		color: '#fff'
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
	goldButton: {
		backgroundColor: '#E8BD70',
		borderRadius: 5,
		padding: 10,
		margin: 5
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
	calendarTitle: {
		color: '#E8BD70',
		fontSize: 17
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
	goldButton: {
		backgroundColor: '#E8BD70',
		borderRadius: 10,
		marginTop: 10
	},
	buttonTitle: {
		color: '#000',
		padding: 5,
		fontWeight: 'bold',
		alignSelf: 'center',
		fontSize: 17
	},
	footer: {
		flex: 1,
		justifyContent: 'flex-end'
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#fff'
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
	pointsCard: {
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
	btnContainer: {
		padding: 30
	},
	alignContent: {
		flex: 1,
		alignContent: 'flex-start'
	},
	alignText: {
		color: '#fff',
		fontSize: 20,
		alignSelf: 'center'
	},
	viewFlex: {
		flex: 1
	},
	listItemContainerBlack: {
		backgroundColor: '#000'
	}
}

export default function createStyles(overrides = {}) {
	return StyleSheet.create({...baseStyles, ...overrides})
}
