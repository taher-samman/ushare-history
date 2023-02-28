import { useEffect } from "react";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { db, formatPrice } from "../../firebase";
import OutCome from "./outCome";
import { AiOutlineReload } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { show } from '../../reducers/loaderState';
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
function OutComes(props) {
    const dispatch = useDispatch();
    const outComes = props.outcomes;
    const [total, setTotal] = useState(0);
    useEffect(() => {
        var prices = 0;
        outComes.forEach(element => {
            prices += element.price;
        });
        setTotal(prices);
    }, [total, outComes]);
    const toTimestamp = strDate => Date.parse(strDate);
    const refreshOutcomes = () => {
        if (window.confirm('sure?')) {
            dispatch(show());
            var now = new Date();
            var firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
            var lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            getDocs(
                query(
                    collection(db, 'outcome'),
                    where('date', '>=', toTimestamp(firstDay)),
                    where('date', '<=', toTimestamp(lastDay)),
                    where('score', '==', null)
                )
            ).then(outs => {
                if (outs.docs.length > 0) {
                    addDoc(collection(db, "score"), {
                        date: toTimestamp(now),
                    })
                        .then((docRef) => {
                            var score = doc(db, 'score', docRef.id);
                            outs.docs.forEach(element => {
                                var out = doc(db, 'outcome', element.id);
                                updateDoc(out, { score: score })
                                    .then(() => toast.success(`updated!`))
                                    .finally(props.update)
                                    .catch((e) => toast.error(`Error update outcome document: ${e}`));
                            });
                        })
                        .catch((e) => toast.error(`Error adding document: ${e}`));
                }else{
                    toast.warning(`No Docs`);
                    props.update();
                }
            })
        }
    }
    if (outComes.length) {
        return (
            <>
                <div className="alert alert-secondary d-flex align-items-center" role="alert">
                    Total:<div className="fw-bold d-inline">{formatPrice(total)}</div>
                    <Button variant="danger" className="ms-auto" onClick={refreshOutcomes}>
                        <AiOutlineReload />
                    </Button>
                </div>
                <ol className="list-group list-group-numbered">
                    {outComes.map(out => <OutCome key={out.id} openModal={props.openModal} outcome={out} />)}
                </ol>
            </>);
    }

}

export default OutComes;