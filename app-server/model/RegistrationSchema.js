const mongoose = require('mongoose')

const UserRegistation = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true },
        age:      { type: String, required: true},
        phone:    { type: String, required: true},
        email:    {type:String,   required: true}
	},
	{ collection: 'registration' }
)

const modelRegister = mongoose.model('UserRegistation', UserRegistation)

module.exports = modelRegister