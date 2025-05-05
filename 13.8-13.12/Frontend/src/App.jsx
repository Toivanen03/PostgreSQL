import '../App.css'
import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [messageType, setMessageType] = useState('')
  const [message, setMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [blogUser, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const blogUser = JSON.parse(loggedUserJSON)
      setUser(blogUser)
      blogService.setToken(blogUser.token)
    }
  }, [])

  useEffect(() => {
    if (blogUser) {
      blogService.getAll().then(blogs => setBlogs(blogs))
    }
  }, [blogUser])

  if (!blogs) {
    return null
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const blogUser = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(blogUser)
      ) 
      blogService.setToken(blogUser.token)
      setUser(blogUser)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessageType('error')
      setMessage('wrong credentials')
      timeout()
    }
  }

  const handleLogout = (event) => {
    window.localStorage.removeItem('loggedBlogAppUser')
  }

  const loginForm = () => (
    <Togglable buttonLabel="login"
      onCancel={() => {
      setUsername('')
      setPassword('')
    }}
    >
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  )

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
    .create(blogObject)
    .then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))
    })
    .catch(error => {
      setMessage(`Virhe muistiinpanon lisäämisessä: ${error.message}`)
      timeout()
    })
  }

  const updateBlogLikes = (id, updatedBlog) => {
      blogService
      .update(id, updatedBlog)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id === id ? returnedBlog : blog))
        setMessageType('normal')
        setMessage(`Tykätty!`)
        timeout()
      })
      .catch(error => {
        setMessageType('error')
        setMessage(`Virhe: ${error.message}`)
        timeout()
      })
  }

  const deleteBlog = (id, title) => {
    if (window.confirm(`Haluatko varmasti poistaa blogin ${title}?`)) {
      blogService
      .remove(id)
      .then(() => {
        setBlogs(blogs.filter(blog => blog.id !== id))
        setMessageType('normal')
        setMessage(`Blogi poistettu`)
        timeout()
      })
      .catch(error => {
        setMessageType('error')
        setMessage(`Virhe: ${error.message}`)
        timeout()
      })
    } else {
      alert('Poisto peruttu')
    }
}
  

  const timeout = () => (
    setTimeout(() => {
      setMessageType(null)
      setMessage(null)
    }, 3000)
  )

  const logoutForm = () => (
    <form onSubmit={handleLogout}>
      <button type="submit">Log out</button>
    </form>  
  )

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={message} type={messageType} />
      <h2>Login</h2>
      {!blogUser && loginForm()} 
      {blogUser && <div>
        <p>{blogUser.name} logged in</p>
          {logoutForm()}
        <br/>
        <Togglable buttonLabel='New blog' ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>
      </div>
      }
      <h3>Blogs:</h3>
      {blogs
      .sort((a, b) => b.likes - a.likes)
      .map(blog => (
        <Blog 
          key={blog.id} 
          blog={blog} 
          onLike={updateBlogLikes}
          onRemove={deleteBlog}
          currentUser={blogUser}
        />
))}
    </div>
  )
}

export default App