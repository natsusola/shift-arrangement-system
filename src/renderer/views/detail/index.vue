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
          <button class="btn btn-success m-r-px-10"
            @click="doShift">
            隨機排班
          </button>
          <button class="btn btn-info"
            @click="doExport"
            :disabled="canDoExport">
            匯出 Excel
          </button>
        </div>
      </div>
    </form>
    <div class="">
      <div class="row" style="flex-wrap: initial;">
        <div class="col-members">
          <div class="m-b-px-10">
            人員名單({{members.length}})
            <!-- ：<span>清除全部</span> -->
          </div>
          <table class="table table-bordered event-table">
            <thead class="thead-default">
              <tr>
                <th>#</th>
                <th>名稱</th>
                <th>ID</th>
                <th>班數</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(member, index) in members" :key="member.id">
                <td>{{index + 1}}</td>
                <td>
                  <span>{{member.name}}</span>
                </td>
                <td>{{member.id}}</td>
                <td>{{member.count}}</td>
                <td>
                  <i class="fa fa-times icon-btn icon-rm"
                    aria-hidden="true"
                    @click="doRemoveMember(index, member.id)">
                  </i>
                </td>
              </tr>
            </tbody>
          </table>
          <form class="member-form m-b-px-5" name="membersForm" @submit.prevent="doAddMember">
            <div class="form-group row m-b-px-5">
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
              <div class="form-reminder">* ID 不可重複</div>
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
                        <th>id</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="i in 2">
                        <td>人員{{i}}</td>
                        <td>09{{`${(i+'').repeat(8)}`}}</td>
                      </tr>
                    </tbody>
                  </table>
                </b-dropdown>
                ：
              </label>
              <input type="file" class="form-control" style="flex:1"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                @change="onUploadMemberExcelFile($event)"/>
            </div>
          </div>
        </div>
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
                @change="onUploadEventExcelFile($event)"/>
            </div>
          </div>
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
  import XLSX from 'xlsx';
  import moment from 'moment';
  import { saveAs } from 'file-saver';

  class Workbook {
    constructor() {
      this.SheetNames = [];
      this.Sheets = {};
    }
  };

  function s2ab(s) {
    let _buf = new ArrayBuffer(s.length);
    let _view = new Uint8Array(_buf);
    for (let i = 0; i != s.length; ++i) _view[i] = s.charCodeAt(i) & 0xFF;
    return _buf;
  }

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
        layout: {
          tableMaxCount: 0
        },
        eventTable: {
          maxCount: 0,

        },
      };
    },
    methods: {
      /* Member UI Event*/
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
        _.each(this.events, e => {
          _.each(e.memberIds, (mid, mPos) => {
            if (mid === memberId) e.memberIds[mPos] = '';
          });
        });
      },
      onUploadMemberExcelFile(e) {
        if (e.target.files[0]) {
          let _reader = new FileReader();
          _reader.onload = (e) => {
            let _data = e.target.result;
            let _wb = XLSX.read(_data, { type: 'binary' });
            let _xlMembers = XLSX.utils.sheet_to_json(_wb.Sheets[_wb.SheetNames[0]]);
            /* 驗證 id 沒有重複 */
            let _validObj = {};
            for (let i = 0; i < _xlMembers.length; i++) {
              if (_validObj[_xlMembers[i].id] || this.membersIndex[_xlMembers[i].id]) return;
              _validObj[_xlMembers[i].id] = {..._xlMembers[i], count: 0};
            }
            /* 為了順序和 Reference 再跑一次迴圈 */
            for (let i = 0; i < _xlMembers.length; i++) {
              this.membersIndex[_xlMembers[i].id] = _validObj[_xlMembers[i].id];
              this.members.push(this.membersIndex[_xlMembers[i].id]);
            }
          };
          _reader.readAsBinaryString(e.target.files[0]);
        }
      },
      /* Event UI Event*/
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
            let _data = e.target.result;
            let _wb = XLSX.read(_data, { type: 'binary' });
            let _xlEvents = XLSX.utils.sheet_to_json(_wb.Sheets[_wb.SheetNames[0]]);
            /* 驗證 id 沒有重複 */
            for (let i = 0; i < _xlEvents.length; i++) {
              _xlEvents[i].memberCount = parseInt(_xlEvents[i].memberCount);
              this.events.push({..._xlEvents[i], memberIds: []});
              if (_xlEvents[i].memberCount > this.eventTable.maxCount) this.eventTable.maxCount = _xlEvents[i].memberCount;
            }
          };
          _reader.readAsBinaryString(e.target.files[0]);
        }
      },
      /* Other UI Event*/
      doBack() {
        this.$router.go(-1);
      },
      doShift() {
        for (let id in this.membersIndex) this.membersIndex[id].count = 0;
        for (let i = 0; i < this.events.length; i++) {
          this.events[i].memberIds = [];
          let _members = _.chain(this.members).shuffle().orderBy(['count'], ['asc']).value();
          for (let j = 0; j < this.events[i].memberCount && j < _members.length; j++) {
            this.membersIndex[_members[j].id].count++;
            this.events[i].memberIds.push(_members[j].id);
          }
        }
      },
      doExport() {
        let _wb = new Workbook();
        let _wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' };
        let _ws;
        let _data = [];
        let _colMap = [
          { key: '_INDEX_', name: '#', cols: { wch: 5 } },
          { key: 'name', name: '活動名稱', cols: { wch: 20 } },
          { key: 'memberCount', name: '需求人數', cols: { wch: 10 } },
          ..._.map(new Array(this.eventTable.maxCount), (m, i) => ({
            key: '', name: `人員${i + 1}`, cols: { wch: 25 }
          }))
        ];

        let _titles = _.map(_colMap, c => c.name);
        let _keys = [...(_.map(_colMap, c => c.key)), '_MEMBER_'];

        _data.push(_titles);
        for (let i = 0; i < this.events.length; i++) {
          let _ary = [];
          for (let j = 0; j < _keys.length; j++) {
            switch (_keys[j]){
              case '': break;
              case '_INDEX_':
                _ary.push(i + 1);
                break;
              case '_MEMBER_':
                for (let k = 0; k < this.events[i].memberIds.length; k++) {
                  let _mid = this.events[i].memberIds[k];
                  _ary.push(`${this.membersIndex[_mid].name} (${this.membersIndex[_mid].count})\r\n${this.membersIndex[_mid].id}`);
                }
                break;
              default:
                _ary.push(this.events[i][_keys[j]]);
                break;
            }
          }
          _data.push(_ary);
        }
        _ws = XLSX.utils.aoa_to_sheet(_data);
        _ws['!cols'] = _.map(_colMap, c => c.cols);
        _ws['!rows'] = _.map(new Array(this.events.length + 1), i => ({ hpx: 35 }));
        _wb.SheetNames.push('Sheet1');
        _wb.Sheets['Sheet1'] = _ws;
        let _wbout = XLSX.write(_wb, _wopts);
        saveAs(
          new Blob([s2ab(_wbout)], { type:"application/octet-stream" }),
          `${this.projectForm.name}_${moment().format('YYMMDDHHmmss')}.xlsx`
        );
      },
    },
    computed: {
      canDoShift() {
        return this.members.length >= _.reduce(this.events, (e, sum) => sum + e.memberCount, 0);
      },
      canDoExport() {
        return false;
      },
      calcTableWidth() {
        // return this.eventTable.maxCount > 3 ? this.eventTable.maxCount * 270 : 'initial';
      }
    },
    filters: {
      computeEventMembersLen(memberIds) {
        return _.filter(memberIds, mid => mid).length;
      }
    }
  }
</script>
