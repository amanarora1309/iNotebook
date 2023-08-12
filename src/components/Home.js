import React from 'react'
import Notes from './Notes'

const home = (props) => {
  const {showAlert} = props;
  return (
    <div>
      <div className="container my-3">
        <Notes showAlert={showAlert} />
      </div>
    </div>
  )
}

export default home
