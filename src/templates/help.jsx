import { useState } from "react";
import { Container } from "react-bootstrap";
import { useDispatch } from 'react-redux';
import { hide } from '../reducers/loaderState';
function Help() {
  const dispatch = useDispatch();
  const [deeplink, setDeeplink] = useState('');
  dispatch(hide());
  const goBenefit = () => {
    var a = document.createElement('a');
    a.target = "_blank";
    a.href = deeplink;
    a.click();
  }
  return (
    <>
      <Container>
        <input type="text" className="form-control mb-5 mt-5" placeholder="enter deeplink" onChange={(e) => setDeeplink(e.target.value)} />
        <button className="btn btn-danger mb-5" onClick={goBenefit}>Go Benefit</button> <br />
        <a href={deeplink} target="_blank">Go Benefit</a>
        <p className="mt-5">{deeplink !== '' ? deeplink : 'No Deep Link'}</p>
      </Container>
    </>
  );
}

export default Help;
