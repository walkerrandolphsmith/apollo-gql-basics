import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.Types.ObjectId;

const MessageSchema = mongoose.Schema({
  text: {
    type: String,
  },
  userId: {
    type: ObjectId,
    ref: 'User',
  }
});

export const Message = mongoose.model('Message', MessageSchema);
