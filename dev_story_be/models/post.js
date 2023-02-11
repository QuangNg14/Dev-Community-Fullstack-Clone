const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = Schema(
  {
    title: {
      type: String,
      required: true,
    },
    photoUrl: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [String],
    contentFilePath: String,
    slug: {
      type: String,
      required: true,
    },
    like: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

postSchema.methods.generateSlug = function () {
  this.slug =
    this.title
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '') +
    '-' +
    this._id;
};

const Post = mongoose.model('Post', postSchema);
module.exports = { Post, postSchema };
