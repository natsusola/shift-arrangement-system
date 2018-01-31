import PouchDB from 'pouchdb-browser';
import PouchDBFind from 'pouchdb-find';
import replicationStream from 'pouchdb-replication-stream';

PouchDB
  .plugin(PouchDBFind)
  .plugin(replicationStream.plugin)
  .adapter('writableStream', replicationStream.adapters.writableStream);

let db = new PouchDB('my_db');

export default db;
