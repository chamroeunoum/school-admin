<template>
  <!-- Form edit account -->
    <div class="vcb-pop-create font-ktr">
      <n-modal v-model:show="show" :on-after-leave="onClose" transform-origin="center" :on-after-enter="initialData" >
        <n-card class="w-1/2 font-pvh text-xl" title="ការបំលែងឯកតានៃផលិតផល" :bordered="false" size="small">
          <template #header-extra>
            <svg class="w-10 h-10 text-red-500 cursor-pointer" @click="closeRecord()" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192s192-86 192-192z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M320 320L192 192"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 320l128-128"></path></svg>
          </template>
          <!-- Form edit account -->
          <div class="crud-create-form w-full border-t">
            <div class=" mx-auto p-4 flex-wrap">
              <div class="crud-form-panel w-full flex flex-wrap ">
                <n-form 
                  class="w-full text-left font-btb text-lg flex flex-wrap" 
                  :label-width="80"
                  :model="record"
                  size="large"
                  ref="formRef"
                >
                  <!-- <div class="mb-4 w-full text-sm" >{{ stock.product !== null ? "ឈ្មោះផលិតផល ៖ " + stock.product.description : "" }}</div>
                  <div class="mb-4 w-full text-sm" >{{ stock.product !== null ? "ប្រភព ៖ " + stock.product.origin : ''  }}</div>
                  <div class="mb-4 w-full text-sm" >{{ stock.stockUnit !== null ? "ចំនួនសរុប ៖ " + stock.stockUnit.quantity + " " + stock.stockUnit.unit.name : ''  }}</div> -->
                  <n-form-item :label="( stock.stockUnits !== null ? ' 1 ' + stock.stockUnits[0].unit.name + ' ស្មើរនឹង ៖' : '' )" class="w-1/2" >
                    <n-input-number :min="1" :max="1000000" v-model:value="record.gaps" clearable placeholder="ចំនួនគម្លាតខុសគ្នា" @keyup="handleGapsKeyup"/>
                    <n-select v-model:value="record.unit_id" :options="unitOptions" placeholder="ឯកតា" filterable />
                    <n-button type="success" @click="create(stock.stockUnits[0].unit.id)" >
                      <template #icon>
                        <n-icon>
                          <Save20Regular />
                        </n-icon>
                      </template>
                    </n-button>
                  </n-form-item>
                </n-form>
                <div class="w-full mb-8">
                  <div class="border-b border-gray-100 w-full" >ព័ត៌មានអំពី បម្លែងឯកសារ ៖ </div>
                  <div v-for="(unitConvention,index) in unitConventions" :key="index" class="grid grid-flow-col grid-cols-9 my-4" >
                    <div class="col-span-1" >{{  ( index + 1 ) + ". "  }}</div>
                    <div class="col-span-3" >{{ ( unitConvention.pid > 0 ? -1 * unitConvention.gaps : "1" ) + " " + unitConvention.fromUnit.name }}</div>
                    <div class="col-span-2 relative" >
                      <n-input-number :min="1" :max="1000000" v-model:value="quantity[index]" clearable @keyup="handleGapsKeyup" :placeholder="unitConvention.pid > 0 ? 'តម្លៃឯកតាធំត្រូវបង្កើត' : 'តម្លៃឯកតាធំត្រូវបំបែក'" />
                    </div>
                    <div class="col-span-1 relative" >
                      <svg @click="unitConvention.pid > 0 ? buildupUnit(stock.id,unitConvention.id,quantity[index]) : breakdownUnit(stock.id,unitConvention.id,quantity[index])" class="w-7 mx-auto cursor-pointer hover:text-blue-500 duration-500 absolute right-0 top-0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12s4.48 10 10 10s10-4.48 10-10zM4 12c0-4.42 3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8s-8-3.58-8-8zm12 0l-4 4l-1.41-1.41L12.17 13H8v-2h4.17l-1.59-1.59L12 8l4 4z" fill="currentColor"></path></svg>
                    </div>
                    <div class="col-span-2 text-right" >{{ unitConvention.pid > 0 ? "ស្មើរ 1 " + unitConvention.toUnit.name : "មាន " + unitConvention.gaps + " " + unitConvention.toUnit.name }}</div>
                    <div class="col-span-3 hidden" >
                      <svg class="w-6 h-6 float-right text-red-500 cursor-pointer" @click="removeUnitConvention(unitConvention)" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></path><path stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M80 112h352" fill="currentColor"></path><path d="M192 112V72h0a23.93 23.93 0 0 1 24-24h80a23.93 23.93 0 0 1 24 24h0v40" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 176v224"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M184 176l8 224"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M328 176l-8 224"></path></svg>
                    </div>
                  </div>
                </div>  
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
    stock: {
      type: Object ,
      required: false ,
      default: () => {
        return reactive({
          id: 0 ,
          product_id: 0 ,
          attribute_variant_id: 0 ,
          quantity : 0 ,
          unit_id : 0
        })
      }
    },
    record: {
      type: Object ,
      required: false ,
      default: () => {
        return reactive({
          id: 0 ,
          stock_id: 0 ,
          unit_id : null ,
          gaps : 0 
        })
      }
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
    const quantity = ref([])
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
     function closeRecord(){
        props.record.id = 0 
        props.record.stock_id = 0
        props.record.unit_id = 0 
        props.record.gaps = 0 
        props.show = false
        props.onClose()
     }


    function create(to_unit_id){
      if( props.record.gaps <= 0 ){
        notify.warning({
          'title' : 'ពិនិត្យព័ត៌មាន' ,
          'description' : 'សូមបំពេញព័ត៌មានអំពី ចំនួនគម្លាតរបស់ឯកតា។' ,
          duration : 3000
        })
        return false
      }
      if( props.record.sunit_id <= 0 ){
        notify.warning({
          'title' : 'ពិនិត្យព័ត៌មាន' ,
          'description' : 'សូមបំពេញព័ត៌មានអំពី ឯកតាតូច។' ,
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
      store.dispatch( 'unitconvention/create',{
        stock_id: props.stock.id ,
        to_stock_unit_id : props.record.unit_id ,
        from_stock_unit_id : to_unit_id ,
        gaps: props.record.gaps
      }).then( res => {
        switch( res.status ){
          case 200 : 
            props.record.unit_id = null
            props.record.gaps = 0
            getUnitConventions()
            notify.success({
              'title' : 'រក្សារទុកព័ត៌មាន' ,
              'description' : res.data.message ,
              duration : 3000
            })
          break;
        }
      }).catch( err => {
        console.log( err )
        notify.error({
          'title' : 'រក្សារទុកព័ត៌មាន' ,
          'description' : 'មានបញ្ហាក្នុងពេលរក្សារទុកព័ត៌មាន។' ,
          duration : 3000
        })
      })
    }
    
    function handleGapsKeyup(e){
      if( e.keyCode == 13 ){
        create()
      }
    }

    const units = ref([])
    const unitOptions = computed( () => {
      return units.value.length > 0 ? units.value.filter( u => u.id !== props.stock.unit_id ).map( p => { return {label: p.id + ". " +p.name , value: p.id } }) : []
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

    const bigUnitName = computed( () => {
      return units.value.length > 0 ? units.value.find( u => u.id == props.stock.unit_id ) : "No title"
    })

    const unitConventions = ref([])
    function getUnitConventions(){
      store.dispatch('unitconvention/list',{
        search : '' ,
        perPage : 100 ,
        page : 1 ,
        stock_id : props.stock.id
      }).then( res => {
        switch( res.status ){
          case 200 : 
            unitConventions.value = res.data.records
            console.log( unitConventions.value )
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

    function removeUnitConvention(record){
      store.dispatch('unitconvention/delete',{
        id : record.id 
      }).then( res => {
        switch( res.status ){
          case 200 : 
            notify.success({
              'title' : 'លុបព័ត៌មាន' ,
              'description' : res.data.message ,
              duration : 3000
            })
            getUnitConventions()
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

    function clearQuantityOfUnitConvention(){
      quantity.value = []
    }
    function breakdownUnit(stockId , unitConventionId , quantity ){
      store.dispatch('stock/breakdownUnit',{
        stock_id : stockId ,
        unit_convention_id : unitConventionId ,
        quantity : quantity
      }).then( res => {
        console.log( res.data )
        switch( res.status ){
          case 200 : 
            notify.success({
              'title' : 'លុបព័ត៌មាន' ,
              'description' : res.data.message ,
              duration : 3000
            })
          break;
        }
      }).catch(err => {
        console.log( err )
        notify.error({
          'title' : 'រក្សារទុកព័ត៌មាន' ,
          'description' : err.response.data.message ,
          duration : 3000
        })
      })
      clearQuantityOfUnitConvention()
    }

    function buildupUnit(stockId , unitConventionId , quantity){
      store.dispatch('stock/buildupUnit',{
        stock_id : stockId ,
        unit_convention_id : unitConventionId ,
        quantity : quantity
      }).then( res => {
        console.log( res.data )

        switch( res.status ){
          case 200 : 
            notify.success({
              'title' : 'លុបព័ត៌មាន' ,
              'description' : res.data.message ,
              duration : 3000
            })
          break;
        }
      }).catch(err => {
        console.log( err )
        notify.error({
          'title' : 'រក្សារទុកព័ត៌មាន' ,
          'description' : err.response.data.message ,
          duration : 3000
        })
      })
      clearQuantityOfUnitConvention()
    }

    function initialData(){
      getUnits()
      getUnitConventions()
    }

    return {
      /**
       * Variables
       */
      rules ,
      quantity ,
      unitOptions , 
      bigUnitName , 
      unitConventions ,
      /**
       * Functions
       */
      create ,
      handleGapsKeyup ,
      initialData ,
      closeRecord ,
      removeUnitConvention ,
      breakdownUnit ,
      buildupUnit
    }
  }
}
</script>