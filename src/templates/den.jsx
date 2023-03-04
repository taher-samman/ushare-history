import Header from '../components/header';
import MainDol from '../components/den-dolar/main';
import MainLb from '../components/den-lb/main';
import { useSelector } from 'react-redux';
import { Container, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { currencyChange } from '../reducers/loaderState';

function Den() {
    const currency = useSelector((state) => state.loader.currency);
    const dispatch = useDispatch();
    return (
        <>
            <Header />
            <Container>
                <Form.Group className="mb-3">
                    <Form.Checkfirebas
                        type="switch"
                        id="currency"
                        label={currency}
                        onChange={() => dispatch(currencyChange())}
                    />
                </Form.Group>
            </Container>
            {currency === '$' ? <MainDol /> : <MainLb />}
        </>
    );
}

export default Den;


