export enum RouteIds {
  USER_ID = ':userId',
  UNFOLLOW_ID = ':unfollowId',
  POST_ID = ':postId',
  COMMENT_ID = ':commentId',
}

export enum Routes {
  USERS = 'users',
  POSTS = 'posts',
  COMMENTS = 'comments',
  AUTH = 'auth',
  AI = 'ai',
}

export enum UserRoutes {
  FOLLOWERS = 'followers',
  FOLLOWING = 'following',
}

export enum AuthRoutes {
  REGISTER = 'register',
  LOGIN = 'login',
  LOGOUT = 'logout',
  PROFILE = 'profile',
}
