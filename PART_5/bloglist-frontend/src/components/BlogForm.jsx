const BlogForm = ({
  addBlog,
  title,
  author,
  url,
  setTitle,
  setAuthor,
  setUrl
}) => {

  return (
    <form onSubmit={addBlog}>

      <div>
        title
        <input
          value={title}
          onChange={({ target }) =>
            setTitle(target.value)
          }
        />
      </div>

      <div>
        author
        <input
          value={author}
          onChange={({ target }) =>
            setAuthor(target.value)
          }
        />
      </div>

      <div>
        url
        <input
          value={url}
          onChange={({ target }) =>
            setUrl(target.value)
          }
        />
      </div>

      <button type="submit">
        create
      </button>

    </form>
  )
}

export default BlogForm