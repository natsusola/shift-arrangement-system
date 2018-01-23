import Promise from 'bluebird';
import MyDB from '@/db';

const dbRequest = (fn, params) => {
  console.log(`%c REQ `, 'background: blue; color: white', fn.name, params);
  return fn(params)
    .then(res => {
      console.log(`%c RES `, 'background: #6ab8fc; color: white', fn.name, res);
      return res;
    })
    .catch(err => {
      console.log(`%c RES `, 'background: red; color: white', fn.name, res);
      throw err;
    });
};

export default dbRequest;
