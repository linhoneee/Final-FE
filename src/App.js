import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import Navbar from './components/Navbar';
import NavBarAdmin from './components/NavBarAdmin';
import { Button } from '@material-ui/core';
import React, { useState } from 'react';

import LoginUser from './components/User/LoginUser';
import Home from './components/Home';
import BrandList from './components/Brand/BrandList';
import AddBrand from './components/Brand/AddBrand';
import EditBrand from './components/Brand/EditBrand';
import CategoryList from './components/Category/CategoryList';
import AddCategory from './components/Category/AddCategory';
import EditCategory from './components/Category/EditCategory';
import AddUser from './components/User/AddUser';
import UserDetails from './components/User/UserDetails';

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
import MessageAdmin from './components/Message/MessagesAdmin';
import ChatPage from './components/Message/ChatPage';

// import StripePaymentInfo from './components/Payment/StripePaymentInfo';
// import PaymentSuccess from './components/Payment/PaymentSuccess'; 
import AddAddress from './components/Address/AddAddress';
import AddressList from './components/Address/AddressList';
import EditAddress from './components/Address/EditAddress';
import ForgotPassword from './components/User/ForgotPassword';
import ResetPassword from './components/User/ResetPassword';
import WarehouseList from './components/Warehouse/WarehouseList';
import AddWarehouse from './components/Warehouse/AddWarehouse';
import EditWarehouse from './components/Warehouse/EditWarehouse';
import WarehouseInventory from './components/Warehouse/WarehouseInventory';
import AddProductWarehouse from './components/Warehouse/AddProductWarehouse';

import ProductDiscountList from './components/DiscountAndPromotion/ProductDiscountList';
import AddProductDiscount from './components/DiscountAndPromotion/AddProductDiscount';
import EditProductDiscount from './components/DiscountAndPromotion/EditProductDiscount';
import CustomerCouponList from './components/DiscountAndPromotion/CustomerCouponList';
import AddCustomerCoupon from './components/DiscountAndPromotion/AddCustomerCoupon';
import EditCustomerCoupon from './components/DiscountAndPromotion/EditCustomerCoupon';

import SuccessPage from './pages/SuccessPage';
import OrderList from './components/Order/OrderList';

import ReviewResponsePage from './pages/ReviewResponsePage';
import Draggable from 'react-draggable';


function App() {

  const [isMessageModalOpen, setMessageModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleOpenMessageModal = () => {
    if (!isDragging) {
      setMessageModalOpen(true);
    }
  };

  const handleCloseMessageModal = () => {
    setMessageModalOpen(false);
  };

  // React.useEffect(() => {
  //   var _mtm = window._mtm = window._mtm || [];
  //   _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
  //   var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
  //   g.async=true; g.src='https://cdn.matomo.cloud/79fb1172120135ngrokfreeapp.matomo.cloud/container_mpwS9ZPS.js';
  //   s.parentNode.insertBefore(g,s);
  // }, []);


  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        
        <Draggable
          onStart={() => setIsDragging(false)}
          onDrag={() => setIsDragging(true)}
          onStop={() => setTimeout(() => setIsDragging(false), 0)} 
        >
<Button 
    variant="contained" 
    color="primary" 
    onClick={handleOpenMessageModal} 
    style={{
      position: 'fixed', 
      bottom: '20px', 
      right: '20px', 
      borderRadius: '50%', 
      width: '60px', 
      height: '60px',
      backgroundColor: '#215e24',
      backgroundImage: 'url("https://cdn-icons-png.flaticon.com/512/6785/6785302.png")',
      backgroundSize: '40px 40px', 
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      color: 'white',
      zIndex: 1000,
    }}
  />
        </Draggable>
        <MessagesComponent open={isMessageModalOpen} onClose={handleCloseMessageModal} />

        <div style={{ display: 'flex'}}> {/* Sử dụng Flexbox để bố trí layout */}
          {/* <NavBarAdmin />  */}
          {/* NavbarAdmin sẽ nằm ở bên trái */}
          <div style={{ flexGrow: 1, padding: '20px', overflowY: 'auto' }}> {/* Phần này chứa các component router */}
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
          <Route path="/message1/:roomId" element={<MessagesComponent />} />
          <Route path="/message/:roomId" element={<MessageAdmin />} />
          <Route path="/chat/:roomId" element={<ChatPage />} />


          {/* Address Routes */}
          <Route path="/user/:userId/addresses" element={<AddressList />} />
          <Route path="/user/:userId/add-address" element={<AddAddress />} />
          <Route path="/user/:userId/edit-address/:id" element={<EditAddress />} />

          {/* Warehouse Routes */}
          <Route path="/warehouses" element={<WarehouseList />} />
          <Route path="/add-warehouse" element={<AddWarehouse />} />
          <Route path="/edit-warehouse/:id" element={<EditWarehouse />} />
          <Route path="/warehouse/:warehouseId/inventory" element={<WarehouseInventory />} />
          <Route path="/warehouse/:warehouseId/addProduct" element={<AddProductWarehouse />} />
         
         {/* Payment Routes */}
         <Route path="/success" element={<SuccessPage />} /> {/* Thêm route này */}


          {/* Discount and Promotion Routes */}
          <Route path="/product-discounts" element={<ProductDiscountList />} />
          <Route path="/add-product-discount" element={<AddProductDiscount />} />
          <Route path="/edit-product-discount/:id" element={<EditProductDiscount />} />
          <Route path="/customer-coupons" element={<CustomerCouponList />} />
          <Route path="/add-customer-coupon" element={<AddCustomerCoupon />} />
          <Route path="/edit-customer-coupon/:id" element={<EditCustomerCoupon />} />


          {/* Order Routes */}
          <Route path="/order/:userId" element={<OrderList/>} />


          <Route path="/reviews/responses" element={<ReviewResponsePage />} />

          <Route path="/userDetails/:id" element={<UserDetails />} />


        </Routes>
        </div>
        </div>
              </Router>
    </Provider>
  );
}

export default App;