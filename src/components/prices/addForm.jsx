import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from "react";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from '../../firebase';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { show } from '../../reducers/loaderState';
function AddFrom(props) {
    const dispatch = useDispatch();
    const [gb, setGb] = useState(props.gb.gb);
    const [price, setPrice] = useState(props.gb.price);
    const addGb = async (e) => {
        dispatch(show());
        e.preventDefault();
        if (window.confirm('sure?')) {
            try {
                if (props.gb.gb === undefined || props.gb.id === undefined) {
                    await addDoc(collection(db, "gb"), {
                        gb: gb, price: parseFloat(price), order: 0
                    })
                        .then(() => {
                            toast.success(`${gb} added!`);
                        })
                        .catch((e) => toast.error(`Error adding document: ${e}`))
                        .finally(props.update);
                } else {
                    const firebaseDoc = doc(db, 'gb', props.gb.id);
                    await updateDoc(firebaseDoc, {
                        gb: gb,
                        price: price
                    }).then(() => {
                        toast.success(`${gb} edited!`);
                    })
                        .catch((e) => toast.error(`Error editing document: ${e}`))
                        .finally(props.update);
                }
            } catch (e) {
                toast.error(`Error adding document: ${e}`);
            }
        }
    }

    return (
        <Form onSubmit={e => { addGb(e) }}>
            <Form.Group className="mb-3">
                <Form.Control type="text" placeholder="Gb:" defaultValue={gb} onChange={(e) => { setGb(e.target.value) }} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Control type="number" placeholder="Price:" step="0.1" defaultValue={price} onChange={(e) => { setPrice(e.target.value) }} />
            </Form.Group>
            <Button variant="success" type="submit">
                {props.gb.gb === undefined ? 'Add' : 'Edit'}
            </Button>
        </Form>
    );
}

export default AddFrom;