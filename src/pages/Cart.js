import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CartService from '../services/CartService';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const { id } = useParams(); 
  const navigate = useNavigate();

  const calculateTotal = (items) => {
    const newTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(newTotal);
  };

  const updateCartItems = (updatedItems) => {
    setCartItems(updatedItems);
    calculateTotal(updatedItems);
  };

  useEffect(() => {
    if (id) {
      CartService.FindCartByUserId(id)
        .then(response => {
          console.log('Cart items:', response.data); 
          if (response.data.items) {
              const items = JSON.parse(response.data.items);
              setCartItems(items);
              calculateTotal(items);
          } else {
            setCartItems([]);
            calculateTotal([]);
          }
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching cart items:', error);
          setError(error);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <p>Loading cart items...</p>;
  }

  if (error) {
    return <p>Error loading cart items: {error.message}</p>;
  }

  const handleAddItem = (productId) => {
    const item = cartItems.find(item => item.productId === productId);
    if (!item) return;

    const cart = {
      productId: item.productId,
      quantity: 1, 
      price: item.price,
      weight: item.weight,
      warehouseIds: item.warehouseIds,
      primaryImageUrl: item.primaryImageUrl // Add primaryImageUrl to cart item
    };

    CartService.AddCart(id, cart)
      .then(response => {
        const updatedItems = cartItems.map(item =>
          item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
        updateCartItems(updatedItems);
      });
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = parseInt(newQuantity, 10);
    if (isNaN(quantity) || quantity <= 0) return;

    const currentItem = cartItems.find(item => item.productId === productId);
    if (!currentItem) return;

    const difference = quantity - currentItem.quantity;
    if (difference === 0) return;

    const updatedItems = cartItems.map(item =>
      item.productId === productId ? { ...item, quantity: quantity } : item
    );
    updateCartItems(updatedItems);

    const cart = {
      productId: currentItem.productId,
      quantity: Math.abs(difference),
      price: currentItem.price,
      weight: currentItem.weight,
      warehouseIds: currentItem.warehouseIds,
      primaryImageUrl: currentItem.primaryImageUrl // Thêm primaryImageUrl vào mục giỏ hàng
    };

    if (difference > 0) {
      // Nếu số lượng tăng
      CartService.AddCart(id, cart)
        .then(response => {
          // Tùy chọn xử lý phản hồi nếu cần thiết
        })
        .catch(error => {
          console.error('Error updating cart item quantity:', error);
        });
    } else {
      // Nếu số lượng giảm
      CartService.DecreaseCart(id, cart)
        .then(response => {
          // Tùy chọn xử lý phản hồi nếu cần thiết
        })
        .catch(error => {
          console.error('Error updating cart item quantity:', error);
        });
    }
  };

  const handleDecreaseItem = (productId) => {
    const item = cartItems.find(item => item.productId === productId);
    if (!item || item.quantity <= 1) return;

    const cart = {
      productId: item.productId,
      quantity: 1,
      price: item.price,
      weight: item.weight,
      warehouseIds: item.warehouseIds,
      primaryImageUrl: item.primaryImageUrl // Add primaryImageUrl to cart item
    };

    CartService.DecreaseCart(id, cart)
      .then(response => {
        const updatedItems = cartItems.map(item =>
          item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
        updateCartItems(updatedItems);
      });
  };

  const handleRemoveItem = (productId) => {
    const item = cartItems.find(item => item.productId === productId);
    if (!item) return;

    const cart = {
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      weight: item.weight,
      warehouseIds: item.warehouseIds,
      primaryImageUrl: item.primaryImageUrl // Add primaryImageUrl to cart item
    };

    CartService.ClearProductInCart(id, cart)
      .then(response => {
        const updatedItems = cartItems.filter(item => item.productId !== productId);
        updateCartItems(updatedItems);
      });
  };

  const handleSelectItem = (productId) => {
    if (selectedItems.includes(productId)) {
      setSelectedItems(selectedItems.filter(id => id !== productId));
    } else {
      setSelectedItems([...selectedItems, productId]);
    }
  };

  const handleSelectAllItems = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map(item => item.productId));
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleCheckout = () => {
    const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.productId));
    navigate(`/checkout/${id}`, { state: { selectedCartItems } });
  };

  return (
    <div>
      <h2>Your Cart</h2>
      <div>
        {cartItems.length > 0 ? (
          <>
            <input
              type="checkbox"
              checked={selectedItems.length === cartItems.length}
              onChange={handleSelectAllItems}
            /> Select All
            {cartItems.map(item => (
              <div key={item.productId}>
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.productId)}
                  onChange={() => handleSelectItem(item.productId)}
                />
                <h3 onClick={() => handleProductClick(item.productId)} style={{ cursor: 'pointer' }}>Product ID: {item.productId}</h3>
                <p>Name: {item.name}</p>
                <p>Price: ${item.price}</p>
                <p>Weight: {item.weight} g</p>
                <p>Warehouse IDs: {item.warehouseIds}</p>
                {item.primaryImageUrl && (
                  <img src={`http://localhost:6001${item.primaryImageUrl}`} alt="Primary" width="100" />
                )}
                <button onClick={() => handleDecreaseItem(item.productId)}>-</button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                  min="1"
                  style={{ width: '50px', textAlign: 'center' }}
                />
                <button onClick={() => handleAddItem(item.productId)}>+</button>
                <button onClick={() => handleRemoveItem(item.productId)}>Remove</button>
              </div>
            ))}
            <h3>Total: ${total}</h3>
            <button onClick={handleCheckout} disabled={selectedItems.length === 0}>Proceed to Checkout</button>
          </>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
    </div>
  );
};

export default Cart;
