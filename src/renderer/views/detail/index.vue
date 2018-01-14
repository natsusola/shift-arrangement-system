<template>
  <div class="detail-wrap">
    <h3>編輯</h3>
    <router-link :to="{ name: 'dashboard' }">
      back
    </router-link>
    <form name="projectForm">
      <div class="form-group row">
        <label for="p-name" class="col-1 col-form-label">名稱</label>
        <div class="col-3">
          <input class="form-control" type="text" id="p-name" v-model="projectForm.name">
        </div>
      </div>
      <div class="form-group row">
        <label for="p-desc" class="col-1 col-form-label">簡述</label>
        <div class="col-5">
          <input class="form-control" type="text" id="p-desc" v-model="projectForm.desc">
        </div>
      </div>
    </form>
    <div class="">
      <div class="row">
        <div class="col-3">
          <div class="m-b-px-10">人員名單(<span>清除全部</span>)：</div>
          <ul class="member-list">
            <li class="member-item row" v-for="(member, index) in members">
              <div class="col-10 p-l-px-0">
                <span class="member-index">{{index + 1}}.</span>
                <span class="member-name">{{member.name}}</span>
                -
                <span class="member-id">{{member.id}}</span>
                <span class="member-id">({{member.count}})</span>
              </div>
              <span class="icon-btn icon-rm" @click="doRemoveMember(index)">
                <i class="fa fa-times" aria-hidden="true"></i>
              </span>
            </li>
          </ul>
          <form name="membersForm" @submit.prevent="doAddMember">
            <div>
              <div class="form-group row">
                <div class="col-4 p-px-0">
                  <input
                    class="form-control"
                    type="text"
                    id="memberName"
                    v-model="memberForm.name"
                    ref="memberName"
                    placeholder="姓名">
                </div>
                <div class="col-6">
                  <input
                    class="form-control"
                    type="text"
                    id="memberId"
                    v-model="memberForm.id"
                    placeholder="手機或email">
                </div>
                <button class="btn btn-secondary" :disabled="!this.memberForm.name || !this.memberForm.id">新增</button>
              </div>
            </div>
          </form>
          <div>
            <input type="file" class="form-control" @change="memberFile"/>
          </div>
        </div>
        <div class="col-9">
          <div class="m-b-px-10">事件列表(<span>清除全部</span>)：</div>
          <table>

          </table>
          <form name="eventsForm">
            <div>
              <div class="form-group row">
                <div class="col-4 p-px-0">
                  <input
                    class="form-control"
                    type="text"
                    id="eventName"
                    placeholder="活動名稱(時間)">
                </div>
                <div class="col-2">
                  <input
                    class="form-control"
                    type="number"
                    id="eventId"
                    min="0"
                    placeholder="需求人數">
                </div>
                <button class="btn btn-secondary">新增</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="detail-footer">
      <button class="btn btn-primary">存檔</button>
      <button class="btn btn-default" @click="doBack">返回</button>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        projectForm: {
          name: '',
          desc: '',
        },
        memberForm: {
          name: '',
          id: ''
        },
        eventForm: {
          name: '',
          number: 0
        },
        members: [],
        events: [],
        memberFile: {}
      };
    },
    methods: {
      doAddMember() {
        this.members.push(this.memberForm);
        this.memberForm = {};
        this.$refs.memberName.focus();
      },
      doRemoveMember(index) {
        this.members.splice(index, 1);
      },
      doAddEvent() {

      },
      doRemoveEvent() {

      },
      onUploadMemberFile() {

      },
      doBack() {
        this.$router.go(-1);
      }
    },
  }
</script>
