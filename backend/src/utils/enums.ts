export enum RouteIds {
  USER_ID = ':userId',
  UNFOLLOW_ID = ':unfollowId',
  POST_ID = ':postId',
  COMMENT_ID = ':commentId',
  CATEGORY_ID = ':categoryId',
  TAG_ID = ':tagId',
}

export enum Routes {
  USERS = 'users',
  POSTS = 'posts',
  COMMENTS = 'comments',
  AUTH = 'auth',
  AI = 'ai',
  TAGS = 'tags',
  CATEGORIES = 'categories',
}

export enum PostSubRoutes {
  VOTES = 'votes',
}

export enum UserSubRoutes {
  FOLLOWERS = 'followers',
  FOLLOWING = 'following',
}

export enum AuthRoutes {
  REGISTER = 'register',
  LOGIN = 'login',
  LOGOUT = 'logout',
  PROFILE = 'profile',
}
