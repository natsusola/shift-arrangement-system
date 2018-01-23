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

dbAPI.project.get = function projectGet(params) {

  return MyDB.get(params._id)
    .then(res => ({
      ...defaultObj,
      project: res
    }));
};

dbAPI.project.add = function projectAdd(params) {
  params.created_at = JSON.stringify(new Date());
  return MyDB.post(params)
    .then(res => ({
      ...defaultObj
    }));
};

dbAPI.project.update = function projectAdd(params) {
  params.updated_at = JSON.stringify(new Date());
  return MyDB.put(params)
    .then(res => ({
      ...defaultObj
    }));
};

dbAPI.project.remove = function projectRemove(params) {
  return MyDB.remove(params)
    .then(res => ({
      ...defaultObj
    }));
};

export default dbAPI;
