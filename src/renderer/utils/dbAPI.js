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
        selector: {},
      });
    })
    .then(res => {
      let _page = params.page || 1;
      let _limit = params.limit || 10;
      return {
        ...defaultObj,
        total: res.docs.length,
        projects: res.docs.slice((_page - 1) * _limit, _page * _limit)
      };
    });
};

dbAPI.project.get = function projectGet(params) {
  return MyDB.get(params._id)
    .then(res => ({
      ...defaultObj,
      project: res
    }));
};

dbAPI.project.add = function projectAdd(params) {
  params.created_at = (new Date()).toISOString();
  return MyDB.post(params)
    .then(res => ({
      ...defaultObj
    }));
};

dbAPI.project.update = function projectAdd(params) {
  params.updated_at = (new Date()).toISOString();
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
