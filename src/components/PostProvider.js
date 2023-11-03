import React, { createContext, useState } from 'react';
import { faker } from '@faker-js/faker';
import { useContext } from 'react';

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

/** ADVANCE PATTERN, A CUSTOM PROVIDER
 * Now the idea is to remove all the state's and state updating logics all from these components
 * and place them into our own custom context providor component
 *
 * So what we gonna follow is three steps:
 * * creating the context
 * * providing a value
 * * reading those values
 */

const PostContext = createContext();

const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }

  return (
    <PostContext.Provider
      value={{
        posts: searchedPosts,
        onAddPost: handleAddPost,
        onClearPosts: handleClearPosts,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

// custom hook...
// we have done error handling in this coz if we use it out of PostProvidor
// it returns undefined and doesn't pops error

function usePosts() {
  const context = useContext(PostContext);
  if (context === undefined)
    throw new Error('Post context was used outside of the PostProvider');
  return context;
}

export { PostProvider, usePosts };
