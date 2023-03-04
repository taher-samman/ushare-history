import { refEqual } from "firebase/firestore";
import User from "./user";

function Users(props) {
    const users = props.users
    return (
        <>
            <div className="accordion" id="accordionUsers">
                {users.map(user => <User
                    key={user.id}
                    user={user}
                    debits={props.debits.filter(debit => refEqual(debit.user, user.userRef))}
                    paids={props.paids.filter(paid => refEqual(paid.user, user.userRef))}
                    update={props.update}
                />)
                }
            </div>
        </>);
}
export default Users;