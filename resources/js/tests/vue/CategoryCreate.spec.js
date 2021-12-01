// Mock the axios library
jest.mock('axios')

// tests/js/Counter.spec.js
import { createLocalVue, shallowMount } from '@vue/test-utils'
import Create from '../../pages/secure/cruds/categories/Create.vue'
import Vuelidate from 'vuelidate'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import axios from 'axios' // axios here is the mock from above!


// create an extended `Vue` constructor
const localVue = createLocalVue()

// install plugins as normal
localVue.use(BootstrapVue)
localVue.use(Vuelidate)



// Spy the console log
const consoleSpy = jest.spyOn(console, 'log').mockImplementation()


describe('Implementation Test for Create.vue with Failed HTTP POST', () => {
    let wrapper = null

    beforeEach(() => {

        let error = new Error('BAD REQUEST')

        let response = {
                            data: {
                                errors: {
                                    name: ['Something wrong!']
                                }
                            },
                            status: 200,
                            statusText: 'OK',
                            headers: {},
                            config: {},
                        }

        error.response = response 

        // Set the mock call to POST to return a failed POST request
        axios.post.mockRejectedValue(error)

        consoleSpy.mockClear()

        // Render the component
        wrapper = shallowMount(Create, {localVue})

        wrapper.setData({form: {teamId: 1, name: "FirstCategory"}, serverErrorMsgs: []})
    })

    afterEach(() => {
        jest.resetModules()
        jest.clearAllMocks()
    })

    test('Create.vue HTTP POST called with BAD REQUEST', async() => {
        await wrapper.vm.onSubmit()

        expect(axios.post).toHaveBeenCalledTimes(1)

        wrapper.vm.$nextTick().then(function () {
            expect(console.log).toHaveBeenLastCalledWith('BAD REQUEST')
            expect(wrapper.vm.serverErrorMsgs[0]).toBe('Something wrong!')
        })
    })
})
