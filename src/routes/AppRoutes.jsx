import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Jewellery from "../pages/Jewellery";
import Cosmetics from "../pages/Cosmetics";
import Bangles from "../pages/Bangles";
import Hosiery from "../pages/Hosiery";
import Cart from "../pages/Cart";
import ProductDetails from "../pages/ProductDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ShippingPage from "../pages/ShippingPage";
import OrderSuccess from "../pages/OrderSuccess";
import MyOrders from "../pages/MyOrders";
import PaymentPage from "../pages/PaymentPage";
import AdminDashboard from "../pages/AdminDashboard";
import AdminProducts from "../pages/AdminProducts";
import AdminCategories from "../pages/AdminCategories";
import Wishlist from "../pages/Wishlist";
import SubcategoryPage from "../pages/SubcategoryPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/jewellery" element={<Jewellery />} />
      <Route path="/cosmetics" element={<Cosmetics />} />
      <Route path="/bangles" element={<Bangles />} />
      <Route path="/hosiery" element={<Hosiery />} />
      <Route path="/cart" element={<Cart />} />

      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/shipping" element={<ShippingPage />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/orders" element={<MyOrders />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/products" element={<AdminProducts />} />
      <Route path="/admin/categories" element={<AdminCategories />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/:categoryName/:subcategoryName" element={<SubcategoryPage />} />
      {/* Add more routes like rings, earrings etc. later */}
    </Routes>
  );
}
