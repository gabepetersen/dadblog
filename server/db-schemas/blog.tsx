import mongoose from 'mongoose';

var blogSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  authorID: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  stars: {
    type: Array,
    required: true
  },
  comments: {
    type: Array,
    required: true
  },
  hidden: {
    type: Boolean,
    required: true
  }
});

blogSchema.methods.getFileName = function () {
  return (this._id.toString() + '_' + this.title.toLowerCase().replace(/ /g, '-') + '.md');
}

blogSchema.methods.getFileID = function () {
  return (this.title.toLowerCase().replace(/ /g, '-'));
}

// brash workaround - probably shouldn't do this
var blogModel;
try {
  blogModel = mongoose.model('Blog');
} catch (error) {
  blogModel = mongoose.model('Blog', blogSchema);
}

export default blogModel;