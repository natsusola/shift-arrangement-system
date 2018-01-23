<template>
  <div class="home-wrap">
    <h3>列表</h3>
    <button class="btn btn-primary m-b-px-10"
      @click="doAddProject">
      新增專案
    </button>
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
  </div>
</template>

<script>
  import { dbRequest, dbAPI } from '@/utils';
  import moment from 'moment';

  function apiListProject(params) {
    return dbRequest(dbAPI.project.list)
      .then(res => { this.projects = res.projects; });
  }

  function apiRemoveProject(params) {
    return dbRequest(dbAPI.project.remove, params);
  }

  export default {
    name: 'home',
    data() {
      return {
        params: {
          limit: 10,
          page: 1
        },
        projects: []
      }
    },
    mounted() {
      apiListProject.call(this, this.params);
    },
    methods: {
      doRemoveProject(pj) {
        apiRemoveProject.call(this, pj)
          .then(() => {
            apiListProject.call(this, this.params);
          });
      },
      doAddProject() {
        this.$router.push({name: 'detail', query: {_id: '', _rev: ''}});
      }
    },
    filters: {
      dateFormat: (date) => {
        return moment(date).format('YYYY/MM/DD HH:mm:ss');
      }
    }
  };
</script>
