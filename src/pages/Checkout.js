import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import ShippingService from '../services/ShippingService';
import PaymentService from '../services/PaymentService';
import AddressService from '../services/AddressService';
import CustomerCouponService from '../services/CustomerCouponService';
import 'leaflet/dist/leaflet.css';
import './Checkout.css';
import CartItemList from '../components/Checkout/CartItemListCheckout';
import ShippingTypeList from '../components/Checkout/ShippingTypeListCheckout';
import DistanceData from '../components/Checkout/DistanceDataCheckout';
import { AddressModal, DefaultAddress } from '../components/Checkout/AddressModal';
import TotalCost from '../components/Checkout/TotalCost';
import Coupons from '../components/Checkout/Coupons';
import PaymentMethod from '../components/Checkout/PaymentMethod';
import AddAddressPlusModal from '../components/Address/AddAddressPlusModal';
import showGeneralToast from '../components/toastUtils/showGeneralToast'; // Import toast function

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedCartItems, warehouseIds } = location.state || {};  // Nhận warehouseIds từ location.state
  const { id } = useParams();

  const [shippingTypes, setShippingTypes] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [distanceData, setDistanceData] = useState(null);
  const [shippingCost, setShippingCost] = useState(0);
  const [totalProductCost, setTotalProductCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [discountResult, setDiscountResult] = useState(null);
  const [voucherCode, setVoucherCode] = useState('');

  const handleError = (error) => {
    console.error('Error:', error);
    setError(error);
  };

  const calculateTotalWeight = useCallback(() => {
    return selectedCartItems.reduce((acc, item) => acc + (item.weight * item.quantity), 0);
  }, [selectedCartItems]);

  const calculateDistance = useCallback((address, warehouseIds) => {
    if (address && warehouseIds.length > 0) {
      ShippingService.calculateDistanceWithFullAddress(address, warehouseIds)
        .then(response => {
          setDistanceData(response.data);
        })
        .catch(handleError);
    }
  }, []);

  useEffect(() => {
    console.log('useEffect is called');
    const fetchInitialData = async () => {
      try {
        const addressesResponse = await AddressService.getAddressesByUserId(id);
        console.log("Addresses Response: ", addressesResponse);
        if (addressesResponse.status === 404) {
          console.log("No addresses found, setting addresses to null.");
          setAddresses(null);
        } else {
          console.log("Addresses found:", addressesResponse.data);
          setAddresses(addressesResponse.data);
        }

        const shippingTypesResponse = await ShippingService.getAllShipping();
        console.log("Shipping types found:", shippingTypesResponse.data);
        setShippingTypes(shippingTypesResponse.data);

        const couponsResponse = await CustomerCouponService.getAllCustomerCoupons();
        console.log("Coupons found:", couponsResponse.data);
        setCoupons(couponsResponse.data);

        if (shippingTypesResponse.data.length > 0) {
          const defaultShipping = shippingTypesResponse.data.reduce((prev, curr) => (prev.id < curr.id ? prev : curr));
          console.log("Default shipping:", defaultShipping);
          setSelectedShipping(defaultShipping);
        }

        setLoading(false);
        console.log("Loading state set to false");

        const primaryAddressResponse = await AddressService.getPrimaryAddress(id);
        console.log("Primary Address Response: ", primaryAddressResponse);
        if (primaryAddressResponse.status === 404) {
          console.log("Primary address not found, setting defaultAddress to null.");
          setDefaultAddress(null);
        } else if (primaryAddressResponse.data) {
          console.log("Primary address found:", primaryAddressResponse.data);
          setDefaultAddress(primaryAddressResponse.data);
        } else {
          console.log("No primary address, setting defaultAddress to null.");
          setDefaultAddress(null);
        }

      } catch (error) {
        console.error("Error in fetchInitialData:", error);
        handleError(error);
      }
    };

    fetchInitialData();
  }, [id]);


  useEffect(() => {
    if (selectedCartItems.length > 0 && defaultAddress) {
      const totalProductCost = selectedCartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      setTotalProductCost(totalProductCost);

      calculateDistance(defaultAddress, warehouseIds);
    }
  }, [defaultAddress, selectedCartItems, calculateDistance, warehouseIds]);

  useEffect(() => {
    if (selectedShipping && distanceData) {
      const { pricePerKm, pricePerKg } = selectedShipping;
      const distance = distanceData.distance;
      const totalWeight = calculateTotalWeight();
      const cost = (pricePerKm * distance) + (pricePerKg * totalWeight);
      setShippingCost(cost);
      setTotalCost(cost + totalProductCost);
    }
  }, [selectedShipping, distanceData, totalProductCost, calculateTotalWeight]);

  const handleConfirmPurchase = () => {
    const requestData = {
      id: Math.floor(Math.random() * 1000000),
      userId: id,
      items: selectedCartItems.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        weight: item.weight,
        warehouseIds: item.warehouseIds,
        primaryImageUrl: item.primaryImageUrl
      })),
      selectedShipping: {
        id: selectedShipping ? selectedShipping.id : null,
        name: selectedShipping ? selectedShipping.name : null,
        cost: selectedShipping ? shippingCost : 0,
        pricePerKm: selectedShipping ? selectedShipping.pricePerKm : 0,
        pricePerKg: selectedShipping ? selectedShipping.pricePerKg : 0
      },
      distanceData: {
        userId: distanceData.userId,
        receiverName: distanceData.receiverName,
        provinceCity: distanceData.provinceCity,
        district: distanceData.district,
        ward: distanceData.ward,
        street: distanceData.street,
        originLatitude: distanceData.originLatitude,
        originLongitude: distanceData.originLongitude,
        warehouseId: distanceData.warehouseId,
        warehouseName: distanceData.warehouseName,
        warehouseProvinceCity: distanceData.warehouseProvinceCity,
        warehouseDistrict: distanceData.warehouseDistrict,
        warehouseWard: distanceData.warehouseWard,
        destinationLatitude: distanceData.destinationLatitude,
        destinationLongitude: distanceData.destinationLongitude,
        distance: distanceData.distance,
      },
      total: totalCost
    };

    PaymentService.processPayment(requestData, paymentMethod)
      .then(response => {
        if (paymentMethod === 'paypal') {
          window.location.href = response.data;
        } else if (paymentMethod === 'stripe') {
          navigate('/stripe', { state: { paymentInfo: response.data } });
        }
      })
      .catch(error => {
        handleError(error);
      });
  };

  const handleAddressChange = (newAddress) => {
    setDefaultAddress(newAddress);
    setDistanceData(null);
    calculateDistance(newAddress, warehouseIds);
    setIsModalOpen(false);
  };

  const handleApplyCoupon = () => {

    const couponCode = voucherCode.trim() || (selectedCoupon ? selectedCoupon.code : '');

    if (couponCode) {
      CustomerCouponService.applyCoupon(couponCode, totalProductCost, shippingCost)
        .then(response => {
          setDiscountResult(response.data);
          const { discountedOrderValue, discountedShippingCost } = response.data;
          setTotalCost(discountedOrderValue + discountedShippingCost);

          setSelectedCoupon(null);
          setVoucherCode('');

          showGeneralToast("Mã giảm giá đã được áp dụng thành công!", "success");
        })
        .catch((error) => {
          console.error('Error applying coupon:', error);

          if (error.response && error.response.data) {
            const { message } = error.response.data;
            showGeneralToast(message, "error");
          } else {
            showGeneralToast("Có lỗi xảy ra khi áp dụng mã giảm giá", "error");
          }
        });
    } else {
      showGeneralToast("Vui lòng nhập mã giảm giá hợp lệ", "error");
    }
  };

  const handleVoucherCodeChange = (e) => {
    setVoucherCode(e.target.value);
    setSelectedCoupon(null);
  };

  const handleCouponSelect = (e) => {
    setSelectedCoupon(coupons.find(c => c.code === e.target.value));
    setVoucherCode('');
  };

  if (loading) {
    return <p>Đang Tải...</p>;
  }


  const routeCoordinates = distanceData ? JSON.parse(distanceData.route).coordinates.map(point => [point[1], point[0]]) : [];

  const formula = selectedShipping && distanceData ? `
Phí Giao Hàng = (Giá mỗi Km * Quãng đường) + (Giá mỗi Kg * Tổng trọng lượng)
    = (${selectedShipping.pricePerKm} * ${distanceData.distance}) + (${selectedShipping.pricePerKg} * ${calculateTotalWeight()})
  ` : '';

  return (
    <div className="checkout-container">
      <h2 className="checkout-header">Thanh Toán</h2>
      {!defaultAddress ? (
        <div style={{ color: 'red', fontWeight: 'bold' }}>
          Bạn chưa có địa chỉ, yêu cầu tạo địa chỉ mới
          <button
            className="checkout-button"
            onClick={() => setIsAddAddressModalOpen(true)}
            style={{ marginLeft: '10px' }}
          >
            Tạo địa chỉ mới
          </button>
        </div>
      ) : (
        <DefaultAddress defaultAddress={defaultAddress} onChangeAddress={() => setIsModalOpen(true)} />
      )}
      <CartItemList selectedCartItems={selectedCartItems} />
      <ShippingTypeList shippingTypes={shippingTypes} selectedShipping={selectedShipping} setSelectedShipping={setSelectedShipping} />
      {selectedShipping && (
        <div>
          <h4>Loại Giao Hàng: {selectedShipping.name}</h4>
          <p>Phí Giao Hàng: ${shippingCost.toFixed(2)}</p>
          <p>Công Thức Tính Phí Giao Hàng: {formula}</p>
        </div>
      )}
      {distanceData && <DistanceData distanceData={distanceData} routeCoordinates={routeCoordinates} />}
      <TotalCost
        totalProductCost={totalProductCost}
        shippingCost={shippingCost}
        discountResult={discountResult}
        totalCost={totalCost}
      />
      <Coupons
        coupons={coupons}
        voucherCode={voucherCode}
        handleVoucherCodeChange={handleVoucherCodeChange}
        handleCouponSelect={handleCouponSelect}
        handleApplyCoupon={handleApplyCoupon}
      />
      <PaymentMethod paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
      <button className="checkout-button" onClick={handleConfirmPurchase}>Xác nhận mua hàng      </button>
      {isModalOpen && (
        <AddressModal
          defaultAddress={defaultAddress}
          addresses={addresses}
          onClose={() => setIsModalOpen(false)}
          onSelect={handleAddressChange}
        />
      )}
      {isAddAddressModalOpen && (
        <AddAddressPlusModal
          userId={id}
          onClose={() => setIsAddAddressModalOpen(false)}
          onSave={() => {
            AddressService.getAddressesByUserId(id).then(response => {
              setAddresses(response.data);
              if (response.data.length === 1) {
                setDefaultAddress(response.data[0]);
              }
            });
          }}
        />
      )}
    </div>
  );
};

export default Checkout;
