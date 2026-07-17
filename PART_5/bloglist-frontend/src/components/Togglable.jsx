import { useState } from 'react'

const Togglable = ({ buttonLabel, children }) => {
  const [visible, setVisible] = useState(false)

  if (!visible) {
    return (
      <button onClick={() => setVisible(true)}>
        {buttonLabel}
      </button>
    )
  }

  return (
    <div>
      {children}

      <button onClick={() => setVisible(false)}>
        cancel
      </button>
    </div>
  )
}

export default Togglable