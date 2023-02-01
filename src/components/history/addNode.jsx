import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { ImPlus } from 'react-icons/im';
import AddFrom from './addForm';
function AddNode(props) {
  return (
    <>
      <Button variant="" onClick={props.onOpen}>
        <ImPlus />
      </Button>

      <Modal show={props.show} onHide={props.onClose} centered>
        <Modal.Body>
            <AddFrom update={props.update} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddNode;