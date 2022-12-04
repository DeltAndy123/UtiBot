import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  _id: String, // guild id
  channel: String, // channel to log messages to
  enabled: Boolean, // whether or not logging is enabled
  events: Object, // events to log
});

export default mongoose.model('logger-settings', schema, 'logger-settings');