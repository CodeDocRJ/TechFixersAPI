const mongoose = require( 'mongoose' );

const tokenSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        token: {
            type: String,
            required: false,
        },
        expiresIn: {
            type: Date,
            required: false
        } // Set expiration time for blacklisted tokens
    }, {
    timestamps: true,
}
);
const TokenModel = mongoose.model( 'Token', tokenSchema );

module.exports = TokenModel;