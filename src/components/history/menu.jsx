import { Button, Col, Container, Row } from "react-bootstrap";

function Menu(props) {
    const types = props.types;
    if (Array.isArray(types) && types.length > 0) {
        return (
            <>
                <Container className="p-2">
                    <Row>
                        {types.map(type => {
                            return (
                                <Col key={type.type}>
                                    <Button variant="warning" onClick={() => {props.handleFilter(type.type) }} className="w-100">{type.label}</Button>
                                </Col>
                            );
                        })}
                    </Row>
                </Container>
            </>
        );
    }
}

export default Menu;