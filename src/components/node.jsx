import { TbEdit } from 'react-icons/tb';
import { AiFillDelete } from 'react-icons/ai';
import Button from 'react-bootstrap/Button';
import { db } from '../firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { show} from '../reducers/loaderState';
function Node(props) {
    const dispatch = useDispatch();
    var service = props.service;
    const toDate = timesTamp => {
        var date = new Date(timesTamp);
        return `${date.getDate()}/${("0" + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
    };
    const deleteService = async () => {
        if (window.confirm('are u sure?')) {
            dispatch(show());
            const docRef = doc(db, "services", service.id);
            await deleteDoc(docRef)
                .then(() => toast.success(`${service.number} deleted!`))
                .catch((e) => toast.error(`Error delete document: ${e}`));
            props.update();
        }
    }
    const getBg = () => {
        if(service.date <= Date.parse(new Date())){
            return 'bg-warning';
        }
    }
    return (
        <tr className={getBg()}>
            <td className='align-middle'>{service.number}</td>
            <td className='align-middle'>{toDate(service.date)}</td>
            <td className='align-middle'>
                <Button variant="" onClick={() => props.onOpen(service)}>
                    <TbEdit />
                </Button>
                <Button variant="" onClick={deleteService}>
                    <AiFillDelete />
                </Button>

            </td>
        </tr>
    );
}

export default Node;