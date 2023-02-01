import { formatPrice } from "../../firebase";
function OutCome(props) {
    const outcome = props.outcome;
    const toDate = timesTamp => {
        var date = new Date(timesTamp);
        return `${date.getDate()}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
    };
    const dayName = (timestamp) => {
        let date = new Date(parseInt(timestamp));
        let day = date.toLocaleString('en-us', { weekday: 'long' });
        return day;
    }

    return (
        <>
            <li className="list-group-item d-flex justify-content-between align-items-start" style={{ cursor: 'pointer' }} onClick={() => { props.openModal(outcome) }}>
                <div className="ms-2 me-auto">
                    <div className="fw-bold">{toDate(outcome.date)}</div>
                    {dayName(outcome.date)}
                </div>
                <span className="badge bg-primary fs-6 rounded-pill">
                    {formatPrice(outcome.price)}
                </span>
            </li>
        </>);
}
export default OutCome;