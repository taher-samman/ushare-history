import { deleteDoc, doc } from "firebase/firestore";
import { calculateUserTotal, db, formatPrice } from "../../firebase";
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { show } from '../../reducers/loaderState';
function Debit(props) {
    const debit = props.debit;
    const dispatch = useDispatch();
    const toDate = timesTamp => {
        var date = new Date(timesTamp);
        return `${date.getDate()}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
    };
    const deleteMe = () => {
        if (window.confirm('sure?')) {
            dispatch(show());
            const ref = doc(db, 'debits', debit.id);
            deleteDoc(ref)
                .then(() => toast.success(`${formatPrice(debit.debit)} deleted!`, { autoClose: 200 }))
                .catch((e) => toast.error(`Error delete document: ${e}`))
                .finally(calculateUserTotal(debit.user, props.update));
        }
    }
    return (
        <>
            <li className="list-group-item border-danger d-flex justify-content-between align-items-start" style={{ cursor: 'pointer' }} onClick={deleteMe}>
                <div className="ms-2 me-auto">
                    <div className="fw-bold">{toDate(debit.createdAt)}</div>
                    {debit.comment}
                </div>
                <span className="badge bg-danger fs-6 rounded-pill">
                    {formatPrice(debit.debit, '$')}
                </span>
            </li>
        </>);
}
export default Debit;