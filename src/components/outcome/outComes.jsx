import { useEffect } from "react";
import { useState } from "react";
import { formatPrice } from "../../firebase";
import OutCome from "./outCome";

function OutComes(props) {
    const outComes = props.outcomes;
    const [total, setTotal] = useState(0);
    useEffect(() => {
        var prices = 0;
        outComes.forEach(element => {
            prices += element.price;
        });
        setTotal(prices);
    }, [total, outComes]);
    return (
        <>
            <div className="alert alert-secondary" role="alert">
                Total: <div className="fw-bold d-inline">{formatPrice(total)}</div>
            </div>
            <ol className="list-group list-group-numbered">
                {outComes.map(out => <OutCome key={out.id} openModal={props.openModal} outcome={out} />)}
            </ol>
        </>);
}

export default OutComes;