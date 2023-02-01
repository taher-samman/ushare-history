import * as React from 'react';
import { getCardTypeLabel, db, decryptData, getUsedStatus } from '../../firebase';
import { AiFillDelete } from 'react-icons/ai';
import { FaCopy } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { show, hide } from '../../reducers/loaderState';
import { useState } from 'react';
function Node(props) {
    const card = props.card;
    const dispatch = useDispatch();
    const [bg, setBg] = useState('bg-danger');
    const toTimestamp = strDate => Date.parse(strDate);
    const toDate = timesTamp => {
        var date = new Date(timesTamp);
        return `${date.getDate()}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
    };
    const deleteCard = async () => {
        if (window.confirm('are u sure?')) {
            dispatch(show());
            const docRef = doc(db, "cards", card.id);
            // await deleteDoc(docRef)
            //     .then(() => toast.success(`${decryptData(card.code)} deleted!`))
            //     .catch((e) => toast.error(`Error delete document: ${e}`))
            //     .finally(() => props.update());
            await updateDoc(docRef, {
                status: getUsedStatus().type,
                takedAt: toTimestamp(new Date())
            }).then(() => {
                toast.success(`${decryptData(card.code)} Taked!`);
            })
                .catch((e) => toast.error(`Error Take document: ${e}`))
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
                    {toDate(card.date)}
                </div>
            </div>
        </>
    );
}

export default Node;