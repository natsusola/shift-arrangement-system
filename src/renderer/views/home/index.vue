<template>
  <div class="home-wrap">
    <h3>
      <span>列表</span>
      <i id="github-icon"
        class="fa fa-github icon-btn" aria-hidden="true"
        @click="doOpenLink('https://github.com/natsusola/shift-arrangment-system')">
      </i>
    </h3>
    <div class="m-b-px-10">
      <button class="btn btn-primary"
        style="float:right"
        @click="doAddProject">
        新增專案
      </button>
      <button class="btn btn-success"
        @click="doExportDB">
        <i class="fa fa-upload" aria-hidden="true"></i>匯出資料庫
      </button>
      <b-dropdown
        class="reminder-dropdown" variant="link" size="sm" no-caret
        style="min-width: 16rem"
        @hidden="onImportDropHidden">
        <template slot="button-content">
          <button class="btn btn-success p-px-0">
            <i class="fa fa-download" aria-hidden="true"></i>匯入資料庫
          </button>
        </template>
        <div class="m-b-px-5">
          <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>
          匯入將會覆蓋目前所有資料！
        </div>
        <div class="row">
          <input class="form-control col-9 m-r-px-5" type="file"
            ref="dbFileInput" accept=".pdb"
            @change="onUploadDbFile($event)"/>
          <button class="btn btn-danger" :disabled="!dbDataStr"
            @click="doImportDbFile">
            匯入
          </button>
        </div>
      </b-dropdown>
    </div>
    <table class="table table-bordered">
      <thead class="thead-default">
        <tr>
          <th>#</th>
          <th>專案名稱</th>
          <th>簡述</th>
          <th>人員數</th>
          <th>活動數</th>
          <th>建立日期</th>
          <th>更新日期</th>
          <th></th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(project, index) in projects" :key="project._id">
          <td>{{(params.page - 1) * params.limit + index + 1}}</td>
          <td>{{project.name}}</td>
          <td>{{project.desc}}</td>
          <td>
            {{project.members.length}}
          </td>
          <td>
            {{project.events.length}}
          </td>
          <td>{{project.created_at | dateFormat}}</td>
          <td>{{project.updated_at | dateFormat}}</td>
          <td>
            <router-link :to="{
                name: 'detail',
                query: { _id: project._id, _rev: project._rev }
              }">
              <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
            </router-link>
          </td>
          <td>
            <i class="fa fa-times icon-btn icon-rm" aria-hidden="true"
              @click="doRemoveProject(project)">
            </i>
          </td>
        </tr>
      </tbody>
    </table>
    <b-pagination
      size="md"
      :total-rows="total"
      v-model="params.page"
      :per-page="params.limit"
      @change="onChangePage">
    </b-pagination>
  </div>
</template>

<script>
  import { dbRequest, dbAPI } from '@/utils';
  import { saveAs } from 'file-saver';
  import moment from 'moment';

  let shell;
  if (__TARGET__ === 'ELECTRON') {
    import('electron').then(res => { shell = res.shell; });
  }

  function apiListProject(params) {
    return dbRequest(dbAPI.project.list, params)
      .then(res => {
        this.projects = res.projects;
        this.total = res.total;
      });
  }

  function apiRemoveProject(params) {
    return dbRequest(dbAPI.project.remove, params);
  }

  function apiDumpDb() {
    return dbRequest(dbAPI.sys.dumpDB);
  }

  export default {
    name: 'home',
    data() {
      return {
        params: {
          page: 1,
          limit: 10,
        },
        projects: [],
        total: 0,
        dbDataStr: ''
      }
    },
    mounted() {
      apiListProject.call(this, this.params);
    },
    methods: {
      doRemoveProject(pj) {
        apiRemoveProject.call(this, pj)
          .then(() => { apiListProject.call(this, this.params); });
      },
      doAddProject() {
        this.$router.push({name: 'detail', query: {_id: '', _rev: ''}});
      },
      onChangePage() {
        apiListProject.call(this, this.params);
      },
      doOpenLink(url) {
        if (__TARGET__ === 'ELECTRON') {
          shell.openExternal(url);
        } else {
          window.open(url);
        }
      },
      doExportDB() {
        apiDumpDb().then(res => {
          saveAs(
            new Blob([res.data], {type: 'text/plain;charset=utf-8'}),
            `${moment().format('YYMMDDHHmmss')}.pdb`
          );
        });
      },
      onImportDropHidden() {
        this.dbDataStr = '';
        this.$refs.dbFileInput.value = '';
      },
      onUploadDbFile(e) {
        if (e.target.files[0]) {
          let _reader = new FileReader();
          _reader.onload = (e) => {
            this.dbDataStr = e.target.result;
          };
          _reader.readAsText(e.target.files[0])
        }
      },
      doImportDbFile() {
        dbRequest(dbAPI.sys.importDB, {data: this.dbDataStr})
          .then(() => {
            this.dbDataStr = '';
            this.$refs.dbFileInput.value = '';
            apiListProject.call(this, this.params);
          });
      }
    },
    filters: {
      dateFormat: (date) => {
        return date ? moment(date).format('YYYY/MM/DD HH:mm:ss') : '';
      }
    }
  };
</script>
