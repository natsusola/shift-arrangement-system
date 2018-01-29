<template>
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
    <form class="member-form m-b-px-0" name="membersForm" @submit.prevent="doAddMember">
      <div class="form-group row m-b-px-0">
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
          ref="memberFileInput"
          @change="onUploadMemberExcelFile($event)"/>
      </div>
    </div>
  </div>
</template>

<script>
  import XLSX from 'xlsx';

  export default {
    data() {
      return {
        memberForm: {
          name: '',
          id: ''
        },
      }
    },
    props: ['members', 'membersIndex'],
    methods: {
      doAddMember() {
        if (this.membersIndex[this.memberForm.id]) {
          this.$emit('doShowModal', '[錯誤] ID 重複!');
          return;
        }
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
            this.$refs.memberFileInput.value = '';
            let _wb = XLSX.read(_data, { type: 'binary' });
            /* 檢查格式 */
            let _requiredKeys = { A1: 'name', B1: 'id' };
            for (let key in _requiredKeys) {
              if (_wb.Sheets[_wb.SheetNames[0]][key].v !== _requiredKeys[key]) {
                this.$emit('doShowModal', '[錯誤] EXCEL 格式錯誤!');
                return;
              }
            }
            let _xlMembers = XLSX.utils.sheet_to_json(_wb.Sheets[_wb.SheetNames[0]]);

            /* 驗證 id 沒有重複 */
            let _validObj = {};
            for (let i = 0; i < _xlMembers.length; i++) {
              if (_validObj[_xlMembers[i].id] || this.membersIndex[_xlMembers[i].id]) {
                this.$emit('doShowModal', '[錯誤] ID 重複!');
                return;
              }
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
    }
  }

</script>
