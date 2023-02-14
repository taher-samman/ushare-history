import { calculateUserTotal, db, formatPrice, deleteDocumentWithBackup } from "../../firebase";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState } from "react";
import { ImPlus } from 'react-icons/im';
import { useDispatch } from 'react-redux';
import { show } from '../../reducers/loaderState';
import { addDoc, collection, deleteDoc, doc, getDocs, query, refEqual, where } from "firebase/firestore";
import { toast } from 'react-toastify';
import Debits from "./debits";
import { Col, Row } from "react-bootstrap";
import Paids from "./paids";
function User(props) {
    const dispatch = useDispatch();
    const toTimestamp = strDate => Date.parse(strDate);
    const user = props.user;
    const debits = props.debits;
    const [debit, setDebit] = useState('');
    const [debitComment, setDebitComment] = useState('');
    const paids = props.paids;
    const [paid, setPaid] = useState('');
    const addDebit = (e) => {
        e.preventDefault();
        if (parseInt(debit) < 1) {
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
    const addPaid = (e) => {
        e.preventDefault();
        if (parseInt(paid) < 1) {
            toast.error(`Wrong Format!`);
        } else {
            if (window.confirm('Sure?')) {
                dispatch(show());
                const userRef = doc(db, 'users', user.id);
                addDoc(collection(db, "paids"), {
                    user: userRef,
                    paid: parseInt(paid),
                    createdAt: toTimestamp(new Date()),
                })
                    .then(() => {
                        setPaid('');
                    })
                    .catch((e) => toast.error(`Error adding document: ${e}`))
                    .finally(() => {
                        calculateUserTotal(userRef, props.update);
                    });
            }
        }
    }
    const deleteUser = async () => {
        if (window.confirm('Sure?')) {
            dispatch(show());
            for (let index = 0; index < debits.length; index++) {
                const debit = debits[index]
                if (refEqual(debit.user, user.userRef)) {
                    const docRef = doc(db, 'debits', debit.id);
                    await new Promise(resolve => deleteDoc(docRef)
                        .then(() => {
                            toast.success(`Document deleted!`, { autoClose: 200 })
                        })
                        .finally(resolve)
                        .catch((e) => toast.error(`Error delete document: ${e}`))
                    )
                }
            }
            for (let index = 0; index < paids.length; index++) {
                const paid = paids[index]
                if (refEqual(paid.user, user.userRef)) {
                    const docRef = doc(db, 'paids', paid.id);
                    await new Promise(resolve => deleteDoc(docRef)
                        .then(() => {
                            toast.success(`Document deleted!`)
                        })
                        .finally(resolve)
                        .catch((e) => toast.error(`Error delete document: ${e}`))
                    )
                }
            }
            getDocs(query(collection(db, 'debits'), where('user', '==', user.userRef)))
                .then((d) => {
                    if (d.docs.length === 0) {
                        getDocs(query(collection(db, 'paids'), where('user', '==', user.userRef)))
                            .then((d) => {
                                if (d.docs.length === 0) {
                                    deleteDocumentWithBackup('users', user, props.update);
                                } else {
                                    toast.error(`Error delete user , have paids`)
                                }
                            })
                    } else {
                        toast.error(`Error delete user , have debits`)
                    }
                });
        }
    }
    const clearCache = async () => {
        if (window.confirm('Sure?')) {
            dispatch(show());
            getDocs(query(collection(db, 'debits'), where('user', '==', user.userRef)))
                .then(async (d) => {
                    // console.log('get debits',d.docs);
                    for (let index = 0; index < d.docs.length; index++) {
                        const debit = d.docs[index]
                        if (refEqual(debit.data().user, user.userRef)) {
                            // console.log('delete debit',debit);
                            const docRef = doc(db, 'debits', debit.id);
                            await new Promise(resolve => deleteDoc(docRef)
                                .finally(resolve)
                                .catch((e) => {
                                    deleteUser();
                                    toast.error(`Error delete document: ${e}`)
                                })
                            )
                        }
                    }
                    getDocs(query(collection(db, 'paids'), where('user', '==', user.userRef)))
                        .then(async (d) => {
                            // console.log('get paids',d.docs);
                            for (let index = 0; index < d.docs.length; index++) {
                                const paid = d.docs[index]
                                if (refEqual(paid.data().user, user.userRef)) {
                                    // console.log('delete paid',paid);
                                    const docRef = doc(db, 'paids', paid.id);
                                    await new Promise(resolve => deleteDoc(docRef)
                                        .finally(resolve)
                                        .catch((e) => {
                                            deleteUser();
                                            toast.error(`Error delete document: ${e}`)
                                        })
                                    )
                                }
                            }
                            getDocs(query(collection(db, 'debits'), where('user', '==', user.userRef)))
                                .then((d) => {
                                    if (d.docs.length === 0) {
                                        getDocs(query(collection(db, 'paids'), where('user', '==', user.userRef)))
                                            .then((d) => {
                                                if (d.docs.length === 0) {
                                                    calculateUserTotal(user.userRef, props.update);
                                                } else {
                                                    toast.error(`Error refresh user , have paids`)
                                                }
                                            })
                                    } else {
                                        toast.error(`Error delete user , have debits`)
                                    }
                                })
                                .catch((e) => {
                                    deleteUser();
                                    toast.error(`Error delete document: ${e}`)
                                });
                        })
                        .catch((e) => {
                            deleteUser();
                            toast.error(`Error delete document: ${e}`)
                        })
                })
                .catch((e) => {
                    deleteUser();
                    toast.error(`Error delete document: ${e}`)
                });
        }
    }

    return (
        <>
            <div className="accordion-item">
                <h2 className="accordion-header" id={`heading-${user.id}`}>
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#user-${user.id}`} aria-expanded="false" aria-controls={`user-${user.id}`}>
                        <div className="fw-bold w-100 d-flex align-items-baseline">
                            {user.name}
                            <span className={`badge ${user.total <= 0 ? 'bg-success' : 'bg-danger'} fs-6 ms-auto mx-2`}>
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
                        <Form onSubmit={e => addPaid(e)}>
                            <Form.Group className="mb-3 d-flex">
                                <Form.Control type="number" placeholder="Paid:" style={{ borderRadius: '0 0 0 0.375rem' }} required={true} value={paid} onChange={(e) => { setPaid(e.target.value) }} />
                                <Button variant="success" style={{ borderRadius: '0 0 0.375rem 0' }} type="submit">
                                    <ImPlus />
                                </Button>
                            </Form.Group>
                        </Form>
                        {debits.length > 0 && <Debits debits={debits} update={props.update} />}
                        {paids.length > 0 && <Paids paids={paids} update={props.update} />}
                        <Row>
                            <Col>
                                <Button variant="success" className="w-100"
                                    onClick={clearCache}
                                >
                                    ClearCache
                                </Button>
                            </Col>
                            <Col>
                                <Button variant="danger" className="w-100" onClick={deleteUser}>
                                    Delete
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </>
    );

}
export default User;