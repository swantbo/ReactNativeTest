import {StyleSheet} from 'react-native'

const baseStyles = {
	container: {
		flex: 1,
		backgroundColor: '#E8BD70'
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
		margin: 0,
		borderColor: '#000',
		color: '#E8BD70'
	},
	cardTitle: {
		fontSize: 24,
		color: '#E8BD70'
	},
	listItemContainer: {
		backgroundColor: '#000'
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
		flex: 1
	},
	image: {
		flex: 1,
		aspectRatio: 1 / 1
	},
	containerImage: {
		flex: 1 / 2
	}
}

export default function createStyles(overrides = {}) {
	return StyleSheet.create({...baseStyles, ...overrides})
}
