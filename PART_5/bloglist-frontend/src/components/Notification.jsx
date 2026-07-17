const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  const style = {
    color: notification.type === 'success' ? 'green' : 'red',
    backgroundColor: '#f0f0f0',
    border: `2px solid ${
      notification.type === 'success' ? 'green' : 'red'
    }`,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    fontSize: 18
  }

  return (
    <div style={style}>
      {notification.message}
    </div>
  )
}

export default Notification