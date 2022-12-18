import { Fragment, useContext } from 'react'
import { Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import { publicRoutes, privateRoutes } from './routes'
import DefaultLayout from './layouts/defaultLayout'
import { AuthContext } from './context/AuthContext';

function App() {
  const { currentUser } = useContext(AuthContext)

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/sign-in" />;
  };

  return (
    <div className='App'>

      <Routes>
        {publicRoutes.map((route, index) => {
          const Layout = route.layout === null ? Fragment : DefaultLayout
          const Page = route.component
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <Page />
                </Layout>
              }
            />
          )
        })}
        {privateRoutes.map((route, index) => {
          const Layout = route.layout === null ? Fragment : DefaultLayout
          const Page = route.component
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <Layout>
                  <RequireAuth>
                    <Page />
                  </RequireAuth>
                </Layout>
              }
            />
          )
        })}
      </Routes>
    </div>
  )
}

export default App;
