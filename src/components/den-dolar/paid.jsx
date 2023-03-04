import { deleteDoc, doc } from "firebase/firestore";
import { calculateUserTotal, db, formatPrice } from "../../firebase";
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { show } from '../../reducers/loaderState';
function Paid(props) {
    const paid = props.paid;
    const dispatch = useDispatch();
    const toDate = timesTamp => {
        var date = new Date(timesTamp);
        return `${date.getDate()}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
    };
    const deleteMe = () => {
        if (window.confirm('sure?')) {
            dispatch(show());
            const ref = doc(db, 'paids-$', paid.id);
            deleteDoc(ref)
                .then(() => toast.success(`${formatPrice(paid.paid)} deleted!`, { autoClose: 200 }))
                .catch((e) => toast.error(`Error delete document: ${e}`))
                .finally(calculateUserTotal(paid.user, props.update));
        }
    }
    return (
        <>
            <li className="list-group-item border-success d-flex justify-content-between align-items-start" style={{ cursor: 'pointer' }} onClick={deleteMe}>
                <div className="ms-2 me-auto">
                    <div className="fw-bold">{toDate(paid.createdAt)}</div>
                </div>
                <span className="badge bg-success fs-6 rounded-pill">
                    {formatPrice(paid.paid, '$')}
                </span>
            </li>
        </>);
}
export default Paid;