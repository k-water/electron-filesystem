const Login = resolve => {
  import('@/views/login').then(module => {
    resolve(module)
  })
}

const Index = resolve => {
  import('@/views/index/index').then(module => {
    resolve(module)
  })
}
const routes = [
  {
    path: '/',
    name: 'index',
    component: Index,
    meta: {
      auth: true
    }
  }, {
    path: '/login',
    name: 'login',
    component: Login
  }
]

export default routes
