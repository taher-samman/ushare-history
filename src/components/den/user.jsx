import { calculateUserTotal, db, formatPrice } from "../../firebase";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from "react";
import { ImPlus } from 'react-icons/im';
import { useDispatch } from 'react-redux';
import { show } from '../../reducers/loaderState';
import { addDoc, collection, doc } from "firebase/firestore";
import { toast } from 'react-toastify';
import Debits from "./debits";
function User(props) {
    const dispatch = useDispatch();
    const toTimestamp = strDate => Date.parse(strDate);
    const user = props.user;
    const debits = props.debits;
    const [debit, setDebit] = useState('');
    const [debitComment, setDebitComment] = useState('');
    const addDebit = (e) => {
        e.preventDefault();
        if (parseInt(debit) < 1000) {
            toast.error(`Wrong Format!`);
        } else {
            if (window.confirm('Sure?')) {
                dispatch(show());
                const userRef = doc(db, 'users', user.id);
                addDoc(collection(db, "debits"), {
                    user: userRef,
                    debit: parseInt(debit),
                    createdAt: toTimestamp(new Date()),
                    comment: debitComment
                })
                    .then(() => {
                        toast.success(`Success Add Doc`);
                        setDebit('');
                        setDebitComment('');
                    })
                    .catch((e) => toast.error(`Error adding document: ${e}`))
                    .finally(() => {
                        calculateUserTotal(userRef, props.update);
                    });
            }
        }
    }
    return (
        <>
            <div className="accordion-item">
                <h2 className="accordion-header" id={`heading-${user.id}`}>
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#user-${user.id}`} aria-expanded="false" aria-controls={`user-${user.id}`}>
                        <div className="fw-bold w-100 d-flex align-items-baseline">
                            {user.name}
                            <span className="badge bg-danger fs-6 ms-auto mx-2">
                                {formatPrice(user.total)}
                            </span>
                        </div>
                    </button>
                </h2>
                <div id={`user-${user.id}`} className="accordion-collapse  collapse" aria-labelledby={`heading-${user.id}`} data-bs-parent="#accordionUsers">
                    <div className="accordion-body">
                        <Form onSubmit={e => addDebit(e)}>
                            <Form.Group className="d-flex">
                                <Form.Control type="number" placeholder="Should Paid:" style={{ borderRadius: '0.375rem 0 0 0' }} required={true} value={debit} onChange={(e) => { setDebit(e.target.value) }} />
                                <Form.Control type="text" placeholder="Comment:" style={{ borderRadius: '0' }} value={debitComment} onChange={(e) => { setDebitComment(e.target.value) }} />
                                <Button variant="danger" style={{ borderRadius: '0 0.375rem 0 0' }} type="submit">
                                    <ImPlus />
                                </Button>
                            </Form.Group>
                        </Form>
                        <Form onSubmit={e => addDebit(e)}>
                            <Form.Group className="mb-3 d-flex">
                                <Form.Control type="number" placeholder="Paid:" style={{ borderRadius: '0 0 0 0.375rem' }} required={true} value={debit} onChange={(e) => { setDebit(e.target.value) }} />
                                <Button variant="success" style={{ borderRadius: '0 0 0.375rem 0' }} type="submit">
                                    <ImPlus />
                                </Button>
                            </Form.Group>
                        </Form>
                        {debits.length > 0 && <Debits debits={debits} />}
                        <Button variant="warning">
                            Clear Cache
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );

}
export default User;