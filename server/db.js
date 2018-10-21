const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const uri = require('./dbconfig');

mongoose.connect(uri, {useNewUrlParser: true})
  .then(() => console.log('Connected to db'))
  .catch((err) => console.log('Database error:', err));
const db = mongoose.connection;

const postSchema = new Schema({
  text:   { type: String, default: '' },
}, {
  timestamps: true
});

const threadSchema = new Schema({
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
}, {
  timestamps: true
});

module.exports = {
  Post: db.model('Post', postSchema),
  Thread: db.model('Thread', threadSchema)
};
