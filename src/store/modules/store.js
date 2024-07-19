import crud from '../../api/crud'

// initial state
const state = () => ({
  model: {
    name: "stores" ,
    title: "ហាង" 
  },
  records: [] ,
  record: null ,

})

// getters
const getters = {
  getRecords (state, getters, rootState) {
    return state.records
  },
  getRecord (state, getters, rootState) {
    return state.record
  }
}

// actions
const actions = {
  async list ({ state, commit, rootState },params) {
    return await crud.list(rootState.apiServer+"/"+state.model.name + "?" + new URLSearchParams({
        search: params.search ,
        perPage: params.perPage ,
        page: params.page
      }).toString()
    )
  },
  async read ({ state, commit, rootState },params) {
    return await crud.read(rootState.apiServer+"/"+state.model.name+"/"+params.id+'/read')
  },
  async create ({ state, commit, rootState },params) {
    return await crud.create(rootState.apiServer+"/"+state.model.name+"/create",params)
  },
  async update ({ state, commit, rootState },params) {
    return await crud.update(rootState.apiServer+"/"+state.model.name+"/update",params)
  },
  async delete ({ state, commit, rootState },params) {
    return await crud.delete(rootState.apiServer+"/"+state.model.name+"/"+params.id+"/delete")
  },
  async activate({state, commit, rootState}, params){
    return await crud.update(rootState.apiServer+"/"+state.model.name+'/'+params.id+"/activate",params)
  },
  async upload({ state, commit, rootState },formData) {
    return await crud.upload(rootState.apiServer+"/"+state.model.name+"/upload",formData)
  },
  async featurePicture ({ state, commit, rootState },params) {
    return await crud.update(rootState.apiServer+"/"+state.model.name+"/featurepicture",params)
  },
  async removePicture ({ state, commit, rootState },params) {
    return await crud.delete(rootState.apiServer+"/"+state.model.name+"/removepicture",params)
  },
  async compact ({ state, commit, rootState },params) {
    return await crud.list(rootState.apiServer+"/"+state.model.name + "/compact?" + new URLSearchParams({
        search: params.search ,
        perPage: params.perPage ,
        page: params.page
      }).toString()
    )
  },
  async products ({ state, commit, rootState },params) {
    return await crud.list(rootState.apiServer+"/"+state.model.name + "/products?" + new URLSearchParams({
        search: params.search ,
        perPage: params.perPage ,
        page: params.page ,
        store_id: params.store_id
      }).toString()
    )
  },
}

// mutations
const mutations = {
  // increment (state) {
  //   // `state` is the local module state
  //   state.count++
  // }
  setRecords (state, records) {
    state.records = records
  },
  setRecord (state, record) {
    state.record = record
  },

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}