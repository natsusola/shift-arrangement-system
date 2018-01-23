import MyDB from '@/db';

const dbAPI = {
  project: {}
};

dbAPI.project.list = (params) => {
  return MyDB.createIndex({ index: { fields: ['name'] } })
    .then(() => {
      return MyDB.find({
        selector: {}
      });
    });
};

export default dbAPI;
