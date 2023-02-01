import { Container } from "react-bootstrap";
import Node from "./node";

function Nodes(props) {
    return (
        <>
            <Container>
                <div className="badge bg-warning text-wrap" style={{fontSize: '2 0px'}}>
                    {props.cards.length}
                </div>
                {props.cards.map(card => {
                    return (
                        <Node update={props.update} key={card.id} card={card} />
                    );
                })}
            </Container>
        </>
    );
}
export default Nodes;