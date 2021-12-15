import React from 'react'
import {StyleSheet} from 'react-native'

const baseStyles = {
	container: {
		flex: 1,
		backgroundColor: '#E8BD70'
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
		backgroundColor: '#000',
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
	}
}

export default function createStyles(overrides = {}) {
	return StyleSheet.create({...baseStyles, ...overrides})
}
