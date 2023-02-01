import OutCome from "./outCome";

function OutComes(props) {
    const outComes = props.outcomes;
    return (
        <>
            <ol className="list-group list-group-numbered">
                {outComes.map(out => <OutCome key={out.id} openModal={props.openModal} outcome={out} />)}
            </ol>
        </>);
}

export default OutComes;