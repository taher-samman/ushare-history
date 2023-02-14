import { useEffect } from "react";
import { deleteDocumentWithBackup, getDocuments } from "../../firebase";
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { show, hide } from '../../reducers/loaderState';
import { Container } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useState } from "react";
import { ImPlus } from 'react-icons/im';
import { collection, addDoc, updateDoc, doc, getDocs, query, orderBy } from "firebase/firestore";
import { db } from '../../firebase';
// import Scores from "./scores";
import OutComes from "./outComes";
import DatePicker from "react-datepicker";
function Main() {
    const dispatch = useDispatch();
    const [todayOutCome, setTodayOutCome] = useState('');
    const [outComes, setOutComes] = useState([]);
    // const [scores, setScores] = useState([]);
    const [updateData, setUpdateData] = useState(0);
    const toTimestamp = strDate => Date.parse(strDate);
    const [showModal, setShowModal] = useState(false);
    const [modalOutCome, setModalOutCome] = useState(null);
    const [modalDate, setModalDate] = useState(null);
    const handleClose = () => {
        setModalOutCome(null);
        setShowModal(false);
    };
    const handleShow = (out = null) => {
        if (modalOutCome === null) {
            setModalOutCome(out)
            setShowModal(true);
        }
    };
    // const toDate = timesTamp => {
    //     var date = new Date(timesTamp);
    //     return `${date.getDate()}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
    // };
    // const dayName = (timestamp) => {
    //     let date = new Date(parseInt(timestamp));
    //     let day = date.toLocaleString('en-us', { weekday: 'long' });
    //     return day;
    // }
    useEffect(() => {
        const fetchOutcomes = async () => {
            dispatch(show());
            var apiOutcomes = [];
            await getDocs(query(collection(db, 'outcome'), orderBy('date','desc')))
                .then((d) => {
                    d.docs.forEach(element => {
                        var index = [];
                        index['id'] = element.id;
                        index['date'] = element.data().date;
                        index['price'] = element.data().price;
                        index['score'] = element.data().score;
                        apiOutcomes.push(index);
                    });
                    setOutComes(apiOutcomes);
                })
                .catch((e) => toast.error(`Error fetch outComes: ${e}`))
                .finally(() => {
                    // var apiScores = [];
                    // getDocuments('score')
                    //     .then((d) => {
                    //         d.docs.forEach(element => {
                    //             var index = [];
                    //             index['id'] = element.id;
                    //             index['capital'] = element.data().capital;
                    //             index['date'] = element.data().date;
                    //             apiScores.push(index);
                    //         });
                    //         setScores(apiScores);
                    //     })
                    //     .catch((e) => toast.error(`Error fetch scores: ${e}`))
                    //     .finally(() => {
                    dispatch(hide());
                    handleClose();
                    // });
                });
        }
        fetchOutcomes();
    }, [dispatch, updateData]);
    useEffect(() => {
        if (modalOutCome !== null) {
            setModalDate(modalOutCome.date);
        }
    }, [modalOutCome]);
    const addOutCome = (e) => {
        e.preventDefault();
        if (parseInt(todayOutCome) < 1) {
            toast.error(`Wrong Format`);
        } else {
            if (window.confirm('Sure?')) {
                dispatch(show());
                addDoc(collection(db, "outcome"), {
                    date: toTimestamp(new Date()),
                    price: parseInt(todayOutCome),
                    score: null
                })
                    .then(() => {
                        toast.success(`Success Add Doc`);
                        setTodayOutCome('');
                    })
                    .catch((e) => toast.error(`Error adding document: ${e}`))
                    .finally(() => {
                        setUpdateData(updateData + 1);
                    });
            }
        }
    }
    const updateOutCome = (e) => {
        e.preventDefault();
        if (window.confirm('Sure?')) {
            dispatch(show());
            const docRef = doc(db, "outcome", modalOutCome.id);
            updateDoc(docRef, {
                date: parseInt(modalDate),
                price: parseInt(modalOutCome.price),
                score: modalOutCome.score
            })
                .then(() => toast.success(`Update Done!`))
                .catch((e) => toast.error(`Error Update document: ${e}`))
                .finally(() => setUpdateData(updateData + 1));
        }
    }

    return (
        <>
            <Container className="pt-4">
                <Form onSubmit={e => { addOutCome(e) }}>
                    <Form.Group className="mb-3 d-flex">
                        <Form.Control type="number" placeholder="Price:" style={{ borderRadius: '0.375rem 0 0 0.375rem' }} required={true} value={todayOutCome} onChange={(e) => { setTodayOutCome(e.target.value) }} />
                        <Button variant="danger" style={{ borderRadius: '0 0.375rem 0.375rem 0' }} type="submit">
                            <ImPlus />
                        </Button>
                    </Form.Group>
                </Form>
                {outComes.length > 0 && <OutComes openModal={handleShow} outcomes={outComes.filter(out => out.score === null)} />}
                {/* {scores.length > 0 && <Scores scores={scores} outcomes={outComes} />} */}
            </Container>
            <Modal show={showModal} onHide={handleClose} centered>
                <Form onSubmit={e => { updateOutCome(e) }}>
                    <Modal.Body>
                        {modalOutCome instanceof Array &&
                            <>
                                <Form.Group className="mb-3 d-flex">
                                    <Form.Control type="number" placeholder="Price:" required={true} defaultValue={modalOutCome.price} onChange={(e) => {
                                        setModalOutCome(() => {
                                            modalOutCome.price = e.target.value;
                                            return modalOutCome;
                                        })
                                    }} />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <DatePicker className='form-control' placeholderText="Date:" selected={modalDate} dateFormat='dd/MM/yyyy'
                                        onChange={date => setModalDate(toTimestamp(date))} />
                                </Form.Group>
                            </>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" type="submit">
                            Update
                        </Button>
                        <Button variant="danger" onClick={() => {
                            if (window.confirm('sure?')) {
                                dispatch(show());
                                deleteDocumentWithBackup('outcome', modalOutCome, () => setUpdateData(updateData + 1));
                            }
                        }}>
                            Delete
                        </Button>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </>
    );
}

export default Main;