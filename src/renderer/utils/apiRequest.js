import Promise from 'bluebird';
import MyDB from '@/db';

const apiRequest = (fn, params) => {

  return fn(params)
    .catch(console.log);
};

export default apiRequest;
