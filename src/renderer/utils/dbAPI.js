import MyDB from '@/db';

const dbAPI = {
  project: {}
};

const defaultObj = {
  code: 0,
  msg: 'success'
};

dbAPI.project.list = function projectList(params) {
  return MyDB.createIndex({ index: { fields: ['name'] } })
    .then(() => {
      return MyDB.find({
        selector: {}
      });
    })
    .then(res => ({
      ...defaultObj,
      projects: res.docs
    }));
};

dbAPI.project.remove = function projectRemove(params) {
  return MyDB.remove(params)
    .then(res => ({
      ...defaultObj
    }));
};

export default dbAPI;
