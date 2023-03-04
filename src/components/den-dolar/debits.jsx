import Debit from "./debit";

function Debits(props) {
    const debits = props.debits;
    return (
        <>
            <ol className="list-group mb-3">
                {debits.map(debit => <Debit key={debit.id} debit={debit} update={props.update} />)}
            </ol>
        </>);
}

export default Debits;