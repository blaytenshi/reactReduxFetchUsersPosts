import _ from 'lodash';
import jsonPlaceholder from '../apis/jsonPlaceholder';

/* 
  This is bad design because this action creator doesn't return a plain object!
  Redux will tell you to use a middleware. Redux-thunk to the rescue!
// this will return a Promise instead of a plain object!
export const fetchPosts = async () => {
  const response = await jsonPlaceholder.get('/posts');

  return {
    type: 'FETCH_POSTS',
    payload: response
  };
};
  */

export const fetchPosts = () => async (dispatch, getState) => {
  const response = await jsonPlaceholder.get('/posts');

  dispatch({ type: 'FETCH_POSTS', payload: response.data });
};

export const fetchUser = id => async (dispatch, getState) => {
  const response = await jsonPlaceholder.get(`/users/${id}`);

  dispatch({ type: 'FETCH_USER', payload: response.data });
};

export const fetchPostsAndUsers = () => async (dispatch, getState) => {
  await dispatch(fetchPosts());
  // _.map will take the list of posts and get all the 'userId' values out into an array
  // then _.uniq will look at the array returned by map and make sure there's no repeats
  // const userIds = _.uniq(_.map(getState().posts, 'userId'));
  // console.log('USERIDS', userIds);
  // userIds.forEach(id => dispatch(fetchUser(id))); // using Arrays.forEach

  _.chain(getState().posts)
    .map('userId')
    .uniq()
    .forEach(id => dispatch(fetchUser(id))) // using Lodash's forEach
    .value();
};

// lodash's memoise function basically takes a function and makes sure that it's only called once
// with the given parameters. If the same function is called with the same parameters, it will
// simply return the cached values. This will work in some cases but what if you wanna refetch the
// updated users? You can't do that. Use this solution with caution.
/*
export const fetchUser = id => dispatch => _fetchUser(id, dispatch);
const _fetchUser = _.memoize(async (id, dispatch) => {
  const response = await jsonPlaceholder.get(`/users/${id}`);

  dispatch({ type: 'FETCH_USER', payload: response.data });
});
*/
