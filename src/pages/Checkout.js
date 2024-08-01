import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import ShippingService from '../services/ShippingService';
import PaymentService from '../services/PaymentService';
import AddressService from '../services/AddressService';
import CustomerCouponService from '../services/CustomerCouponService';
import 'leaflet/dist/leaflet.css';
import '../Css/Checkout.css';
import CartItemList from '../components/Checkout/CartItemListCheckout';
import ShippingTypeList from '../components/Checkout/ShippingTypeListCheckout';
import DistanceData from '../components/Checkout/DistanceDataCheckout';
import { AddressModal, DefaultAddress } from '../components/Checkout/AddressModal';
import TotalCost from '../components/Checkout/TotalCost';
import Coupons from '../components/Checkout/Coupons';
import PaymentMethod from '../components/Checkout/PaymentMethod';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedCartItems } = location.state || {};
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
    const fetchInitialData = async () => {
      try {
        const primaryAddressResponse = await AddressService.getPrimaryAddress(id);
        setDefaultAddress(primaryAddressResponse.data);

        const addressesResponse = await AddressService.getAddressesByUserId(id);
        setAddresses(addressesResponse.data);

        const shippingTypesResponse = await ShippingService.getAllShipping();
        const shippingTypes = shippingTypesResponse.data;
        setShippingTypes(shippingTypes);

        const couponsResponse = await CustomerCouponService.getAllCustomerCoupons();
        setCoupons(couponsResponse.data);

        if (shippingTypes.length > 0) {
          const defaultShipping = shippingTypes.reduce((prev, curr) => (prev.id < curr.id ? prev : curr));
          setSelectedShipping(defaultShipping);
        }

        setLoading(false);
      } catch (error) {
        handleError(error);
      }
    };

    fetchInitialData();
  }, [id]);

  useEffect(() => {
    if (selectedCartItems.length > 0 && defaultAddress) {
      const totalProductCost = selectedCartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      setTotalProductCost(totalProductCost);

      const warehouseIds = selectedCartItems.flatMap(item => item.warehouseIds.split(','));
      calculateDistance(defaultAddress, warehouseIds);
    }
  }, [defaultAddress, selectedCartItems, calculateDistance]);

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
        warehouseIds: item.warehouseIds
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
        route: distanceData.route,
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
    const warehouseIds = selectedCartItems.flatMap(item => item.warehouseIds.split(','));
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
          // Reset both selectedCoupon and voucherCode
          setSelectedCoupon(null);
          setVoucherCode('');
        })
        .catch(error => {
          handleError(error);
        });
    }
  };

  const handleVoucherCodeChange = (e) => {
    setVoucherCode(e.target.value);
    setSelectedCoupon(null); // Reset selectedCoupon to null when user enters a new voucher code
  };

  const handleCouponSelect = (e) => {
    setSelectedCoupon(coupons.find(c => c.code === e.target.value));
    setVoucherCode(''); // Reset voucherCode to empty when user selects a coupon from the dropdown
  };

  if (loading) {
    return <p>Loading shipping types...</p>;
  }

  if (error) {
    return <p>Error loading data: {error.message}</p>;
  }

  const routeCoordinates = distanceData ? JSON.parse(distanceData.route).coordinates.map(point => [point[1], point[0]]) : [];

  const formula = selectedShipping && distanceData ? `
    Shipping Cost = (Price per Km * Distance) + (Price per Kg * Total Weight)
    = (${selectedShipping.pricePerKm} * ${distanceData.distance}) + (${selectedShipping.pricePerKg} * ${calculateTotalWeight()})
  ` : '';

  return (
    <div>
      <h2>Checkout</h2>
      <DefaultAddress defaultAddress={defaultAddress} onChangeAddress={() => setIsModalOpen(true)} />
      <CartItemList selectedCartItems={selectedCartItems} />
      <ShippingTypeList shippingTypes={shippingTypes} selectedShipping={selectedShipping} setSelectedShipping={setSelectedShipping} />
      {selectedShipping && (
        <div>
          <h4>Selected Shipping Type: {selectedShipping.name}</h4>
          <p>Shipping Cost: ${shippingCost.toFixed(2)}</p>
          <p>Formula: {formula}</p>
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
      <button onClick={handleConfirmPurchase}>Confirm Purchase</button>
      {isModalOpen && (
        <AddressModal
          defaultAddress={defaultAddress}
          addresses={addresses}
          onClose={() => setIsModalOpen(false)}
          onSelect={handleAddressChange}
        />
      )}
    </div>
  );
};

export default Checkout;
