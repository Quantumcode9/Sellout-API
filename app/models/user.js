const mongoose = require('mongoose')



const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        name: { 
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            default: false,
          },
        hashedPassword: {
            type: String,
            required: true,
        },
        token: String,
        cart: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TV',
        }],  
        cart2: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        }],
        },
    {
        timestamps: true,
        toObject: {
            transform: (_doc, user) => {
                delete user.hashedPassword
                return user
            },
        },
    }
)

module.exports = mongoose.model('User', userSchema)