import Form from 'react-bootstrap/Form';
import Types from '../../cards-types.json';
function TypesSelect(props) {
    const types = Types;
    return (
        <Form.Select
            defaultValue='index'
            onChange={(e) => props.handleChange(e)}>
            <option disabled hidden value='index'>Shoose Type:</option>
            {types.map(type => {
                return (
                    <option key={type.type} value={type.type}>{type.label}</option>
                );
            })}
        </Form.Select>
    );
}

export default TypesSelect;