import React from 'react'
import { Route, Routes } from 'react-router'
import Login from '../pages/Login'
import routes from './routes'
import Dashboard from '../pages/Dashboard'
import { PrivateRoute } from './PrivateRoute'

function AppRoutes() {
  return (
    <Routes>
        <Route path={routes.LOGIN} element={<Login/>}/>
        <Route 
        path={routes.DASHBOARD} 
        element={<PrivateRoute />}
      >
        <Route path={routes.DASHBOARD}  element={<Dashboard />}>
        </Route>
        </Route>
    </Routes>
  )
}

export default AppRoutes