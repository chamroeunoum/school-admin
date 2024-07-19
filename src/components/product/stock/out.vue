<template>
  <!-- Form edit account -->
  <div class="vcb-pop-create font-ktr">
      <n-modal v-model:show="show" :on-after-leave="onClose" transform-origin="center">
        <n-card class="w-1/2 font-pvh text-xl" title="ដាក់ផលិតផលចូលឃ្លាំង" :bordered="false" size="small">
          <template #header-extra>
            <!-- <n-button type="success" @click="create()" >
              <template #icon>
                <n-icon>
                  <Save20Regular />
                </n-icon>
              </template>
              រក្សារទុក
            </n-button> -->
          </template>
          <!-- Form edit account -->
          <div class="crud-create-form w-full border-t">
            <div class=" mx-auto p-4 flex-wrap">
              <div class="crud-form-panel w-full flex flex-wrap ">
                <div class=" p-4" >ឈ្មោះផលិតផល ៖ {{ record.product !== null ? record.product.description + " - " + record.product.origin : ''  }}</div>
                <div class="vcb-stock-units-panel p-2 w-full grid grid-flow-col grid-cols-9" >
                  <div class="stock-unit-unit col-span-3 m-2">
                    <n-select v-model:value="shop" :options="shopOptions" placeholder="ហាង" filterable />
                  </div>
                  <div class="stock-unit-quantity col-span-3 m-2">
                    <n-input-number :min="1" :max="1000000" v-model:value="quantity" clearable placeholder="បរិមាណដកចេញ" @keyup="handleQuantityKeyup" />
                  </div>
                  <div class="stock-unit-unit col-span-3 m-2">
                    <n-select v-model:value="unit_id" :options="unitOptions" placeholder="ឯកតា" filterable />
                  </div>
                  <div class="stock-unit-unit col-span-3 m-2">
                    <n-button type="success" @click="create()" >
                      <template #icon>
                        <n-icon>
                          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M504 256C504 119 393 8 256 8S8 119 8 256s111 248 248 248s248-111 248-248zm-448 0c0-110.5 89.5-200 200-200s200 89.5 200 200s-89.5 200-200 200S56 366.5 56 256zm72 20v-40c0-6.6 5.4-12 12-12h116v-67c0-10.7 12.9-16 20.5-8.5l99 99c4.7 4.7 4.7 12.3 0 17l-99 99c-7.6 7.6-20.5 2.2-20.5-8.5v-67H140c-6.6 0-12-5.4-12-12z" fill="currentColor"></path></svg>
                        </n-icon>
                      </template>
                    </n-button>
                  </div>
                </div>
                <div class="vcb-stock-units-panel m-4 border-gray-200 border p-4 w-full " >
                  <div class="stock-unit-item grid grid-flow-col grid-cols-9 border-b border-gray-200">
                    <div class="stock-unit-sku col-span-3 m-2">SKU</div>
                    <div class="stock-unit-quantity col-span-2 m-2">បរិមាណ</div>
                    <div class="stock-unit-unit col-span-2 m-2">ឯកតា</div>
                    <div class="stock-unit-unit-price col-span-2 m-2">តម្លៃឯកតា</div>
                  </div>
                  <div v-for="(stockUnit,index) in stockUnits" class="stock-unit-item grid grid-flow-col grid-cols-9">
                    <div class="stock-unit-sku col-span-3 m-2">{{  stockUnit.sku }}</div>
                    <div class="stock-unit-quantity col-span-2 m-2">{{  stockUnit.quantity }}</div>
                    <div class="stock-unit-unit col-span-2 m-2">{{  stockUnit.unit.name }}</div>
                    <div class="stock-unit-unit-price col-span-2 m-2">{{ stockUnit.unit_price == null ? 0.0 : (stockUnit.unit_price).toFixed(2) + " $" }}</div>
                  </div>
                </div>
                <div class="w-1/2 h-8"></div>  
              </div>
            </div>
          </div>
          <!-- End form edit account -->
          <template #footer></template>
        </n-card>
      </n-modal>
    </div>
    <!-- End of edit account -->
</template>
<script>
import { reactive, ref , computed } from 'vue'
import { useStore } from 'vuex'
import { useMessage, useNotification } from 'naive-ui'
import { Save20Regular } from '@vicons/fluent'
import dateFormat, { masks } from "dateformat"

export default {
  components: {
    Save20Regular
  },
  props: {
    model: {
      type: Object ,
      required: true ,
      default: () => {
        return reactive({
          name: 'Undefined' ,
          title: 'No title'
        })
      },
      // validator: (val) => {}
    } , 
    record: {
      type: Object ,
      required: false ,
      default: () => {
        return reactive({
          id: 0 ,
          product_id: 0 ,
          unit_id: 0 ,
          attribute_variant_id : 0 ,
          quantity : 0 ,
          product : null
        })
      },
      // validator: (val) => {
      //   for(var field in ['id','username','firstname','lastname','email','phone','password','active'] ){
      //     if( !val.hasOwnProperty(field) ) return false
      //   }
      //   return true 
      // }
    },
    show: {
      type: Boolean ,
      default: false
    },
    onClose: {
      type: Function
    } ,
    // onShow: {
    //   type: Function
    // }
  },
  setup(props){
    const store = useStore()
    const message = useMessage()
    const notify = useNotification()
    const quantity = ref(null)
    const unit_id = ref(null)
    const unit_price = ref(null)
    const stockUnits = ref([])
    
    /**
     * Variables
     */    
    const rules = {
        quantity: {
          required: true,
          message: 'សូមបញ្ចូលបរិមាណផលិតផល',
          trigger: [ 'blur']
        }
    }
    /**
     * Functions
     */
    function clearRecord(){
      quantity.value = null
      unit_price.value = null
      unit_id.value = null
    }

    function create(){
      if( unit_id.value <= 0 ){
        notify.warning({
          'title' : 'ពិនិត្យព័ត៌មាន' ,
          'description' : 'សូមជ្រើសរើសឯកតារបស់ផលិតផល។' ,
          duration : 3000
        })
        return false
      }
      if( quantity.value <= 0 ){
        notify.warning({
          'title' : 'ពិនិត្យព័ត៌មាន' ,
          'description' : 'បរិមាណផលិតផលយ៉ាងហោច 1 ។' ,
          duration : 3000
        })
        return false
      }
      if( shop.value <= 0 ){
        notify.warning({
          'title' : 'ពិនិត្យព័ត៌មាន' ,
          'description' : 'សូមជ្រើសរើសហាង។' ,
          duration : 3000
        })
        return false
      }
      if( props.model === undefined || props.model.name == "" ){
        notify.warning({
          'title' : 'ពិនិត្យព័ត៌មាន' ,
          'description' : 'ទម្រង់នៃព័ត៌មានមិនទាន់បានកំណត់។' ,
          duration : 3000
        })
        return false
      }
      store.dispatch( props.model.name+'/out',{
        stock_id: props.record.id ,
        unit_id : unit_id.value ,
        unit_price : unit_price.value == null ? 0 : unit_price.value ,
        quantity: quantity.value ,
        store_id : shop.value
      }).then( res => {
        switch( res.status ){
          case 200 : 
            notify.success({
              'title' : 'រក្សារទុកព័ត៌មាន' ,
              'description' : res.data.message ,
              duration : 3000
            })
            clearRecord()
            props.onClose()
          break;
        }
        getStockUnits()
        getUnits()
      }).catch( err => {
        console.log( err )
        notify.error({
          'title' : 'រក្សារទុកព័ត៌មាន' ,
          'description' : 'មានបញ្ហាក្នុងពេលរក្សារទុកព័ត៌មាន។' ,
          duration : 3000
        })
      })
    }
    
    function handleQuantityKeyup(e){
      if( e.keyCode == 13 ){
        create()
      }
    }

    const unitOptions = computed( () => {
      return stockUnits.value.length > 0 ? stockUnits.value.map( p => { return {label: p.unit.name , value: p.id } }) : []
    })

    function getStockUnits(){
      store.dispatch('stock/stockUnits',{
        search: '' ,
        perPage: 100 ,
        page: 1
      }).then( res => {
        switch( res.status ){
          case 200 : 
            stockUnits.value = res.data.records
            console.log( stockUnits.value )
          break;
        }
      }).catch( err => {
        console.log( err )
        notify.error({
          'title' : 'រក្សារទុកព័ត៌មាន' ,
          'description' : err.response.data.message ,
          duration : 3000
        })
      })
    }

    /**
     * Get stores
     */
    const shop = ref(null)
    const shops = ref([])
    const shopOptions = computed( () => {
      return shops.value.length > 0 ? shops.value.map( s => { return {label: s.id + ". " +s.name , value: s.id } }) : []
    })
    function getShops(){
      store.dispatch('store/compact',{
        search: "" ,
        perPage: 20 ,
        page: 1
      }).then(res => {
        shops.value = res.data.records
      }).catch( err => {
        console.log( err )
      })
    }

    getStockUnits()
    getShops()

    return {
      /**
       * Variables
       */
      rules ,
      quantity ,
      stockUnits ,
      shops ,
      shop ,
      shopOptions ,
      /**
       * About unit
       */
      unit_id ,
      unitOptions ,
      unit_price ,
      /**
       * Functions
       */
      create ,
      handleQuantityKeyup
    }
  }
}
</script>