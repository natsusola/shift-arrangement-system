## 簡易排班系統

### 描述
* 簡單的排班系統。

### 使用說明
* 因為使用 Pouchdb，所以資料是存在本機，如需跨電腦使用請使用匯出、匯入資料功能，匯入時會覆蓋舊有資料
* 成員 ID 可以為任何不重複資訊，不限定電話、email
* 隨機排班為隨機平均分配

### Demo
* #### [Live Demo](http://shift-sys.natsusola.net/)

### 開發

##### 安裝
* `git clone`
* `npm install`

##### 開發
* `npm run dev:elec`: electron 版開發模式
* `npm run dev:web`: web 版開發模式
* `npm run dev`: electron, web 開發模式

##### 打包
* `npm run pro:main`: 編譯 electron 端 js
* `npm run pro:renderer`: 編譯 renderer 端 js
* `npm run pro:web`: 編譯 web 端 js
* `npm run pro`: 編譯上述
* `npm run bulid`: 打包 electron 程式:

### 參考
* [electron-quick-start](https://github.com/electron/electron-quick-start)
* [electron-vue](https://github.com/SimulatedGREG/electron-vue)
