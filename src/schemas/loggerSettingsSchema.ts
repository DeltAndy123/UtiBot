import mongoose from 'mongoose';

function reqVal(val: any) {
  return {
    type: val,
    required: true
  } as any
}

const schema = new mongoose.Schema({
  _id: reqVal(String), // guild id
  channel: reqVal(String), // channel to log messages to
  enabled: reqVal(Boolean), // whether or not logging is enabled
  events: reqVal(Object), // events to log
});

export default mongoose.model('logger-settings', schema, 'logger-settings');