<template>
  <div class="detail-wrap">
    <h3>編輯</h3>
    <form name="projectForm" @submit.prevent>
      <div class="form-group row">
        <label for="p-name" class="col-1 col-form-label">名稱</label>
        <div class="col-3">
          <input class="form-control" type="text" id="p-name" v-model.trim="projectForm.name">
        </div>
      </div>
      <div class="form-group row">
        <label for="p-desc" class="col-1 col-form-label">簡述</label>
        <div class="col-5">
          <input class="form-control" type="text" id="p-desc" v-model.trim="projectForm.desc">
        </div>
        <div class="col-6">
          <button class="btn btn-success"
            @click="doShift"
            :disabled="canDoShift">
            隨機排班
          </button>
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
              <span class="icon-btn icon-rm" @click="doRemoveMember(index, member.id)">
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
                    v-model.trim="memberForm.name"
                    ref="memberName"
                    placeholder="姓名">
                </div>
                <div class="col-6">
                  <input
                    class="form-control"
                    type="text"
                    id="memberId"
                    v-model.trim="memberForm.id"
                    placeholder="ID(手機或email)">
                </div>
                <button class="btn btn-success"
                  :disabled="!this.memberForm.name || !this.memberForm.id">
                  新增
                </button>
              </div>
            </div>
          </form>
          <div>
            <div class="form-group row">
              <label for="p-name" class="col-form-label">Excel 匯入：</label>
              <input type="file" class="form-control" style="flex:1" @change="memberFile"/>
            </div>
          </div>
        </div>
        <div class="col-9">
          <div class="m-b-px-10">事件列表(<span>清除全部</span>)：</div>
          <table class="table table-bordered event-table" style="table-layout: fixed;">
            <thead class="thead-default">
              <tr>
                <th class="ta-r" style="width: 40px">#</th>
                <th>活動名稱</th>
                <th class="ta-r" style="width: 120px">人數(選/全)</th>
                <th v-for="n in eventTable.maxCount">人員{{n}}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(event, eIndex) in events">
                <td class="ta-r">{{eIndex + 1}}</td>
                <td>{{event.name}}</td>
                <td class="ta-r">{{`${event.memberIds.length}/${event.memberCount}`}}</td>
                <td v-for="(m, mIndex) in event.memberCount">
                  <div class="btn-group">
                    <button type="button" class="btn btn-secondary">
                      {{event.memberIds[mIndex] ? event.memberIds[mIndex] : '-----'}}
                    </button>
                    <button type="button"
                      class="btn btn-secondary dropdown-toggle dropdown-toggle-split"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false">
                      <span class="sr-only">Toggle Dropdown</span>
                    </button>
                    <div class="dropdown-menu">
                      <!-- <input type="text" /> -->
                      <a class="dropdown-item" href="#">
                        移除
                      </a>
                      <div class="dropdown-divider"></div>
                      <a class="dropdown-item" href="#"
                        v-for="(mo, moIndex) in pickMemberOptions(event)"
                        @click="doPickMember(event, eIndex, mIndex, mo.id)">
                        {{`${mo.name}-${mo.id}(${mo.count})`}}
                      </a>
                    </div>
                  </div>
                </td>
                <td v-if="eventTable.maxCount > event.memberCount" :colspan="eventTable.maxCount - event.memberCount"></td>
              </tr>
            </tbody>
          </table>
          <form name="eventsForm" @submit.prevent="doAddEvent">
            <div>
              <div class="form-group row">
                <div class="col-4 p-px-0">
                  <input
                    class="form-control"
                    type="text"
                    id="eventName"
                    ref="eventName"
                    v-model.trim="eventForm.name"
                    placeholder="活動名稱(時間)">
                </div>
                <div class="col-2">
                  <input
                    class="form-control"
                    type="number"
                    id="eventId"
                    min="0"
                    :max="members.length"
                    v-model.number="eventForm.memberCount"
                    placeholder="需求人數">
                </div>
                <button class="btn btn-success"
                  :disabled="!this.eventForm.name || !this.eventForm.memberCount">
                  新增
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="detail-footer">
      <button class="btn btn-primary m-r-px-20">存檔</button>
      <button class="btn btn-secondary" @click="doBack">返回</button>
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
          memberCount: undefined,
          memberIds: []
        },
        members: [],
        membersIndex: {},
        events: [],
        memberFile: {},
        layout: {
          tableMaxCount: 0
        },
        eventTable: {
          maxCount: 0,

        },
      };
    },
    methods: {
      doAddMember() {
        if (this.membersIndex[this.memberForm.id]) return;
        this.membersIndex[this.memberForm.id] = {...this.memberForm, count: 0};
        this.members.push(this.membersIndex[this.memberForm.id]);
        this.memberForm = {};
        this.$refs.memberName.focus();
      },
      doRemoveMember(index, memberId) {
        delete this.membersIndex[memberId];
        this.members.splice(index, 1);
      },
      doAddEvent() {
        this.events.push({...this.eventForm, memberIds: []});
        this.eventTable.maxCount = this.eventForm.memberCount > this.eventTable.maxCount ? this.eventForm.memberCount : this.eventTable.maxCount;
        this.eventForm = {};
        this.$refs.eventName.focus();
      },
      doRemoveEvent() {

      },
      onUploadMemberFile() {

      },
      doPickMember(event, ePos, mPos, mid) {
        let _tmp = this.events[ePos];
        if (this.events[ePos].memberIds[mPos]) this.membersIndex[this.events[ePos].memberIds[mPos]].count--;
        _tmp.memberIds[mPos] = mid;
        this.membersIndex[mid].count++;
        this.events[ePos] = _tmp;
      },
      doBack() {
        this.$router.go(-1);
      },
      doShift() {

      },
      pickMemberOptions(event) {
        return _.filter(this.members, m => !_.includes(event.memberIds, m.id));
      },
    },
    computed: {
      canDoShift() {
        return this.members.length >= _.reduce(this.events, (e, sum) => sum + e.memberCount, 0);
      },
    },
    filters: {

    }
  }
</script>
