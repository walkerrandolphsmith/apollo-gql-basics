import crypto from 'crypto';
import mongoose from 'mongoose';

const tokenGenerator = (userId) => new Promise(resolve => {
    crypto.randomBytes(48, (ex, buf) => {
        const token = buf.toString('base64')
            .replace(/\//g, '_')
            .replace(/\+/g, '-')
            .toString()
            .slice(1, 24);
        resolve(`${userId}-${token}`);
    });
});

export let Token;

let TokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        index: true
    },
    token: {
        type: String,
        index: true
    },
    type: {
        type: String
    }
});

TokenSchema.statics.new = (userId, type) => new Promise((resolve, reject) => {
    const token = new Token();
    tokenGenerator(userId).then(t => {
        token.token = t;
        token.userId = userId;
        token.type = type;
        token.save((err) => {
            if(err) reject(err);
            resolve(token);
        })
    }).catch(err => reject(err));
});

Token = mongoose.model('Token', TokenSchema);
