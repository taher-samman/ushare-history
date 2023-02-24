import { TbEdit } from 'react-icons/tb';
import { AiFillDelete } from 'react-icons/ai';
import Button from 'react-bootstrap/Button';
import { db, formatPrice } from '../../firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { show } from '../../reducers/loaderState';
function Node(props) {
    const dispatch = useDispatch();
    var gb = props.gb;
    const deleteGb = async () => {
        if (window.confirm('are u sure?')) {
            dispatch(show());
            const docRef = doc(db, "gb", gb.id);
            await deleteDoc(docRef)
                .then(() => toast.success(`${gb.gb} deleted!`))
                .catch((e) => toast.error(`Error delete document: ${e}`));
            props.update();
        }
    }
    return (
        <tr>
            <td className='align-middle'>{gb.gb}</td>
            <td className='align-middle'>{`${gb.price}$`}</td>
            <td className='align-middle'>{parseInt(gb.price) * parseInt(props.sayrafa)}</td>
            <td className='align-middle text-center'>
                <Button variant="" onClick={() => props.onOpen(gb)}>
                    <TbEdit />
                </Button>
                <Button variant="" onClick={deleteGb}>
                    <AiFillDelete />
                </Button>
            </td>
        </tr>
    );
}

export default Node;