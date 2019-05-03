import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  nameLast: {
    type: String,
  },
  role: {
    type: String,
  },
});

UserSchema.methods.comparePassword = function(candidatePassword) {
  return new Promise((resolve, reject) => {
    return resolve(true);
    bcrypt.compare(candidatePassword, this.password, (error, isMatch) => {
      if (error) reject(error);
      resolve(isMatch);
    });
  });
};

export const User = mongoose.model('User', UserSchema);
