import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import AddNode from './addNode';
import { MdAutoDelete } from 'react-icons/md';
import { getServices, clearAll } from '../firebase';
import Button from 'react-bootstrap/Button';
import Node from './node';
import { useDispatch } from 'react-redux';
import { show as showLoader, hide } from '../reducers/loaderState';
function Nodes() {
    const dispatch = useDispatch();
    const [services, setServices] = useState([]);
    const [modalService, setModalService] = useState('');
    const [callServices, setCallServices] = useState(0);
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setModalService('');
        setShow(false);
    };
    const handleShow = (s = '') => {
        setModalService(s);
        setShow(true);
    };

    useEffect(() => {
        const fetchServices = () => {
            dispatch(showLoader());
            var apiServices = [];
            getServices().then((d) => {
                d.docs.forEach(element => {
                    var elementArray = [];
                    elementArray['id'] = element.id;
                    elementArray['number'] = element.data().number;
                    elementArray['date'] = element.data().date;
                    apiServices.push(elementArray);
                });
                setServices(sortArrayByDate(apiServices));
                handleClose();
                dispatch(hide());
            });
        }
        fetchServices();
    }, [callServices, dispatch]);
    const sortArrayByDate = (services) => {
        var orderedServices = services;
        for (let i = 0; i < orderedServices.length; i++) {
            for (let j = i + 1; j < orderedServices.length; j++) {
                if (orderedServices[i]['date'] <= orderedServices[j]['date']) {
                    continue;
                } else {
                    var element = orderedServices[j];
                    orderedServices.splice(j, 1);
                    for (let q = 0; q < orderedServices.length; q++) {
                        if (element === null) { continue; }
                        if (orderedServices[q]['date'] > element['date']) {
                            orderedServices.splice(q, 0, element);
                            element = null;
                        }
                    }
                }
            }
        }
        return orderedServices;
    }
    return (
        <Container>
            <div className="d-flex justify-content-between">
                <Button variant="" onClick={() => {
                    if (window.confirm('Delete All Services?')) {
                        dispatch(showLoader());
                        clearAll(() => setCallServices(callServices + 1))
                    };
                }}>
                    <MdAutoDelete
                        className='align-self-center'
                        fontSize={20} color='red'
                    />
                </Button>
                <AddNode update={() => setCallServices(callServices + 1)} service={modalService} show={show} onClose={handleClose} onOpen={handleShow} />
            </div>
            {services.length ?
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Number</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map(service => {
                            return (
                                <Node key={service.id} service={service} onClose={handleClose} update={() => setCallServices(callServices + 1)} onOpen={handleShow} />
                            );
                        })}
                    </tbody>
                </Table> : ''
            }
        </Container>
    );
}

export default Nodes;