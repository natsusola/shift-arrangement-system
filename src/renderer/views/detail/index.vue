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
        <div class="col-4">
          <ul class="member-list">
            <li class="member-item row" v-for="(member, index) in members">
              <div class="col-8 p-l-px-0">
                <span class="member-name">{{member.name}}</span>
                <span class="member-id">({{member.id}})</span>
                <span class="member-id">: {{member.count}}</span>
              </div>
              <span class="member-id" @click="doRemoveMember(index)">
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
                <button class="btn btn-secondary">新增</button>
              </div>
            </div>
          </form>
        </div>
        <div class="col-8">
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
      }
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

      }
    }
  }
</script>
