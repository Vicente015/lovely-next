const ContextMenu = ({ xPos, yPos, onClose, items }) => {
  const style = {
    position: 'fixed',
    top: yPos,
    left: xPos,
    zIndex: 100,
    background: 'white',
    border: '1px solid #ccc',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    padding: '0.5rem',
    borderRadius: '4px'
  }

  const handleClick = (action) => {
    action()
    onClose()
  }

  return (
    <div style={style}>
      {items.map((item, index) => (
        <div key={index} onClick={() => { handleClick(item.action) }}>
          {item.text}
        </div>
      ))}
    </div>
  )
}

export default ContextMenu
