<template>
  <div>
  <!-- Top action panel of crud -->
    <div class="flex title-bar border-b border-gray-200">
      <!-- Title of crud -->
      <div class="flex w-64 h-10 py-1 title " >
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M448 448V240"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M64 240v208"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M382.47 48H129.53c-21.79 0-41.47 12-49.93 30.46L36.3 173c-14.58 31.81 9.63 67.85 47.19 69h2c31.4 0 56.85-25.18 56.85-52.23c0 27 25.46 52.23 56.86 52.23s56.8-23.38 56.8-52.23c0 27 25.45 52.23 56.85 52.23s56.86-23.38 56.86-52.23c0 28.85 25.45 52.23 56.85 52.23h1.95c37.56-1.17 61.77-37.21 47.19-69l-43.3-94.54C423.94 60 404.26 48 382.47 48z"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M32 464h448"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M136 288h80a24 24 0 0 1 24 24v88h0h-128h0v-88a24 24 0 0 1 24-24z"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M288 464V312a24 24 0 0 1 24-24h64a24 24 0 0 1 24 24v152"></path></svg>
        <div class="font-muol ml-2 leading-9" v-html="model.title" ></div>
      </div>
      <!-- Actions button of the crud -->
      <div class="flex-grow action-buttons flex-row-reverse flex">
        <!-- New Button -->
        <div class="mt-1 ml-2">
          <n-button type="success" @click="showCreateModal()" >
            <template #icon>
              <n-icon>
                <Add20Regular />
              </n-icon>
            </template>
            បន្ថែម
          </n-button>
        </div>
        <div class="w-2/5 relative" >
          <input type="text" @keypress.enter="filterRecords(false)" v-model="table.search" class="bg-gray-100 px-2 h-9 my-1 w-full rounded border border-gray-200 focus:border-blue-600 hover:border-blue-600 " placeholder="ស្វែងរក" />
          <Icon size="27" class="absolute right-1 top-2 text-gray-400 hover:text-blue-700 cursor-pointer" @click="filterRecords(false)" >
            <n-icon>
              <Search20Regular />
            </n-icon>
          </Icon>
        </div>
        
      </div>
      <!-- Filter panel of crud -->
      <div class="filters-bar"></div>
    </div>
    <!-- Table of crud -->
    <div class="vcb-table-panel relative flex items-start flex-wrap ">
        <div v-for="(record, index) in table.records.matched" :key='index' class="relative p-2 m-2 border border-gray-300 shadow rounded w-1/5 pb-10" >
          <div  class="my-2" >
            <img :src="record.images.length?record.images[0]:'/src/assets/wephone.png'" class="w-full" @click="showFeaturePictureModal(record)" />
          </div>
          <div class="my-4 font-bold" >{{ record.upc }}</div>
          <div class="my-2 text-left" >
            Name : <n-input class="inline-input" type="textarea" v-model:value="record.name" @blur="inlineUpdate(record)" ></n-input>
          </div>
          <div  class="my-2 text-left" >
            Location : <n-input class="inline-input" type="text" v-model:value="record.location_name" placeholder="VENDOR UPC" @blur="inlineUpdate(record)" ></n-input>
          </div>
          <div  class="my-2 text-left" >
            Address : <n-input class="inline-input" type="text" v-model:value="record.address" placeholder="VENDOR SKU" @blur="inlineUpdate(record)" ></n-input>
          </div>
          <div  class="my-2 text-left" >
            Phone : <n-input class="inline-input" type="text" v-model:value="record.phone" @blur="inlineUpdate(record)" ></n-input>
          </div>
          <n-icon size="22" class="cursor-pointer text-red-500 left-2 bottom-2 absolute " @click="deleteRecord(record)" title="លុបចោល" >
            <TrashOutline />
          </n-icon>
          <n-icon size="22" class="cursor-pointer text-gray-700 right-2 bottom-2 absolute " @click="showUploadPictureModal(record)" title="បញ្ចូលរូបភាព" >
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5c0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4c0-2.05 1.53-3.76 3.56-3.97l1.07-.11l.5-.95A5.469 5.469 0 0 1 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5l1.53.11A2.98 2.98 0 0 1 22 15c0 1.65-1.35 3-3 3zM8 13h2.55v3h2.9v-3H16l-4-4z" fill="currentColor"></path></svg>
          </n-icon>
        </div>
      <!-- Loading -->
      <div v-if="table.loading" class="table-loading absolute left-0 top-0 right-0 bottom-0 bg-white bg-opacity-75 ">
        <div class="spinner mt-24">
          <Icon size="40" class="animate-spin  text-blue-500" >
           <IosRefresh />
          </Icon><br/><br/>
          កំពុងអាន...
        </div>
        <div class="absolute top-3 right-3 " @click="closeTableLoading" >
          <Icon size="40" class="text-red-600" >
           <CloseCircleOutline />
          </Icon>
        </div>
      </div>
    </div>
    <!-- Pagination of crud -->
    <div class="vcb-table-pagination">
      <!-- First -->
      <!-- Previous -->
      <div class="vcb-pagination-page" v-html='"<"' @click="previous()" ></div>
      <!-- Pages (7) -->
      <div v-for='item in table.pagination.totalPages' :key='item' class="vcb-pagination-page" @click="goTo(item)" >{{ item }}</div>
      <!-- Next -->
      <div class="vcb-pagination-page" v-html='">"' @click="next()" ></div>
      <!-- Last -->
      <!-- Go to -->
      <!-- Total per page -->
    </div>
    <!-- Form create account -->
    <create-form v-bind:model="model" v-bind:show="createModal.show" :onClose="closeCreateModal" />
    <!-- Form update account -->
    <feature-picture-form v-bind:model="model" v-bind:show="featurePictureModal.show" :onClose="closeFeaturePictureModal" :record="selectedRecord" />
    <!-- Form upload picture -->
    <upload-picture-form v-bind:model="model" v-bind:show="uploadPictureModal.show" :onClose="closeUploadPictureModal" :record="selectedRecord" />
  </div>
</template>
<script>
import { reactive, ref , computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import QrcodeVue from 'qrcode.vue'
import Vue3Barcode from 'vue3-barcode'
import { Switcher } from '@vicons/carbon'
import { Icon } from '@vicons/utils'
import { IosCheckmarkCircleOutline, IosRefresh } from '@vicons/ionicons4'
import { TrashOutline, CloseCircleOutline } from '@vicons/ionicons5'
import { useDialog, useMessage, useNotification } from 'naive-ui'
import { Edit20Regular, Key16Regular, Save20Regular, Add20Regular, Search20Regular , ContactCard28Regular } from '@vicons/fluent'
/**
 * CRUD component form
 */
import CreateForm from './create.vue'
import UpdateForm from './update.vue'
import FeaturePictureForm from './featurepicture.vue'
import UploadPictureForm from './upload.vue'
export default {
  name: "User" ,
  components: {
    QrcodeVue ,
    Vue3Barcode,
    Switcher,
    Add20Regular ,
    Icon,
    IosCheckmarkCircleOutline,
    IosRefresh ,
    CloseCircleOutline ,
    Search20Regular ,
    Edit20Regular,
    Key16Regular,
    Save20Regular ,
    TrashOutline ,
    ContactCard28Regular ,
    // Form
    CreateForm,
    UpdateForm ,
    FeaturePictureForm ,
    UploadPictureForm
  },
  setup(){
    var store = useStore()
    const dialog = useDialog()
    const message = useMessage()
    const notify = useNotification()
    const selectedRecord = ref({})
    /**
     * Variables
     */    
    var model = reactive( {
      name: "store" ,
      title: "ហាង" 
    })
    var table = reactive( {
      loading: false ,
      search: '' ,
      records: {
        all: [] ,
        matched: []
      },
      columns: {
        searchable: {
          code: '' ,
          start_date: '' ,
        },
        format: {
          id: 0 ,
          name: '' ,
          location_name: '' ,
          lat_long: '' ,
          address: '' ,
          images : [] ,
          phone: ''
        }
      } ,
      pagination: {
        perPage: 20 ,
        page: 1 ,
        totalPages: 0 ,
        totalRecords: 0
      }
    })

    function filterRecords(helper=true){
      if( helper ){
        table.records.matched = []
        if( table.search != "" ) {
          for(var index in table.records.all ){
            for(var field in table.records.all[index] ){
              if( (""+table.records.all[index][field]).includes( table.search ) !== false ) {
                table.records.matched.push( table.records.all[index] )
                break;
              }
            }
          }
        }
        if( table.records.matched.length <= 0 ) {
          table.records.matched = table.records.all
        }
      }else{
        setTimeout( goTo(1) , 500 )
      }
    }

    /**
     * Functions
     */
    function getRecords(){
      /**
       * Clear time interval after calling
       */
      window.clearTimeout()
      table.loading = true
      store.dispatch(model.name+'/list',{
        search: table.search ,
        perPage: table.pagination.perPage ,
        page: table.pagination.page
      }).then(res => {
        table.records.all = table.records.matched = res.data.records
        table.pagination = res.data.pagination
        closeTableLoading()
      }).catch( err => {
        console.log( err )
      })
    }

    function closeTableLoading(){
      table.loading = false
    }
    /**
     * Pagination functions
     */
    function previous(){
      goTo( table.pagination.page <= 1 ? 1 : table.pagination.page - 1 )
    }
    function next(){
      goTo( table.pagination.page >= table.pagination.totalPages ? table.pagination.totalPages : table.pagination.page + 1 )
    }
    function goTo(page){
      table.pagination.page = page > table.pagination.totalPages ? table.pagination.totalPages : ( page < 1 ? 1 : page)
      getRecords()
    }
    function updatePerpage(perPage){
      table.pagination.perPage = perPage < 5 ? 5 : ( perPage > 100 ? 100 : perPgae )
      table.pagination.page = 1
      getRecords()
    }

    /**
     * Create modal handling
     */
    var createModal = reactive({show:false})
    function showCreateModal(){
      createModal.show = true
    }

    function closeCreateModal(){
      createModal.show = false
      getRecords()
    }

    var editModal = reactive({show:false})
    var editRecord = reactive({
      id: 0 ,
      name: '' ,
      location_name: '' ,
      lat_long: '' ,
      address: '' ,
      images : [] ,
      phone: ''
    })
    function showEditModal(record){
      console.log( record )
      editRecord.id = record.id
      editModal.show = true
    }
    function closeEditModal(record){
      editModal.show = false
      getRecords()
    }

    function deleteRecord(record){
      dialog.warning({
        title: "លុបគណនី" ,
        content: "តើអ្នកចង់ លុប មែនទេ ?" ,
        positiveText: 'បាទ / ចាស',
        negativeText: 'ទេ',
        onPositiveClick: () => {
          store.dispatch(model.name+'/delete',{id:record.id}).then( res => {
            if( res.data.ok ){
              notify.success({
                title: 'លុបទិន្នន័យ' ,
                description: 'លុបបានរួចរាល់។' ,
                duration: 3000
              })
            }else{
              notify.success({
                title: 'លុបទិន្នន័យ' ,
                description: 'មានបញ្ហាក្នុងពេលលុបទិន្នន័យ។' ,
                duration: 3000
              })
            }
            getRecords()
        }).catch( err => {
          message.error( err )
        })
        },
        onNegativeClick: () => {
        }
      })
    }

    /**
     * Update - inline update
     */
    function inlineUpdate(record){
      store.dispatch( model.name+'/update',{
        id : record.id ,
        name: record.name ,
        location_name: record.location_name ,
        lat_long: record.lat_long ,
        address: record.address ,
        phone: record.phone
      }).then( res => {
        if( res.data.ok ){
          // notify.success({
          //   title: 'រក្សារទុកព័ត៌មាន' ,
          //   content: '' ,
          //   description: res.data.message ,
          //   duration: 2000
          // })
        }else{
          notify.error({
            title: 'រក្សារទុកព័ត៌មាន' ,
            content: '' ,
            description: 'មានបញ្ហាក្នុងពេលរក្សារទុកព័ត៌មាន។' ,
            duration: 2000
          })
        }
      }).catch( err => {
        message.error( err )
      })
    }

    /**
     * Create modal handling
     */
     var featurePictureModal = reactive({show:false})
    function showFeaturePictureModal(record){
      selectedRecord.value = record
      featurePictureModal.show = true
    }

    function closeFeaturePictureModal(){
      featurePictureModal.show = false
      getRecords()
    }

    var uploadPictureModal = reactive({show:false})
    function showUploadPictureModal(record){
      console.log( record)
      selectedRecord.value = record
      uploadPictureModal.show = true
    }

    function closeUploadPictureModal(){
      uploadPictureModal.show = false
      getRecords()
    }

    /**
     * Initial the data
     */
    getRecords()


    return {
      /**
       * Variables
       */
      model ,
      table ,
      selectedRecord ,
      /**
       * Table
       */
      filterRecords ,
      /**
       * Pagination functions
       */
      updatePerpage ,
      goTo ,
      previous ,
      next ,
      /**
       * Loading overlay
       */
      closeTableLoading ,
      /**
       * Creating
       */
      createModal ,
      showCreateModal ,
      closeCreateModal ,     
      /**
       * Upload
       */
      uploadPictureModal ,
      showUploadPictureModal ,
      closeUploadPictureModal ,     
      /**
       * Editing
       */
      editModal ,
      showEditModal ,
      closeEditModal , 
      editRecord ,
      /**
       * Creating
       */
      featurePictureModal ,
      showFeaturePictureModal ,
      closeFeaturePictureModal ,     
      /**
       * Functions
       */
      deleteRecord ,
      inlineUpdate
    }
  }
}

</script>

<style scoped>
  .vcb-table-panel {
    @apply absolute right-4 left-4 mt-4 mb-16 top-12 bottom-0 overflow-auto;
  }
  .vcb-table {
    @apply w-full ;
  }
  .vcb-table tr.vcb-table-row {
    @apply border-b border-gray-100 text-left ;
  }
  .vcb-table tr.vcb-table-row td {
    @apply p-2;
  }
  .vcb-table-actions-panel {
    @apply flex flex-row-reverse ;
  }
  .vcb-table-actions-panel .vcb-action-button {
    @apply  rounded-full border border-gray-200 w-8 h-8 mx-2 text-center cursor-pointer hover:border-blue-500 hover:text-blue-500  duration-300;
  }
  .vcb-table-headers {
    @apply border-b border-gray-200;
  }
  .vcb-table-headers .vcb-table-header {
    @apply px-2 py-4 text-left ;
  }
  .vcb-table-pagination {
    @apply flex flex-row absolute bg-white right-0 bottom-0 border border-l p-3 ;
  }
  .vcb-pagination-page {
    @apply  rounded-full border border-gray-200 mx-1 leading-7 w-8 h-8 font-bold cursor-pointer hover:text-blue-500 hover:border-blue-500 duration-300;
  }
  .vcb-table-cell .inline-input {
    @apply border-none;
  }
</style>