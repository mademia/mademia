import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/AdminLayout'

import Home from './pages/Home'
import Tienda from './pages/Tienda'
import Producto from './pages/Producto'
import Carrito from './pages/Carrito'
import Pedido from './pages/Pedido'
import Politicas from './pages/Politicas'

import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import ProductsAdmin from './pages/admin/ProductsAdmin'
import CategoriesAdmin from './pages/admin/CategoriesAdmin'
import OrdersAdmin from './pages/admin/OrdersAdmin'
import HomeAdmin from './pages/admin/HomeAdmin'
import SettingsAdmin from './pages/admin/SettingsAdmin'

function StoreLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<StoreLayout><Home /></StoreLayout>} />
      <Route path="/tienda" element={<StoreLayout><Tienda /></StoreLayout>} />
      <Route path="/producto/:slug" element={<StoreLayout><Producto /></StoreLayout>} />
      <Route path="/carrito" element={<StoreLayout><Carrito /></StoreLayout>} />
      <Route path="/pedido" element={<StoreLayout><Pedido /></StoreLayout>} />
      <Route path="/politicas" element={<StoreLayout><Politicas /></StoreLayout>} />

      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="productos" element={<ProductsAdmin />} />
        <Route path="categorias" element={<CategoriesAdmin />} />
        <Route path="pedidos" element={<OrdersAdmin />} />
        <Route path="home" element={<HomeAdmin />} />
        <Route path="configuracion" element={<SettingsAdmin />} />
      </Route>
    </Routes>
  )
}
