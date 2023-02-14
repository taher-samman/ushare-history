import Paid from "./paid";

function Paids(props) {
    const paids = props.paids;
    return (
        <>
            <ol className="list-group mb-3">
                {paids.map(paid => <Paid key={paid.id} paid={paid} update={props.update} />)}
            </ol>
        </>);
}

export default Paids;