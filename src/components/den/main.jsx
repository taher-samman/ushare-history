
import { useEffect } from "react";
import { useState } from "react";
import { Container } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { ImPlus } from 'react-icons/im';
import { db, getDocuments } from "../../firebase";
import { useDispatch } from 'react-redux';
import { show, hide } from '../../reducers/loaderState';
import { toast } from 'react-toastify';
import { addDoc, collection, doc } from "firebase/firestore";
import Users from "./users";
function Main() {
    const dispatch = useDispatch();
    const [newUser, setNewUser] = useState('');
    const [users, setUsers] = useState([]);
    const [debits, setDebits] = useState([]);
    const [refreshData, setRefreshData] = useState(0);
    const addUser = (e) => {
        e.preventDefault();
        if (window.confirm('Sure?')) {
            dispatch(show());
            addDoc(collection(db, "users"), {
                name: newUser,
                total: 0,
                totalPaid: 0
            })
                .then(() => {
                    toast.success(`Success Add Doc`);
                    setNewUser('');
                })
                .catch((e) => toast.error(`Error adding document: ${e}`))
                .finally(update);
        }
    }
    const update = () => {
        setRefreshData(refreshData + 1);
    }
    useEffect(() => {
        const fetchData = async () => {
            dispatch(show());
            var apiUsers = [];
            await getDocuments('users')
                .then((d) => {
                    d.docs.forEach(element => {
                        var index = [];
                        index['id'] = element.id;
                        index['name'] = element.data().name;
                        index['total'] = element.data().total;
                        index['totalPaid'] = element.data().totalPaid;
                        index['userRef'] = doc(db,'users',element.id);
                        apiUsers.push(index);
                    });
                    setUsers(apiUsers);
                })
                .catch((e) => toast.error(`Error fetch users: ${e}`))
                .finally(() => {
                    var debitsUsers = [];
                    getDocuments('debits')
                        .then((d) => {
                            d.docs.forEach(element => {
                                var index = [];
                                index['id'] = element.id;
                                index['comment'] = element.data().comment;
                                index['createdAt'] = element.data().createdAt;
                                index['debit'] = element.data().debit;
                                index['user'] = element.data().user;
                                debitsUsers.push(index);
                            });
                            setDebits(debitsUsers);
                        })
                        .catch((e) => toast.error(`Error fetch debits: ${e}`))
                        .finally(() => {
                            dispatch(hide());
                        });
                });
        }
        fetchData();
    }, [dispatch, refreshData]);
    return (
        <>
            <Container className="pt-4">
                <Form onSubmit={e => addUser(e)}>
                    <Form.Group className="mb-3 d-flex">
                        <Form.Control type="text" placeholder="Name:" style={{ borderRadius: '0.375rem 0 0 0.375rem' }} required={true} value={newUser} onChange={(e) => { setNewUser(e.target.value) }} />
                        <Button variant="danger" style={{ borderRadius: '0 0.375rem 0.375rem 0' }} type="submit">
                            <ImPlus />
                        </Button>
                    </Form.Group>
                </Form>
                {users.length && <Users users={users} update={update} debits={debits} />}
            </Container>
        </>
    );
}

export default Main;