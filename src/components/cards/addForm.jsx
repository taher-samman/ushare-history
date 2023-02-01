import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from "react";
import DatePicker from "react-datepicker";
import { collection, addDoc } from "firebase/firestore";
import { db, encryptData, getAvailableStatus, getCardTypeLabel } from '../../firebase';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { show } from '../../reducers/loaderState';
import TypesSelect from './typesSelect';
function AddFrom(props) {
    const dispatch = useDispatch();
    const [date, setDate] = useState(null);
    const [type, setType] = useState(null);
    const [code, setCode] = useState(null);
    const toTimestamp = strDate => Date.parse(strDate);
    const addCard = async (e) => {
        e.preventDefault();
        if (code.length !== 15 || date === null || type === null) {
            toast.error(`Error`);
            return;
        }
        dispatch(show());
        try {
            await addDoc(collection(db, "cards"), {
                code: encryptData(code),
                date: toTimestamp(date),
                type: type,
                status: getAvailableStatus().type,
                takedAt: null
            })
                .then(() => {
                    toast.success(`${getCardTypeLabel(type)} added!`);
                })
                .catch((e) => toast.error(`Error adding document: ${e}`))
                .finally(() => {
                    props.update();
                });
        } catch (e) {
            toast.error(`Error adding document: ${e}`);
        }
    }

    return (
        <Form onSubmit={e => { addCard(e) }}>
            <Form.Group className="mb-3">
                <Form.Control type="number" placeholder="code:" required={true} defaultValue={code} onChange={(e) => { setCode(e.target.value) }} />
            </Form.Group>
            <Form.Group className="mb-3">
                <DatePicker className='form-control' placeholderText="Date:" selected={date} dateFormat='dd/MM/yyyy' onChange={(date) => setDate(date)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <TypesSelect handleChange={(e) => setType(e.target.value)} />
            </Form.Group>
            <Button variant="success" type="submit">
                Add
            </Button>
        </Form>
    );
}

export default AddFrom;