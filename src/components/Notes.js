import React, { useContext, useEffect, useRef, useState } from 'react'
import noteContext from '../context/notes/noteContext'
import NoteItem from './NoteItem';
import AddNote from './AddNote';
import { useNavigate } from "react-router-dom";

const Notes = (props) => {
  const { showAlert } = props
  const navigate = useNavigate()
  const context = useContext(noteContext);
  const { notes, getNotes, editNote } = context;
  useEffect(() => {
    if (localStorage.getItem('token')) {
      getNotes()
    }
    else {
      navigate("/login")
    }
  }, [])

  const ref = useRef(null);
  const refClose = useRef(null);
  const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "" })
  const [id, setId] = useState({ id: "" });



  const updateNote = (currentNote) => {
    ref.current.click();
    setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag });

  }

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value })
  }
  const handleclick = (e) => {
    refClose.current.click();
    editNote(note.id, note.etitle, note.edescription, note.etag);
    props.showAlert("Updated Successfully", "success");
  }

  return (
    <>
      <AddNote showAlert={showAlert} />

      <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModalCenter">
        Launch demo modal
      </button>

      <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">Modal title</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="etitle" className="form-label">Title</label>
                  <input type="text" className="form-control" id="etitle" name="etitle" value={note.etitle} aria-describedby="emailHelp" onChange={onChange} minLength={5} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="edescription" className="form-label">Description</label>
                  <input type="text" className="form-control" id="edescription" name="edescription" value={note.edescription} onChange={onChange} minLength={5} required />
                </div>
                <div className="mb-3">
                  <label htmlFor="etag" className="form-label">Tag</label>
                  <input type="text" className="form-control" id="etag" name="etag" value={note.etag} onChange={onChange} minLength={5} required />
                </div>
                {/* <button type="submit" className="btn btn-primary"onClick={handleclick}>Add Note</button> */}
              </form>
            </div>
            <div className="modal-footer">
              <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button disabled={note.etitle.length < 5 || note.edescription.length < 5} type="button" className="btn btn-primary" onClick={handleclick}>Update</button>
            </div>
          </div>
        </div>
      </div>







      <div className='row my-3' >

        <div className="container mx-2">
          {notes.length === 0 && 'No notes to display'}
        </div>
        {notes.map((note) => {
          return <NoteItem key={note._id} updateNote={updateNote} showAlert={showAlert} note={note} setId={setId} />

        })}
      </div>
    </>
  )
}

export default Notes
