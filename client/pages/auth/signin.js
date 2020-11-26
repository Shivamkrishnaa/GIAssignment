import { useState, useEffect } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

export default () => {
  const [url, setUrl] = useState('/api/users/signup');
  const [phone, setPhone] = useState('');
  const [verified, setVerified] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [apiErrors, setApiErrors] = useState(null)
  const [body, setBody] = useState({
    phone: ''
  });

  const { doRequest, errors } = useRequest({
    url: url,
    method: 'post',
    body: body,
    onSuccess: (d) => {
      if (d.success && !smsSent && url == '/api/users/signup' ){
        setApiErrors( null)
        setSmsSent(d.success);
        setUrl('/api/users/signup-verify');
      }
      else if(d.success && smsSent && !verified && url == '/api/users/signup-verify'){
        if(d.existingUser){
          Router.push('/');
        }
        else{
         setApiErrors( <div className="alert alert-danger">
          <h4>Ooops....</h4>
          <ul className="my-0">
            <li key={err.message}></li>
          </ul>
        </div>)
        }
      }
      else {
        setApiErrors( <div className="alert alert-danger">
          <h4>Ooops....</h4>
          <ul className="my-0">
            <li key={'un-register'}>User Not registered</li>
          </ul>
        </div>)
      }
    }
  });

  const onSubmit = async event => {
    event.preventDefault();

    await doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
       <React.Fragment>

<h1>Sign Up</h1>
<div className="form-group">
  <label>Phone</label>
  <input
    value={body.phone}
    onChange={e => { setPhone(e.target.value); setBody({ phone: e.target.value }) }}
    className="form-control"
  />
</div>
{
  smsSent ? <div className="form-group" >
    <label>OTP</label>
    <input
      value={body.otp}
      onChange={e => setBody({ phone: phone, otp: e.target.value })}
      className="form-control"
    />
  </div>
: null
}
</React.Fragment>

      {errors}
      {apiErrors}
      <button className="btn btn-primary">Sign Up</button>
    </form>
  );
};
