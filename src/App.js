import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import Navbar from './components/Navbar';
import LoginUser from './components/User/LoginUser';
import Home from './components/Home';
import BrandList from './components/Brand/BrandList';
import AddBrand from './components/Brand/AddBrand';
import EditBrand from './components/Brand/EditBrand';
import CategoryList from './components/Category/CategoryList';
import AddCategory from './components/Category/AddCategory';
import EditCategory from './components/Category/EditCategory';
import AddUser from './components/User/AddUser';
import UpdateUser from './components/User/UpdateUser';
import UserList from './components/User/UserList';
import ListProductByAdmin from './pages/ListProductByAdmin ';

import AddProduct from './components/Product/AddProduct';
import UpdateProduct from './components/Product/UpdateProduct';
import ListProductByUser from './pages/ListProductByUser';
import ProductDetails from './components/Product/ProductDetails';


import Cart from './pages/Cart';
import ShippingList from './components/Shipping/ShippingList';
import AddShipping from './components/Shipping/AddShipping';
import UpdateShipping from './components/Shipping/UpdateShipping';
import Checkout from './pages/Checkout';
import MessagesComponent from './components/Message/MessagesComponent';
// import StripePaymentInfo from './components/Payment/StripePaymentInfo';
// import PaymentSuccess from './components/Payment/PaymentSuccess'; 
import AddAddress from './components/Address/AddAddress';
import AddressList from './components/Address/AddressList';
import EditAddress from './components/Address/EditAddress';
import ForgotPassword from './components/User/ForgotPassword';
import ResetPassword from './components/User/ResetPassword';
import AddAddressPlus from './components/Address/AddAddressPlus';
import WarehouseList from './components/Warehouse/WarehouseList';
import AddWarehouse from './components/Warehouse/AddWarehouse';
import EditWarehouse from './components/Warehouse/EditWarehouse';

import ProductDiscountList from './components/DiscountAndPromotion/ProductDiscountList';
import AddProductDiscount from './components/DiscountAndPromotion/AddProductDiscount';
import EditProductDiscount from './components/DiscountAndPromotion/EditProductDiscount';
import CustomerCouponList from './components/DiscountAndPromotion/CustomerCouponList';
import AddCustomerCoupon from './components/DiscountAndPromotion/AddCustomerCoupon';
import EditCustomerCoupon from './components/DiscountAndPromotion/EditCustomerCoupon';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Brand Routes */}
          <Route path="/brands" element={<BrandList />} />
          <Route path="/add-brand" element={<AddBrand />} />
          <Route path="/edit-brand/:id" element={<EditBrand />} />

          {/* Category Routes */}
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/add-category" element={<AddCategory />} />
          <Route path="/edit-category/:id" element={<EditCategory />} />

          {/* User Routes */}
          <Route path="/userList" element={<UserList />} />
          <Route path="/addUser" element={<AddUser />} />
          <Route path="/updateUser/:id" element={<UpdateUser />} />
          <Route path="/login" element={<LoginUser />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Product Routes */}
          <Route path="/productsadmin" element={<ListProductByAdmin />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/updateproduct/:id" element={<UpdateProduct />} />
          <Route path="/productaddcart" element={<ListProductByUser />} />
          <Route path="/cart/:id" element={<Cart />} />
          <Route path="/products/:id" element={<ProductDetails />} />


          {/* Shipping Routes */}
          <Route path="/shippinglist" element={<ShippingList />} />
          <Route path="/addshipping" element={<AddShipping />} />
          <Route path="/updateshipping/:id" element={<UpdateShipping />} />

          {/* Checkout Routes */}
          <Route path="/checkout/:id" element={<Checkout />} />

          {/* Payment Routes */}
          {/* <Route path="/stripe" element={<StripePaymentInfo />} />
          <Route path="/stripe/success" element={<PaymentSuccess />} /> */}

          {/* Message Routes */}
          <Route path="/message/:roomId" element={<MessagesComponent />} />

          {/* Address Routes */}
          <Route path="/user/:userId/addresses" element={<AddressList />} />
          <Route path="/user/:userId/add-address" element={<AddAddress />} />
          <Route path="/user/:userId/edit-address/:id" element={<EditAddress />} />
          <Route path="/user/:userId/add-addressplus" element={<AddAddressPlus />} />

          {/* Warehouse Routes */}
          <Route path="/warehouses" element={<WarehouseList />} />
          <Route path="/add-warehouse" element={<AddWarehouse />} />
          <Route path="/edit-warehouse/:id" element={<EditWarehouse />} />

          {/* Discount and Promotion Routes */}
          <Route path="/product-discounts" element={<ProductDiscountList />} />
          <Route path="/add-product-discount" element={<AddProductDiscount />} />
          <Route path="/edit-product-discount/:id" element={<EditProductDiscount />} />
          <Route path="/customer-coupons" element={<CustomerCouponList />} />
          <Route path="/add-customer-coupon" element={<AddCustomerCoupon />} />
          <Route path="/edit-customer-coupon/:id" element={<EditCustomerCoupon />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;