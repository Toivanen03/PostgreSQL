import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, onLike, onRemove, currentUser }) => {
  const [visible, setVisible] = useState(false)

  const toggleView = () => {
    setVisible(!visible)
  }

  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      blogUser: blog.blogUser
    }
    onLike(blog.id, updatedBlog)
  }

  const removeBlog = () => {
    onRemove(blog.id, blog.title)
  }

  return (
    <div className="blogStyle">
      <br />
      {blog.title}
      <button type="button" onClick={toggleView}>
        {visible ? 'Hide' : 'View'}
      </button>
      {visible && (
        <div>
          {blog.author}
          <br />
          {blog.url}
          <br />
          <span data-testid="likes-count">Likes: {blog.likes}</span>
          <button type="button" onClick={handleLike}>Like</button><br/>
          Added by: {blog.blogUser.name}
          <br/>
          {currentUser && currentUser.name === blog.blogUser.name && (
            <button type="button" onClick={removeBlog}>Remove blog</button>
          )}
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  onLike: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
}

export default Blog