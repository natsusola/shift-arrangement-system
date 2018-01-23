<template>
  <div class="home-wrap">
    <h3>列表</h3>
    <router-link :to="{ name: 'detail', params: {id: 1} }">
      goto
    </router-link>
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
            <!-- {{project.members.length}} -->
          </td>
          <td>
            <!-- {{project.events.length}} -->
          </td>
          <td>{{project.created_at}}</td>
          <td>{{project.updated_at}}</td>
          <td>
            <i class="fa fa-pencil-square-o" aria-hidden="true">
            </i>
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
  import MyDB from '@/db';

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
      doClick(e, params) { console.log(e, params); }
    }
  };
</script>
