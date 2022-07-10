export interface MongoBlogPost {
  author: string,
  authorID: string,
  blogID: string,
  comments: Array<any>,
  date: Date,
  hidden: boolean,
  pageKey: string,
  stars: Array<string>,
  title: string,
}

export interface User {
  role: string,
  name: string,
  email: string,
  confirmed: Boolean,
  date: Date,
  writtenBlogs: Array<string>,
  starredBlogs: Array<string>,
  comments: Array<any>,
  bio: string,
  photo: string,
  hash: string,
  salt: string
}
