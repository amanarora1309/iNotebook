import React, { useContext } from 'react'
import noteContext from '../context/notes/noteContext'

const NoteItem = (props) => {
  const context = useContext(noteContext);
  const { deleteNote, editNote } = context;
  const { note, updateNote, setId } = props
  return (
    <div className='col-md-3'>
      <div className="card my-3">
        <div className="card-body">
          <div className="d-flex align-item-center">
            <h5 className="card-title">{note.title}</h5>
            <i className="bi bi-trash3 mx-2" onClick={ () => {deleteNote(note._id); props.showAlert("Deleted Note Successfully", "success")
            }}></i>
            <i className="bi bi-pencil-square mx-2" onClick={ () => {updateNote(note), setId({id: note._id})}}></i>
          </div>
          <p className="card-text">{note.description}</p>
        </div>
      </div>

    </div>
  )
}

export default NoteItem
