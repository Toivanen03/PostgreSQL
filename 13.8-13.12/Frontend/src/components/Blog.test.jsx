import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/blogUser-event'
import { describe, test, expect } from 'vitest'
import Blog from './Blog'
import BlogForm from './BlogForm'

describe('Blog component', () => {
  test('renders blog title', () => {
      const blog = {
          title: 'Test Blog Title'
      }
    
      render(<Blog blog={blog} onLike={() => {}} onRemove={() => {}} />)
    
      const element = screen.getByText('Test Blog Title')
      expect(element).toBeDefined()
    })

    test('displays blog details when the View button is clicked', async () => {
      const blog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'http://testblog.com',
        likes: 42,
        blogUser: { username: 'testuser', name: 'Test BlogUser' }
      }
    
      const mockOnLike = vi.fn()
      const mockOnRemove = vi.fn()
    
      render(
        <Blog 
          blog={blog} 
          onLike={mockOnLike} 
          onRemove={mockOnRemove} 
          currentUser={{ username: 'testuser' }} 
        />
      )

      const button = screen.getByText('View')
      await userEvent.click(button)

      expect(screen.getByText((content) => content.includes(blog.url))).toBeInTheDocument()
      expect(screen.getByText((content) => content.includes(`Likes: ${blog.likes}`))).toBeInTheDocument()
      expect(screen.getByText((content) => content.includes(`Added by: ${blog.blogUser.name}`))).toBeInTheDocument()
    })

    test('clicking like twice calls event handler twice', async () => {
      const blog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'http://testblog.com',
        likes: 42,
        blogUser: { username: 'testuser', name: 'Test BlogUser' }
      }
    
      const mockOnLike = vi.fn()
      const mockOnRemove = vi.fn()
    
      render(
        <Blog 
          blog={blog} 
          onLike={mockOnLike} 
          onRemove={mockOnRemove} 
          currentUser={{ username: 'testuser' }} 
        />
      )

      const viewButton = screen.getByText('View')
      await userEvent.click(viewButton)

      const likeButton = screen.getByText('Like')
      await userEvent.click(likeButton)
      await userEvent.click(likeButton)

      expect(mockOnLike.mock.calls).toHaveLength(2)
    })

  test('calls createBlog with correct props on submission', async () => {
    const mockCreateBlog = vi.fn()

    render(<BlogForm createBlog={mockCreateBlog} />)

    const blogUser = userEvent.setup()

    const titleInput = screen.getByPlaceholderText('Title')
    const authorInput = screen.getByPlaceholderText('Author')
    const urlInput = screen.getByPlaceholderText('URL')
    const sendButton = screen.getByText('Send')

    await blogUser.type(titleInput, 'Testing React Components')
    await blogUser.type(authorInput, 'John Doe')
    await blogUser.type(urlInput, 'http://example.com')
    await blogUser.click(sendButton)

    expect(mockCreateBlog).toHaveBeenCalledTimes(1)
    expect(mockCreateBlog).toHaveBeenCalledWith({
      title: 'Testing React Components',
      author: 'John Doe',
      url: 'http://example.com'
    })
  })
})