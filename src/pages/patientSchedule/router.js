import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/surgery-schedule',
    name: 'OTSchedule',
    redirect: () => ({ name: 'DemoCurrentOTSimulation' }),
    component: () => import('@/pages/patientSchedule/Index'),
    children: [
      {
        path: 'current-simulation',
        name: 'DemoCurrentOTSimulation',
        component: () => import('@/pages/patientSchedule/currentSimulation/Index')
      },
      {
        path: 'simulation',
        component: () => import('@/pages/patientSchedule/simulation/Index'),
        children: [
          {
            path: 'setting',
            name: 'DemoOTSimulationSetting',
            component: () => import('@/pages/patientSchedule/simulation/setting/Index')
          },
          {
            path: 'result',
            name: 'DemoOTSimulationResult',
            component: () => import('@/pages/patientSchedule/simulation/result/Index'),
          }
        ]
      }
    ]
  },
  {
    path: '/bed-schedule',
    name: 'BedSchedule',
    component: () => import('@/pages/patientSchedule/Index'),
    children: [
      {
        path: 'current-simulation',
        name: 'DemoCurrentBedSimulation',
        component: () => import('@/pages/patientSchedule/currentSimulation/Index')
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
