import { formatPrice } from "../../firebase";

function Debit(props) {
    const debit = props.debit;
    const toDate = timesTamp => {
        var date = new Date(timesTamp);
        return `${date.getDate()}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
    };
    return (
        <>
            <li className="list-group-item d-flex justify-content-between align-items-start" style={{ cursor: 'pointer' }}>
                <div className="ms-2 me-auto">
                    <div className="fw-bold">{toDate(debit.createdAt)}</div>
                    {debit.comment}
                </div>
                <span className="badge bg-primary fs-6 rounded-pill">
                    {formatPrice(debit.debit)}
                </span>
            </li>
        </>);
}
export default Debit;