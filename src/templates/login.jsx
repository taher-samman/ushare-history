import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, logInWithEmailAndPassword } from '../firebase';
import { useDispatch } from 'react-redux';
import { show, hide } from '../reducers/loaderState';
import { toast } from 'react-toastify';
function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState(undefined);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/');
      } else {
        setUser(null);
      }
    });
  }, [navigate])

  const login = (e) => {
    e.preventDefault();
    dispatch(show());
    logInWithEmailAndPassword(email, password)
      .then((d) => {
        toast.success(`Hello`);
      })
      .catch((e) => toast.error(`Error Login: ${e}`))
      .finally(() => { dispatch(hide()); })
      ;
  }

  if (user === null) {
    return (
      <div className="container h-100">
        <div className="row h-100">
          <div className="col-12 m-auto">
            <form className="d-flex flex-column" onSubmit={e => { login(e) }}>
              <div className="mb-3">
                <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} className="form-control" />
              </div>
              <div className="mb-3">
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="form-control" />
              </div>
              <button type="submit" className="btn btn-danger m-auto">Login</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
