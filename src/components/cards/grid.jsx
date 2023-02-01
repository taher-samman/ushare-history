import { useEffect, useState } from 'react';
import Types from '../../cards-types.json';
import Menu from './menu';
import Nodes from './nodes';
import Button from 'react-bootstrap/Button';
import { MdAutoDelete } from 'react-icons/md';
import { ImUpload } from 'react-icons/im';
import { BsCalendarDateFill } from 'react-icons/bs';
import { Container } from "react-bootstrap";
import AddNode from './addNode';
import { useDispatch } from 'react-redux';
import { show as showLoader, hide } from '../../reducers/loaderState';
import { clearAllCards, db, encryptData, getCardTypeLabel, getAvailableStatus } from '../../firebase';
import { collection, addDoc, query, orderBy, getDocs } from "firebase/firestore";
import * as XLSX from "xlsx";
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";
function Grid() {
    const dispatch = useDispatch();
    const types = Types;
    const [cards, setCards] = useState([]);
    const [uploadedCards, setUploadedCards] = useState([]);
    const [filterType, setFilterType] = useState(types[0].type);
    const [updateCards, setUpdateCards] = useState(0);
    const [getTimesTamp, setGetTimesTamp] = useState(null);
    const toTimestamp = strDate => Date.parse(strDate);
    useEffect(() => {
        const fetchCards = () => {
            dispatch(showLoader());
            var apiCards = [];
            getDocs(query(collection(db, 'cards'), orderBy('date', 'asc'))).then((d) => {
                d.docs.forEach(element => {
                    if (element.data().status === getAvailableStatus().type) {
                        var elementArray = [];
                        elementArray['id'] = element.id;
                        elementArray['code'] = element.data().code;
                        elementArray['type'] = element.data().type;
                        elementArray['date'] = element.data().date;
                        elementArray['status'] = element.data().status;
                        elementArray['takedAt'] = element.data().takedAt;
                        apiCards.push(elementArray);
                    }
                });
                setCards(apiCards);
                handleClose();
                dispatch(hide());
            });
        }
        fetchCards();
    }, [updateCards, dispatch]);
    const filterCards = () => {
        const filteredCards = cards.filter(c => c.type === filterType);
        return filteredCards;
    }
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
    };
    const handleShow = () => {
        setShow(true);
    };
    const handleFilter = (type) => {
        dispatch(showLoader());
        setTimeout(() => {
            setFilterType(type);
            dispatch(hide());
        }, 200);
    }
    const uploadXlsx = (file) => {
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            fileReader.onload = (e) => {
                const bufferArray = e.target.result;

                const wb = XLSX.read(bufferArray, { type: "buffer" });

                const wsname = wb.SheetNames[0];

                const ws = wb.Sheets[wsname];

                const data = XLSX.utils.sheet_to_json(ws);

                resolve(data);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });

        promise.then(async (d) => {
            console.log('d', d);
            setUploadedCards(d);
        });
    }
    useEffect(() => {
        if (uploadedCards.length > 0) {
            if (window.confirm('Sure To Upload?')) {
                dispatch(showLoader());
                uploadedCards.forEach(async (element) => {
                    if (element.hasOwnProperty('code') && element.hasOwnProperty('type') && element.hasOwnProperty('date')) {
                        await addDoc(collection(db, "cards"), {
                            code: encryptData(element.code),
                            type: element.type,
                            date: parseInt(element.date),
                            status: getAvailableStatus().type,
                            takedAt: null
                        })
                            .then(() => {
                                toast.success(`${getCardTypeLabel(element.type)} added!`, { autoClose: 200 });
                            })
                            .catch((e) => toast.error(`Error adding document: ${e}`))
                            .finally(() => {
                                setUpdateCards(updateCards + 1);
                            });
                    } else {
                        toast.error(`Error upload Card: ${element.code}`)
                    }
                });
            }
            setUploadedCards([]);
        }
    }, [uploadedCards, dispatch, updateCards])
    return (
        <>
            <Container>
                <div className="d-flex justify-content-between">
                    <div className="auto d-flex">
                        <label htmlFor='get-times-tamp' className='p-2'>
                            <BsCalendarDateFill
                                className='align-self-center'
                                fontSize={20} color='green' cursor='pointer'
                            />
                            <DatePicker id='get-times-tamp' className='d-none' selected={getTimesTamp} placeholderText="Date:" dateFormat='dd/MM/yyyy' onChange={(date) => {
                                setGetTimesTamp(date)
                                alert(toTimestamp(date));
                            }} />
                        </label>
                        <label htmlFor="upload-cards" className='p-2'>
                            <ImUpload
                                className='align-self-center'
                                fontSize={20} color='green' cursor='pointer'
                            />
                            <input
                                id='upload-cards'
                                type="file"
                                className='d-none'
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    uploadXlsx(file);
                                    e.target.value = '';
                                }}
                            />
                        </label></div>
                    <div className="manual">
                        <Button variant="" onClick={() => {
                            if (window.confirm('Delete All Cards?')) {
                                dispatch(showLoader());
                                clearAllCards(() => { setUpdateCards(updateCards + 1) })
                            };
                        }}>
                            <MdAutoDelete
                                className='align-self-center'
                                fontSize={20} color='red'
                            />
                        </Button>
                        <AddNode show={show} update={() => { setUpdateCards(updateCards + 1) }} onClose={handleClose} onOpen={handleShow} />
                    </div>
                </div>

            </Container>
            <Menu types={types} handleFilter={handleFilter} />
            {cards.length > 0 && <Nodes update={() => { setUpdateCards(updateCards + 1) }} cards={filterCards()} />}
        </>
    );
}

export default Grid;
