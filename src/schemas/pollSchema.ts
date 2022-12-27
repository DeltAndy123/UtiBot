import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  _id: String,
  question: {
    type: String,
    required: true,
  },
  options: Array,
  votes: Array,
  author: {
    type: String,
    required: true,
  },
  messageId: {
    type: String,
    required: true,
  },
  channelId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
});

export default mongoose.model('polls', schema, 'polls');