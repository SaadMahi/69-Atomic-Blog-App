import { createContext, useContext, useEffect, useState } from 'react';
import { faker } from '@faker-js/faker';

function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

/** CONTEXT API
 * So context api's have three parts
 * * There is a provider
 * * There is a value
 * * Then there are all the consumer components 📦 which will read the value from the context
 */

/** STEP 1) CREATE A PROVIDER
 * for that we need to create a new context and to do that we create
 * createContext which is a function that is inlcuded in React just like useState or useEffect
 * now into this createContext function we can pass in default value but we usually don't pass in anything
 *
 * as that value won't change over time, therrefore it's use less to do that,
 * instead we usually pass in null or we just leave this empty which we are going to do that in this case
 *
 * Anyway's this createContext returns us a context let's call this context a PostContext in this case
 * as we will be storing in here about posts, a thing to notice here is the variable name is in pascal case
 * the reason to do that is that this PostContext is a component and we know components use uppercase letter
 * in the beginning
 *
 *
 */

// STEP 1) here we have our context, now we need to use this, go below to find step 1 continuation
const PostContext = createContext();

function App() {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isFakeDark, setIsFakeDark] = useState(false);

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

  // Whenever `isFakeDark` changes, we toggle the `fake-dark-mode` class on the HTML element (see in "Elements" dev tool).
  useEffect(
    function () {
      document.documentElement.classList.toggle('fake-dark-mode');
    },
    [isFakeDark]
  );

  /** STEP 1) continuation... PASSING IN THE VALUE TO CONTEXT PROVIDER
   * right here below in the jsx we can use this component
   * so we will be making it parent component of all the jsx below this PostContext
   * so PostContext. by using dot we use the Provider property on it
   * next we close the whole code with this component <PostContext.Provider>  </PostContext.Provider>
   */

  return (
    /** STEP 2) PROVIDE VALUES TO THE CHILD COMPONENTS 📦
     * To do that we specify value prop to the component
     * Then within that we define an object
     * So in here we need an object which will contain
     * all the data that we want to make accessible to the child component
     * which are similar to props and values we pass in but here
     * it will be in key value pairs, that's the only difference
     *
     * Next thing to look in is as you can see these key values, one thing to note is that
     * usually 1 context is created per state domain example:
     * 1 context for the post like: posts, onAddPost and onClearPosts
     * 2nd context for only for search data which is searchQuery and setSearchQuery
     * So we have created a PostContext therefore it should only be for the posting parts
     * Then we could have also created a SearchContext where we would have placed those search data's
     * Therefore that would have been a cleaner code, but here we are just learning how context works
     * So that's not really a problem
     */

    <PostContext.Provider
      value={{
        posts: searchedPosts,
        onAddPost: handleAddPost,
        onClearPosts: handleClearPosts,
        searchQuery, // remember having this -> searchQuery is same like searchQuery: searchQuery.
        setSearchQuery,
      }}
    >
      <section>
        <button
          onClick={() => setIsFakeDark((isFakeDark) => !isFakeDark)}
          className='btn-fake-dark-mode'
        >
          {isFakeDark ? '☀️' : '🌙'}
        </button>

        <Header
        // ! Let's remove these props and read(pass) in the values through context e created
        // * Let's move on to the header section now
        // posts={searchedPosts}
        // onClearPosts={handleClearPosts}
        // searchQuery={searchQuery}
        // setSearchQuery={setSearchQuery}
        />
        <Main posts={searchedPosts} onAddPost={handleAddPost} />
        <Archive onAddPost={handleAddPost} />
        <Footer />
      </section>
    </PostContext.Provider>
  );
}

function Header() {
  /** STEP 3) USE CONTEXT HOOK TO CONSUME CONTEXT VALUE
   * Here values are further passed by props to other components as you can see below those are:
   * posts, searchQuery and setSearchQuery except the onClearPosts that we will be using
   * with the help of useConext hook
   *
   * So ussContext hook comes into the picture
   * Here we need to pass in the entire context object into this function which we made previously
   * that is PostContext which will return's us the entire value which we passed into the context
   * So what we can do is destrcuture it and take out the only part we need
   */

  // * CONSUMING THE CONTEXT VALUE
  const { onClearPosts } = useContext(PostContext);

  return (
    <header>
      <h1>
        <span>⚛️</span>The Atomic Blog
      </h1>
      <div>
        <Results />
        <SearchPosts />

        {/* <Results posts={posts} /> */}
        {/* <SearchPosts
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        /> */}
        <button onClick={onClearPosts}>Clear posts</button>
      </div>
    </header>
  );
}

function SearchPosts() {
  // * CONSUMING THE CONTEXT VALUE
  const { searchQuery, setSearchQuery } = useContext(PostContext);

  return (
    <input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder='Search posts...'
    />
  );
}

function Results() {
  // * CONSUMING THE CONTEXT VALUE
  const { posts } = useContext(PostContext);

  return <p>🚀 {posts.length} atomic posts found</p>;
}

function Main({ posts, onAddPost }) {
  return (
    <main>
      <FormAddPost onAddPost={onAddPost} />
      <Posts posts={posts} />
    </main>
  );
}

function Posts({ posts }) {
  return (
    <section>
      <List posts={posts} />
    </section>
  );
}

function FormAddPost({ onAddPost }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = function (e) {
    e.preventDefault();
    if (!body || !title) return;
    onAddPost({ title, body });
    setTitle('');
    setBody('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder='Post title'
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder='Post body'
      />
      <button>Add post</button>
    </form>
  );
}

function List({ posts }) {
  return (
    <ul>
      {posts.map((post, i) => (
        <li key={i}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </li>
      ))}
    </ul>
  );
}

function Archive({ onAddPost }) {
  // Here we don't need the setter function. We're only using state to store these posts because the callback function passed into useState (which generates the posts) is only called once, on the initial render. So we use this trick as an optimization technique, because if we just used a regular variable, these posts would be re-created on every render. We could also move the posts outside the components, but I wanted to show you this trick 😉
  const [posts] = useState(() =>
    // 💥 WARNING: This might make your computer slow! Try a smaller `length` first
    Array.from({ length: 10000 }, () => createRandomPost())
  );

  const [showArchive, setShowArchive] = useState(false);

  return (
    <aside>
      <h2>Post archive</h2>
      <button onClick={() => setShowArchive((s) => !s)}>
        {showArchive ? 'Hide archive posts' : 'Show archive posts'}
      </button>

      {showArchive && (
        <ul>
          {posts.map((post, i) => (
            <li key={i}>
              <p>
                <strong>{post.title}:</strong> {post.body}
              </p>
              <button onClick={() => onAddPost(post)}>Add as new post</button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

function Footer() {
  return <footer>&copy; by The Atomic Blog ✌️</footer>;
}

export default App;
