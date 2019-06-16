<template>
  <div class="col-evnets">
    <div class="m-b-px-10">
      <span>活動列表({{events.length}})</span>
      <b-form-checkbox class="m-b-px-0" v-model="eventTable.showMemberId">
        顯示人員ID
      </b-form-checkbox>
      <b-form-checkbox class="m-b-px-0" v-model="eventTable.showMemberCount">
        顯示人員班數
      </b-form-checkbox>
      <!-- ：<span>清除全部</span> -->
    </div>
    <table class="table table-bordered event-table">
      <thead class="thead-default">
        <tr>
          <th class="ta-r" style="width: 40px">#</th>
          <th>活動名稱</th>
          <th style="width: 40px"></th>
          <th class="ta-r" style="width: 120px">人數(選/全)</th>
          <th v-for="n in eventTable.maxCount">人員{{n}}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(event, eIndex) in events">
          <td class="ta-r">{{eIndex + 1}}</td>
          <td>
            <span>{{event.name}}</span>
            <!-- <input class="form-control" style="width: initial;" type="text" v-model.trim="event.name"/> -->
          </td>
          <td>
            <i class="fa fa-times icon-btn icon-rm" aria-hidden="true"
              @click="doRemoveEvent(event, eIndex)">
            </i>
          </td>
          <td class="ta-r">{{event.memberIds | computeEventMembersLen}}{{`/${event.memberCount}`}}</td>
          <td v-for="(m, mIndex) in event.memberCount">
            <b-dropdown split class="btn-group member-dropmenu-group" variant="secondary"
              @hidden="event.searchKw = ''">
              <template slot="button-content">
                <div v-if="!event.memberIds[mIndex]">-----</div>
                <div v-else>
                  <div>
                    {{membersIndex[event.memberIds[mIndex]].name}}
                    <span v-if="eventTable.showMemberCount">
                      ({{membersIndex[event.memberIds[mIndex]].count}})
                    </span>
                  </div>
                  <div v-if="eventTable.showMemberId">{{membersIndex[event.memberIds[mIndex]].id}}</div>
                </div>
              </template>
              <div class="search-group">
                <input class="form-control" v-model.trim="event.searchKw" placeholder="名稱orID"/>
              </div>
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item href="#"
                v-if="!event.searchKw"
                @click="doCleanEventMember(event, mIndex)">清空</b-dropdown-item>
              <b-dropdown-item href="#"
                v-if="!event.searchKw"
                class="icon-btn icon-rm" @click="doRemoveEventMember(event, mIndex)">
                移除
              </b-dropdown-item>
              <b-dropdown-divider v-if="!event.searchKw"></b-dropdown-divider>
              <b-dropdown-item href="#"
                v-for="(mo, moIndex) in pickMemberOptions(event)"
                :key="mo.id"
                @click="doPickMember(event, eIndex, mIndex, mo.id)">
                {{`${moIndex + 1}: ${mo.name} (${mo.count})`}}
              </b-dropdown-item>
            </b-dropdown>
          </td>
          <td>
            <i class="fa fa-plus icon-btn" aria-hidden="true"
              @click="doAddEventMemberCount(eIndex)">
            </i>
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
          <div class="col-3">
            <input
              class="form-control"
              type="number"
              id="eventId"
              min="0"
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
    <div>
      <div class="form-group row">
        <label for="p-name" class="col-form-label">
          Excel 匯入
          <b-dropdown class="reminder-dropdown" variant="link" size="lg" no-caret>
            <template slot="button-content">
              <i class="fa fa-question-circle-o icon-btn" aria-hidden="true"></i>
            </template>
            Excel 格式：
            <table class="table table-bordered m-b-px-0">
              <thead>
                <tr>
                  <th>name</th>
                  <th>memberCount</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="i in 2">
                  <td>活動{{i}}</td>
                  <td>{{i}}</td>
                </tr>
              </tbody>
            </table>
          </b-dropdown>
          ：
        </label>
        <input type="file" class="form-control col-4"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ref="eventFileInput"
          @change="onUploadEventExcelFile($event)"/>
      </div>
    </div>
  </div>
</template>

<script>
  import XLSX from 'xlsx';

  export default {
    props: ['events', 'members', 'membersIndex'],
    data() {
      return {
        eventForm: {
          name: '',
          memberCount: undefined,
          memberIds: []
        },
        eventTable: {
          maxCount: 0,
        },
      };
    },
    methods: {
      doAddEvent() {
        this.events.push({...this.eventForm, memberIds: []});
        this.eventTable.maxCount = this.eventForm.memberCount > this.eventTable.maxCount ? this.eventForm.memberCount : this.eventTable.maxCount;
        this.eventForm = {};
        this.$refs.eventName.focus();
      },
      doRemoveEvent(event, ePos) {
        _.forEach(event.memberIds, mid => {
          if (mid) this.membersIndex[mid].count--;
        });
        this.events.splice(ePos, 1);
        if (!this.events.length) this.eventTable.maxCount = 0;
        else this.eventTable.maxCount = _.chain(this.events).map(e => e.memberCount).max().value();
      },
      doAddEventMemberCount(ePos) {
        this.events[ePos].memberCount++;
        if (this.events[ePos].memberCount > this.eventTable.maxCount) this.eventTable.maxCount = this.events[ePos].memberCount;
      },
      doRemoveEventMember(event, mPos) {
        if (event.memberIds[mPos])  this.membersIndex[event.memberIds[mPos]].count--;
        event.memberIds.splice(mPos, 1);
        event.memberCount--;
        this.eventTable.maxCount = _.chain(this.events).map(e => e.memberCount).max().value();
      },
      doCleanEventMember(event, mPos) {
        if (!event.memberIds[mPos]) return;
        this.membersIndex[event.memberIds[mPos]].count--;
        event.memberIds[mPos] = '';
      },
      doPickMember(event, ePos, mPos, mid) {
        let _tmp = this.events[ePos];
        if (this.events[ePos].memberIds[mPos]) this.membersIndex[this.events[ePos].memberIds[mPos]].count--;
        _tmp.memberIds[mPos] = mid;
        this.membersIndex[mid].count++;
        this.events[ePos] = _tmp;
      },
      pickMemberOptions(event) {
        let _ary = _.filter(this.members, m => !_.includes(event.memberIds, m.id));
        if (event.searchKw) {
          _ary = _.filter(_ary, m => m.name.indexOf(event.searchKw) > -1 || m.id.indexOf(event.searchKw) > -1);
        }
        return _ary;
      },
      onUploadEventExcelFile(e) {
        if (e.target.files[0]) {
          let _reader = new FileReader();
          _reader.onload = (e) => {
            this.$refs.eventFileInput.value = '';
            let _data = e.target.result;
            /* 檢查格式 */
            let _wb = XLSX.read(_data, { type: 'binary' });
            let _requiredKeys = { A1: 'name', B1: 'memberCount' };
            for (let key in _requiredKeys) {
              if (_wb.Sheets[_wb.SheetNames[0]][key].v !== _requiredKeys[key]) {
                this.$emit('doShowModal', '[錯誤] EXCEL 格式錯誤!');
                return;
              }
            }
            let _xlEvents = XLSX.utils.sheet_to_json(_wb.Sheets[_wb.SheetNames[0]]);
            for (let i = 0; i < _xlEvents.length; i++) {
              _xlEvents[i].memberCount = parseInt(_xlEvents[i].memberCount);
              this.events.push({..._xlEvents[i], memberIds: []});
              if (_xlEvents[i].memberCount > this.eventTable.maxCount) this.eventTable.maxCount = _xlEvents[i].memberCount;
            }
          };
          _reader.readAsBinaryString(e.target.files[0]);
        }
      },
      getEventTableMaxCount() {
        return this.eventTable.maxCount;
      },
    },
    filters: {
      computeEventMembersLen(memberIds) {
        return _.filter(memberIds, mid => mid).length;
      }
    },
    watch: {
      events: {
        handler(nv, ov) {
          if (nv.length !== ov.length) {
            this.eventTable.maxCount = _.chain(this.events).map(e => e.memberCount).max().value();
          }
        }
      }
    }
  }
</script>
