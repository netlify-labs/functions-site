import React from 'react'
import '../index.css'

const Base = ({ children, className }) => {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

export default Base
