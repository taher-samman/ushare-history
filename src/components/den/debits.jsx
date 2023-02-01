import Debit from "./debit";

function Debits(props) {
    const debits = props.debits;
    return (
        <>
            <ol className="list-group mb-3">
                {debits.map(debit => <Debit key={debit.id} debit={debit} />)}
            </ol>
        </>);
}

export default Debits;