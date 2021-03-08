import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../../store'

Vue.use(VueRouter)

const routes = [
  {
    path: 'schedule',
    name: 'Schedule',
    component: () => import('@/schedule/components/layout/ScheduleLayout'),
    children: [
      {
        path: 'list',
        name: 'ScheduleProjectList',
        component: () => import('@/schedule/pages/projectManagement/components/ScheduleProjectList')
      },
      {
        path: 'create',
        name: 'ScheduleProjectCreator',
        component: () => import('@/schedule/pages/projectManagement/components/ScheduleProjectCreator')
      },
      {
        path: ':schedule_project_id',
        name: 'ScheduleProject',
        component: () => import('@/schedule/pages/Index'),
        redirect: () => ({ name: 'CurrentSimulation' }),
        children: [
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
              store.state.simulation.planId && store.state.simulation.solutions.length > 0
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
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

/**
 * 解决报错问题：报错显示是路由重复
 * Error: Avoided redundant navigation to current location
 */
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
