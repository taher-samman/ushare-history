import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from "react";
import DatePicker from "react-datepicker";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from '../firebase';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { show } from '../reducers/loaderState';
function AddFrom(props) {
    const dispatch = useDispatch();
    const [date, setDate] = useState(props.service.date);
    const [number, setNumber] = useState(props.service.number);
    const toTimestamp = strDate => Date.parse(strDate);
    const addService = async (e) => {
        dispatch(show());
        e.preventDefault();
        try {
            if (props.service.number === undefined || props.service.id === undefined) {
                await addDoc(collection(db, "services"), {
                    number: number, date: toTimestamp(date)
                })
                    .then(() => {
                        toast.success(`${number} added!`);
                    })
                    .catch((e) => toast.error(`Error adding document: ${e}`))
                    .finally(() => {
                        props.update();
                        // props.closeModal();
                        // dispatch(hide());
                    });
            } else {
                const firebaseDoc = doc(db, 'services', props.service.id);
                await updateDoc(firebaseDoc, {
                    number: number,
                    date: toTimestamp(date)
                }).then(() => {
                    toast.success(`${number} edited!`);
                })
                    .catch((e) => toast.error(`Error editing document: ${e}`))
                    .finally(() => {
                        props.update();
                        // props.closeModal();
                        // dispatch(hide());
                    });
            }
        } catch (e) {
            toast.error(`Error adding document: ${e}`);
        }
    }

    return (
        <Form onSubmit={e => { addService(e) }}>
            <Form.Group className="mb-3">
                <Form.Control type="text" placeholder="Number:" defaultValue={number} onChange={(e) => { setNumber(e.target.value) }} />
            </Form.Group>
            <Form.Group className="mb-3">
                <DatePicker className='form-control' placeholderText="Date:" selected={date} dateFormat='dd/MM/yyyy' onChange={(date) => setDate(date)} />
            </Form.Group>
            <Button variant="success" type="submit">
                {props.service.number === undefined ? 'Add' : 'Edit'}
            </Button>
        </Form>
    );
}

export default AddFrom;