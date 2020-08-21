import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/schedule/components/layout/ScheduleLayout'),
    children: [
      {
        path: '/',
        redirect: { name: 'CurrentSimulation' }
      },
      {
        path: 'current-simulation',
        name: 'CurrentSimulation',
        meta: {
          isModule: 'Schedule'
        },
        component: () => import('@/schedule/pages/currentSimulation/Index')
        // redirect: 無排程 => init, 有排程 => schedule
      },
      {
        path: 'schedule-setting',
        name: 'ScheduleSetting',
        meta: {
          isModule: 'Schedule'
        },
        component: () => import('@/schedule/pages/scheduleSetting/Index')
      },
      {
        path: 'simulation',
        name: 'Simulation',
        redirect: () => (
          store.state.simulation.planId
            ? { name: 'SimulationResult' }
            : { name: 'SimulationSetting' }
        ),
        component: () => import('@/schedule/pages/simulation/Index'),
        children: [
          {
            path: 'setting',
            name: 'SimulationSetting',
            meta: {
              isModule: 'Schedule'
            },
            component: () => import('@/schedule/pages/simulation/setting/Index')
          },
          {
            path: 'result',
            name: 'SimulationResult',
            meta: {
              isModule: 'Schedule'
            },
            component: () => import('@/schedule/pages/simulation/result/Index'),
            beforeEnter: (to, from, next) => {
              store.state.simulation.planId ? next() : next({ name: 'SimulationSetting' })
            }
          }
        ]
      },
      {
        path: 'simulation/result',
        name: 'SimulateResult',
        meta: {
          isModule: 'Schedule'
        },
        component: () => import('@/schedule/pages/simulation/result/Index')
      },
      {
        path: 'schedule-init',
        name: 'ScheduleInit',
        meta: {
          isModule: 'Schedule'
        },
        component: () => import('@/schedule/pages/scheduleInit/Index')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
