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

        <member-col
          :members.sync="members"
          :membersIndex.sync="membersIndex">
        </member-col>

        <event-col
          :events.sync="events"
          :members.sync="members"
          :membersIndex.sync="membersIndex">
        </event-col>
      </div>
    </div>
    <div class="detail-footer">
      <button class="btn btn-primary m-r-px-20" @click="doSave">存檔</button>
      <button class="btn btn-secondary" @click="doBack">返回</button>
    </div>
  </div>
</template>

<script>
  import XLSX from 'xlsx';
  import moment from 'moment';
  import { saveAs } from 'file-saver';
  import MyDB from '@/db';
  import { MemberCol, EventCol } from './components';

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
    components: {
      'member-col': MemberCol,
      'event-col': EventCol
    },
    data() {
      return {
        projectForm: {
          name: '',
          desc: '',
        },
        members: [],
        membersIndex: {},
        events: [],
      };
    },
    methods: {
      doBack() {
        this.$router.push('/');
      },
      doSave() {
        let _data = {
          name: this.projectForm.name,
          desc: this.projectForm.desc,
          members: this.members,
        };

        MyDB.post(_data)
          .then(res => {
            this.$router.push('/');
            console.log(res);
          })
          .catch(err => {
            console.log(res);
          });
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
    },
  }
</script>
