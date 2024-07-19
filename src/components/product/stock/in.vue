<template>
  <!-- Form edit account -->
    <div class="vcb-pop-create font-ktr">
      <n-modal v-model:show="show" :on-after-leave="onClose" :on-after-enter="initial()" transform-origin="center">
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
                    <n-input-number :min="1" :max="1000000" v-model:value="unit_price" clearable placeholder="តម្លៃឯកតារបស់ផលិតផល" />
                  </div>
                  <div class="stock-unit-quantity col-span-3 m-2">
                    <n-input-number :min="1" :max="1000000" v-model:value="quantity" clearable placeholder="បញ្ចូលបរិមាណផលិតផលបន្ថែម" @keyup="handleQuantityKeyup" />
                  </div>
                  <div class="stock-unit-unit col-span-3 m-2">
                    <n-select v-model:value="unit_id" :options="unitOptions" placeholder="ឯកតា" filterable />
                  </div>
                  <div class="stock-unit-unit col-span-3 m-2">
                    <n-button type="success" @click="create()" >
                      <template #icon>
                        <n-icon>
                          <Save20Regular />
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
                    <div class="stock-unit-unit-price col-span-2 m-2">{{ (stockUnit.unit_price).toFixed(2) + " $" }}</div>
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
          product : null,
          unit_price : 0
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
      if( props.model === undefined || props.model.name == "" ){
        notify.warning({
          'title' : 'ពិនិត្យព័ត៌មាន' ,
          'description' : 'ទម្រង់នៃព័ត៌មានមិនទាន់បានកំណត់។' ,
          duration : 3000
        })
        return false
      }
      store.dispatch( props.model.name+'/in',{
        stock_id: props.record.id ,
        unit_id : unit_id.value ,
        unit_price : unit_price.value ,
        quantity: quantity.value ,
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

    const units = ref([])
    const unitOptions = computed( () => {
      return units.value.length > 0 ? units.value.map( p => { return {label: p.id + ". " +p.name , value: p.id } }) : []
    })

    function getUnits(){
      store.dispatch('unit/compact',{}).then( res => {
        switch( res.status ){
          case 200 : 
            units.value = res.data.records
            console.log( units.value )
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

    function getStockUnits(){
      console.log( props.record )
      store.dispatch('stock/stockUnits',{
        search: '' ,
        perPage: 100 ,
        page: 1 , 
        stock_id : props.record.id ,
        store_id : props.record.store_id
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

    function initial(){
      getUnits()
      getStockUnits()
    }

    return {
      /**
       * Variables
       */
      rules ,
      quantity ,
      stockUnits ,
      /**
       * About unit
       */
      unit_id ,
      units ,
      unitOptions ,
      unit_price ,
      /**
       * Functions
       */
      create ,
      handleQuantityKeyup ,
      initial
    }
  }
}
</script>