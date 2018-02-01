import PouchDB from '@/db';
import MemoryStream from 'memorystream';

let MyDB = new PouchDB('my_db');

const dbAPI = {
  sys: {},
  project: {}
};

const defaultObj = {
  code: 0,
  msg: 'success'
};

dbAPI.sys.dumpDB = function dumpDB() {
  let _dumpString = '';
  let _stream = new MemoryStream();
  _stream.on('data', (chunk) => { _dumpString += chunk.toString(); });
  return MyDB.dump(_stream)
    .then(() => ({
      ...defaultObj,
      data: _dumpString
    }));
};

dbAPI.sys.importDB = function importDB(params) {
  return MyDB.destroy()
    .then(() => { MyDB = new PouchDB('my_db'); })
    .then(() => MyDB.loadIt(params.data))
    .then(() => ({...defaultObj}));
}

dbAPI.project.list = function projectList(params) {
  return MyDB.createIndex({ index: { fields: ['name'] } })
    .then(() => {
      return MyDB.find({
        selector: {},
      });
    })
    .then(res => {
      let _page = params.page;
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

dbAPI.project.update = function projectUpdate(params) {
  params.updated_at = (new Date()).toISOString();
  return MyDB.put(params)
    .then(res => ({
      ...defaultObj
    }));
};

dbAPI.project.remove = function projectRemove(params) {
  return MyDB.remove({_id: params._id, _rev: params._rev})
    .then(res => ({
      ...defaultObj
    }));
};

export default dbAPI;
