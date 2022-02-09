const {DataTypes} = require('sequelize')

module.exports = model

function model(sequelize) {
	const attributes = {
		name: {type: DataTypes.STRING, allowNull: false},
		phone: {type: DataTypes.STRING, allowNull: false},
		mensPrice: {type: DataTypes.STRING, allowNull: false},
		kidsPrice: {type: DataTypes.STRING, allowNull: false},
		address: {type: DataTypes.STRING, allowNull: false},
		tuesday: {type: DataTypes.STRING, allowNull: true},
		wednesday: {type: DataTypes.STRING, allowNull: true},
		thrusday: {type: DataTypes.STRING, allowNull: false},
		friday: {type: DataTypes.STRING, allowNull: false},
		saturday: {type: DataTypes.STRING, allowNull: false},
		bio: {type: DataTypes.STRING, allowNull: false},
		instagram: {type: DataTypes.STRING, allowNull: false},
		website: {type: DataTypes.STRING, allowNull: false}
	}

	return sequelize.define('Admin', attributes, options)
}
