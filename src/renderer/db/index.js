import PouchDB from 'pouchdb-browser';
import PouchDBFind from 'pouchdb-find';
import PouchDBLoad from 'pouchdb-load';
import replicationStream from 'pouchdb-replication-stream';

PouchDB
  .plugin(PouchDBFind)
  .plugin({loadIt: PouchDBLoad.load})
  .plugin(replicationStream.plugin)
  .adapter('writableStream', replicationStream.adapters.writableStream)
  ;

export default PouchDB;
