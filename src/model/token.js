import mongoose from 'mongoose';

const TokenSchema = mongoose.Schema({
    token: {
        type: String,
        required: true
    }
});


export const Token = mongoose.model('Token', TokenSchema);

