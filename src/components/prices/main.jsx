import { addDoc, collection, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FiEdit } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Table from 'react-bootstrap/Table';
import AddNode from './addNode';
// import { MdAutoDelete } from 'react-icons/md';
// import { getServices, clearAll } from '../../firebase';
// import Button from 'react-bootstrap/Button';
import Node from './node';
import { useDispatch } from 'react-redux';
import { db, getDocuments } from '../../firebase';
import { show as showLoader, hide } from '../../reducers/loaderState';
function Main() {
    const dispatch = useDispatch();
    const [sayrafa, setSayrafa] = useState('');
    const [gbs, setGbs] = useState([]);
    const [error, setError] = useState(false);
    const [callData, setCallData] = useState(0);
    const [show, setShow] = useState(false);
    const [gbModal, setGbModal] = useState('');

    const handleClose = () => {
        setGbModal('');
        setShow(false);
    };
    const handleShow = (gb = '') => {
        setGbModal(gb);
        setShow(true);
    };

    useEffect(() => {
        const fetchData = () => {
            dispatch(showLoader());
            getDocs(
                query(
                    collection(db, 'config'),
                    where('path', '==', 'sayrafa')
                )
            ).then((d) => {
                switch (d.docs.length) {
                    case 1:
                        if (d.docs[0].data().path === 'sayrafa') {
                            setSayrafa(d.docs[0].data().value);
                        }
                        break;
                    case 0:

                        break;
                    default:
                        toast.error(`sayrafa path should be unique plz check db`);
                        setError(true);
                        break;
                }
            })
                .catch((e) => toast.error(`Error fetch data: ${e}`))
                .finally(() => {
                    var apiGbs = [];
                    getDocs(
                        query(
                            collection(db, 'gb'),
                            orderBy('order', 'asc')
                        )
                    ).then((d) => {
                        d.docs.forEach(element => {
                            var elementArray = [];
                            elementArray['id'] = element.id;
                            elementArray['gb'] = element.data().gb;
                            elementArray['price'] = element.data().price;
                            apiGbs.push(elementArray);
                        });
                        setGbs(apiGbs);
                    })
                        .catch((e) => toast.error(`Error fetch data: ${e}`))
                        .finally(() => {
                            handleClose();
                            dispatch(hide());
                        });
                });;
        }
        fetchData();
    }, [dispatch, callData]);

    const update = () => setCallData(callData + 1);
    const changeSayrafa = (e) => {
        e.preventDefault();
        if (window.confirm('Sure?')) {
            dispatch(showLoader());
            getDocs(
                query(
                    collection(db, 'config'),
                    where('path', '==', 'sayrafa')
                )
            ).then(d => {
                switch (d.docs.length) {
                    case 1:
                        if (d.docs[0].data().path === 'sayrafa') {
                            const docRef = doc(db, "config", d.docs[0].id);
                            updateDoc(docRef, { value: parseInt(sayrafa) })
                                .then(() => toast.success(`Sayrafa Updated!`))
                                .finally(update)
                                .catch((e) => toast.error(`Error update Sayrafa: ${e}`));
                        }
                        break;
                    case 0:
                        addDoc(collection(db, "config"), {
                            path: 'sayrafa', value: parseInt(sayrafa), updatedAt: new Date()
                        })
                            .then(() => {
                                toast.success(`sayrafa added!`);
                            })
                            .catch((e) => toast.error(`Error adding document: ${e}`))
                            .finally(update);
                        break;
                    default:
                        toast.error(`sayrafa path should be unique plz check db`);
                        setError(true);
                        break;
                }
            })
        }
    }
    if (error) {
        return (
            <Container>
                <div className="mt-3 alert alert-secondary" role="alert">
                    <h1>Error</h1>
                </div>
            </Container>
        )
    } else {
        return (
            <Container>
                <div className="mt-3 alert alert-secondary opacity-25" role="alert">
                    <Form onSubmit={e => changeSayrafa(e)}>
                        <Form.Group className="d-flex">
                            <Form.Control type="number" placeholder='Sayrafa:' style={{ borderRadius: '0.375rem 0 0 0.375rem' }} required={true} value={sayrafa} onChange={(e) => { setSayrafa(e.target.value) }} />
                            <Button variant="danger" style={{ borderRadius: '0 0.375rem 0.375rem 0' }} type="submit">
                                <FiEdit />
                            </Button>
                        </Form.Group>
                    </Form>
                </div>
                <div className="d-flex justify-content-end opacity-25">
                    <AddNode update={update} show={show} onClose={handleClose} onOpen={handleShow} gbModal={gbModal} />
                </div>
                {gbs.length ?
                    <Table striped bordered hover>
                        <thead className='opacity-25'>
                            <tr>
                                <th>Gb</th>
                                <th>Price</th>
                                <th>LBP</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gbs.map(gb => {
                                return (
                                    <Node key={gb.id} gb={gb} sayrafa={sayrafa} onClose={handleClose} update={update} onOpen={handleShow} />
                                );
                            })}
                        </tbody>
                    </Table> : ''
                }
            </Container>
        );
    }

}

export default Main;