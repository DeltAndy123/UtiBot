import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  _id: String,
  disabled: [
    String
  ]
});

// {
//   _id: 822961173380333598,
//   disabled: [
//     'impersonate'
//   ]
// }

export default mongoose.model('cmd-overrides', schema, 'cmd-overrides');