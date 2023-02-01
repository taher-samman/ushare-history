import * as React from 'react';
import { getCardTypeLabel, db, decryptData, getAvailableStatus } from '../../firebase';
import { AiFillDelete } from 'react-icons/ai';
import { FaCopy } from 'react-icons/fa';
import { MdSettingsBackupRestore } from 'react-icons/md';
import Button from 'react-bootstrap/Button';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { show, hide } from '../../reducers/loaderState';
import { useState } from 'react';
function Node(props) {
    const card = props.card;
    // console.log(card);
    const dispatch = useDispatch();
    const [bg, setBg] = useState('bg-warning');
    const toDate = timesTamp => {
        var date = new Date(parseInt(timesTamp));
        console.log('date',date);
        return `${date.getDate()}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}-${date.getHours()}:${date.getMinutes()}`;
    };
    const deleteCard = async () => {
        if (window.confirm('are u sure?')) {
            dispatch(show());
            const docRef = doc(db, "cards", card.id);
            await deleteDoc(docRef)
                .then(() => toast.success(`${decryptData(card.code)} deleted!`))
                .catch((e) => toast.error(`Error delete document: ${e}`))
                .finally(() => props.update());
        }
    }
    const restoreCard = async () => {
        if (window.confirm('are u sure?')) {
            dispatch(show());
            const docRef = doc(db, "cards", card.id);
            await updateDoc(docRef, {
                status: getAvailableStatus().type,
                takedAt: null
            }).then(() => {
                toast.success(`${decryptData(card.code)} Retored!`);
            })
                .catch((e) => toast.error(`Error Restore document: ${e}`))
                .finally(() => {
                    props.update();
                });
        }
    }
    const copyCard = async () => {
        dispatch(show());
        navigator.clipboard.writeText(`*14*${decryptData(card.code)}#`)
            .then(() => {
                toast.success(`${decryptData(card.code)} copied!`);
                setBg('bg-info');
            })
            .catch((e) => toast.error(`Error copy: ${e}`))
            .finally(() => dispatch(hide()));
    }
    return (
        <>
            <div className={`card ${bg} text-white text-center mt-4 mb-4 position-relative`}>
                <div className="card-header">
                    {getCardTypeLabel(card.type)}
                    <Button variant="" style={{
                        position: 'absolute',
                        top: '0', left: '0'
                    }} onClick={restoreCard}>
                        <MdSettingsBackupRestore className='text-danger fs-3' />
                    </Button>
                    <Button variant="" style={{
                        position: 'absolute',
                        top: '0', right: '0'
                    }} onClick={deleteCard}>
                        <AiFillDelete />
                    </Button>
                </div>
                <div className="card-body position-relative">
                    <h5 className="card-title">*14*{decryptData(card.code)}#</h5>
                    <Button variant="" style={{
                        position: 'absolute',
                        top: '50%',
                        right: '0',
                        transform: 'translateY(-50%)'
                    }} onClick={copyCard}>
                        <FaCopy />
                    </Button>
                </div>
                <div className="card-footer">
                    Taked At: {toDate(card.takedAt)}
                </div>
            </div>
        </>
    );
}

export default Node;