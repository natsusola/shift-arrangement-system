// import Promise from 'bluebird';
import { Toast } from '@/views/utils';

const errorHandler = (err) => {
  const _err = {
    code: err.status,
    msg: err.name
  };
  Toast.showToast(`[${_err.code}] ${_err.msg}.`);
  throw _err;
};

const dbRequest = (fn, params) => {
  console.log(`%c REQ `, 'background: blue; color: white', fn.name, params);
  return fn(params)
    .then(res => {
      console.log(`%c RES `, 'background: #6ab8fc; color: white', fn.name, res);
      return res;
    })
    .catch(err => {
      console.log(`%c RES `, 'background: red; color: white', fn.name, err);
      errorHandler(err);
    });
};

export default dbRequest;
