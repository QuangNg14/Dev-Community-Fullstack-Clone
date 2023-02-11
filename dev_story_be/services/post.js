const fs = require('fs');
const path = require('path');
const { Post } = require('../models/post');

const createPost = (user, post) => {
  const newPost = new Post({
    title: post.title,
    author: user._id,
    tags: post.tags,
    photoUrl: post.photoUrl,
    like: [],
  });
  newPost.generateSlug();
  const rootFolderPath = `${path.join(__dirname, '/..')}`;
  const postFolderPath = `/public/posts/${user.username}`;

  fs.mkdirSync(rootFolderPath + postFolderPath, { recursive: true });
  fs.writeFileSync(
    rootFolderPath + postFolderPath + `/${newPost.slug}.md`,
    post.content
  );
  newPost.contentFilePath = postFolderPath + `/${newPost.slug}.md`;
  return newPost.save();
};

const getListPost = async (currentUser) => {
  const posts = await Post.aggregate()
    .limit(10)
    .sort({ createdAt: -1 })
    .lookup({
      from: 'users',
      localField: 'author',
      foreignField: '_id',
      as: 'author',
    })
    .unwind('author')
    .project({
      title: 1,
      photoUrl: 1,
      tags: 1,
      slug: 1,
      likeCount: { $size: '$like' },
      createdAt: 1,
      updatedAt: 1,
      'author._id': 1,
      'author.username': 1,
      'author.displayName': 1,
      'author.photoUrl': 1,
    })
    .exec();
  return posts;
};

const getPost = async (slug) => {
  const posts = await Post.aggregate()
    .match({ slug: slug })
    .limit(1)
    .lookup({
      from: 'users',
      localField: 'author',
      foreignField: '_id',
      as: 'author',
    })
    .unwind('author')
    .project({
      title: 1,
      photoUrl: 1,
      contentFilePath: 1,
      tags: 1,
      slug: 1,
      likeCount: { $size: '$like' },
      createdAt: 1,
      updatedAt: 1,
      author: 1,
    })
    .exec();
  return posts[0];
};

module.exports = { createPost, getListPost, getPost };
