import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CartService from '../services/CartService';
import InventoryService from '../services/InventoryService';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState([]);
  const [selectedModalGroup, setSelectedModalGroup] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const calculateTotal = useCallback((items) => {
    const newTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(newTotal);
  }, []);

  const checkStockForProduct = useCallback((productId) => {
    const productInventory = inventory.find(item => item.productId === productId);
    return productInventory ? productInventory.quantity > 0 : false;
  }, [inventory]);

  useEffect(() => {
    const fetchCartAndInventory = async () => {
      try {
        if (id) {
          const cartResponse = await CartService.FindCartByUserId(id);
          console.log('Cart items:', cartResponse.data);
          let items = [];
          if (cartResponse.data.items) {
            items = JSON.parse(cartResponse.data.items);
          }
          calculateTotal(items);
          setCartItems(items);
        }
        const inventoryResponse = await InventoryService.getAllInventory();
        setInventory(inventoryResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchCartAndInventory();
  }, [id, calculateTotal]);

  useEffect(() => {
    const updateStockStatus = () => {
      setCartItems(prevCartItems => {
        return prevCartItems.map(item => ({
          ...item,
          inStock: checkStockForProduct(item.productId),
        }));
      });
    };
    if (inventory.length > 0) {
      updateStockStatus();
    }
  }, [inventory, checkStockForProduct]);

  const getWarehouseIdsForProduct = (productId) => {
    return inventory
      .filter(item => item.productId === productId)
      .map(item => item.warehouseId);
  };

  const handleAddItem = (productId) => {
    const item = cartItems.find(item => item.productId === productId);
    if (!item || !item.inStock) return;

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
        setCartItems(prevCartItems => {
          return prevCartItems.map(item =>
            item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
          );
        });
      });
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = parseInt(newQuantity, 10);
    if (isNaN(quantity) || quantity <= 0) return;

    const currentItem = cartItems.find(item => item.productId === productId);
    if (!currentItem || !currentItem.inStock) return;

    const difference = quantity - currentItem.quantity;
    if (difference === 0) return;

    setCartItems(prevCartItems => {
      return prevCartItems.map(item =>
        item.productId === productId ? { ...item, quantity: quantity } : item
      );
    });

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
    if (!item || item.quantity <= 1 || !item.inStock) return;

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
        setCartItems(prevCartItems => {
          return prevCartItems.map(item =>
            item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item
          );
        });
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
        setCartItems(prevCartItems => {
          return prevCartItems.filter(item => item.productId !== productId);
        });
      });
  };

  const handleSelectItem = (productId) => {
    const item = cartItems.find(item => item.productId === productId);
    if (!item || !item.inStock) return;

    if (selectedItems.includes(productId)) {
      setSelectedItems(selectedItems.filter(id => id !== productId));
    } else {
      setSelectedItems([...selectedItems, productId]);
    }
  };

  const handleSelectAllItems = () => {
    const selectableItems = cartItems.filter(item => item.inStock).map(item => item.productId);
    if (selectedItems.length === selectableItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(selectableItems);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const handleCheckout = () => {
    const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.productId));
    const warehouseGroups = {};

    selectedCartItems.forEach(item => {
      const warehouseIds = getWarehouseIdsForProduct(item.productId).sort().join(',');
      if (!warehouseGroups[warehouseIds]) {
        warehouseGroups[warehouseIds] = [];
      }
      warehouseGroups[warehouseIds].push(item);
    });

    const groupedItems = {};
    for (const warehouseIdStr of Object.keys(warehouseGroups)) {
      const warehouseIds = warehouseIdStr.split(',');
      for (const warehouseId of warehouseIds) {
        if (!groupedItems[warehouseId]) {
          groupedItems[warehouseId] = [];
        }
        groupedItems[warehouseId].push(...warehouseGroups[warehouseIdStr]);
      }
    }

    const filteredGroupedItems = Object.entries(groupedItems).map(([warehouseId, items]) => ({
      warehouseId,
      items: items.filter((item, index, self) =>
        self.findIndex(i => i.productId === item.productId) === index
      )
    }));

    if (filteredGroupedItems.length > 1) {
      setModalContent(filteredGroupedItems);
      setShowModal(true);
    } else {
      navigate(`/checkout/${id}`, { state: { selectedCartItems, warehouseIds: filteredGroupedItems[0].warehouseId } });
    }
  };

  const handleModalCheckout = () => {
    if (selectedModalGroup !== null) {
      const selectedGroup = modalContent[selectedModalGroup];
      navigate(`/checkout/${id}`, { state: { selectedCartItems: selectedGroup.items, warehouseIds: selectedGroup.warehouseId } });
    }
    setShowModal(false);
  };

  return (
    <div>
      <h2>Your Cart</h2>
      <div>
        {cartItems.length > 0 ? (
          <>
            <input
              type="checkbox"
              checked={selectedItems.length === cartItems.filter(item => item.inStock).length}
              onChange={handleSelectAllItems}
            /> Select All
            {cartItems.map(item => (
              <div key={item.productId} style={{ backgroundColor: item.inStock ? 'white' : 'lightgrey' }}>
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.productId)}
                  onChange={() => handleSelectItem(item.productId)}
                  disabled={!item.inStock}
                />
                <h3 onClick={() => handleProductClick(item.productId)} style={{ cursor: 'pointer' }}>Product ID: {item.productId}</h3>
                <p>Name: {item.name}</p>
                <p>Price: ${item.price}</p>
                <p>Weight: {item.weight} g</p>
                <p>Warehouse IDs: {item.warehouseIds}</p>
                {item.primaryImageUrl && (
                  <img src={`http://localhost:6001${item.primaryImageUrl}`} alt="Primary" width="100" />
                )}
                <button onClick={() => handleDecreaseItem(item.productId)} disabled={!item.inStock}>-</button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
                  min="1"
                  style={{ width: '50px', textAlign: 'center' }}
                  disabled={!item.inStock}
                />
                <button onClick={() => handleAddItem(item.productId)} disabled={!item.inStock}>+</button>
                <button onClick={() => handleRemoveItem(item.productId)}>Remove</button>
                <p>warehouseIds in inventory: {getWarehouseIdsForProduct(item.productId).join(', ')}</p>
                {!item.inStock && <p style={{ color: 'red' }}>Sản phẩm đã hết hàng</p>}
              </div>
            ))}
            <h3>Total: ${total}</h3>
            <button onClick={handleCheckout} disabled={selectedItems.length === 0}>Proceed to Checkout</button>
          </>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Thông báo</h2>
            <p>
              Các sản phẩm bạn chọn thuộc về các kho hàng khác nhau. Vui lòng chọn mua trước một trong số các đơn hàng sau:
            </p>
            {modalContent.map((group, index) => (
              <div key={index} style={{ marginBottom: '20px' }}>
                <h3>Đơn hàng {index + 1}</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Product ID</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Warehouse IDs</th>
                      <th>Image</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.items.map(item => (
                      <tr key={item.productId} onClick={() => setSelectedModalGroup(index)} style={{ cursor: 'pointer', backgroundColor: selectedModalGroup === index ? 'lightblue' : 'white' }}>
                        <td>{item.productId}</td>
                        <td>{item.name}</td>
                        <td>${item.price}</td>
                        <td>{getWarehouseIdsForProduct(item.productId).join(', ')}</td>
                        <td>
                          {item.primaryImageUrl && (
                            <img src={`http://localhost:6001${item.primaryImageUrl}`} alt="Primary" width="50" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button onClick={handleModalCheckout} disabled={selectedModalGroup === null || selectedModalGroup !== index}>Checkout Đơn hàng {index + 1}</button>
              </div>
            ))}
            <button onClick={() => setShowModal(false)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
