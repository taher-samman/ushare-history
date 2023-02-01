import { useEffect, useState } from 'react';
import Types from '../../cards-types.json';
import Menu from './menu';
import Nodes from './nodes';
import { useDispatch } from 'react-redux';
import { show as showLoader, hide } from '../../reducers/loaderState';
import { getAvailableStatus, db } from '../../firebase';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
function Grid() {
    const dispatch = useDispatch();
    const types = Types;
    const [cards, setCards] = useState([]);
    const [filterType, setFilterType] = useState(types[0].type);
    const [updateCards, setUpdateCards] = useState(0);
    useEffect(() => {
        const fetchCards = () => {
            dispatch(showLoader());
            var apiCards = [];
            getDocs(
                query(
                    collection(db, 'cards'),
                    where('status', '!=', getAvailableStatus().type),
                    orderBy('status', 'asc'),
                    orderBy('takedAt', 'desc')
                )
            ).then((d) => {
                d.docs.forEach(element => {
                    var elementArray = [];
                    elementArray['id'] = element.id;
                    elementArray['code'] = element.data().code;
                    elementArray['type'] = element.data().type;
                    elementArray['date'] = element.data().date;
                    elementArray['status'] = element.data().status;
                    elementArray['takedAt'] = element.data().takedAt;
                    apiCards.push(elementArray);
                });
                setCards(apiCards);
                dispatch(hide());
            });
        }
        fetchCards();
    }, [updateCards, dispatch]);
    const filterCards = () => {
        const filteredCards = cards.filter(c => c.type === filterType);
        return filteredCards;
    }
    const handleFilter = (type) => {
        dispatch(showLoader());
        setTimeout(() => {
            setFilterType(type);
            dispatch(hide());
        }, 200);
    }
    return (
        <>
            <Menu types={types} handleFilter={handleFilter} />
            {cards.length > 0 && <Nodes update={() => { setUpdateCards(updateCards + 1) }} cards={filterCards()} />}
        </>
    );
}

export default Grid;
