import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CartService from '../services/CartService';
import InventoryService from '../services/InventoryService';
import './Cart.css'; // Import CSS file

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
        let items = [];
        if (id) {
          const cartResponse = await CartService.FindCartByUserId(id);
          if (cartResponse.data.items) {
            items = JSON.parse(cartResponse.data.items);
          }
        }

        const inventoryResponse = await InventoryService.getAllInventory();
        setInventory(inventoryResponse.data);

        const updatedItems = items.map(item => {
          const productInventory = inventoryResponse.data.filter(inv => inv.productId === item.productId);
          return {
            ...item,
            warehouse: productInventory.map(inv => inv.warehouseId).join(', '),
            inStock: checkStockForProduct(item.productId) // Sử dụng checkStockForProduct để cập nhật trạng thái tồn kho
          };
        });

        setCartItems(updatedItems);

        calculateTotal(updatedItems);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchCartAndInventory();
  }, [id, calculateTotal, checkStockForProduct]);

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
          const updatedItems = prevCartItems.map(item =>
            item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
          );
          calculateTotal(updatedItems);
          return updatedItems;
        });
      });
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = parseInt(newQuantity, 10);  //Là cơ số của hệ đếm, thường là 10 cho hệ thập phân (decimal), nhưng có thể là 2 cho nhị phân, 8 cho bát phân, 16 cho thập lục phân, v.v.
    if (isNaN(quantity) || quantity <= 0) return;

    const currentItem = cartItems.find(item => item.productId === productId);
    if (!currentItem || !checkStockForProduct(productId)) return;

    const difference = quantity - currentItem.quantity;
    if (difference === 0) return;

    setCartItems(prevCartItems => {
      const updatedItems = prevCartItems.map(item =>
        item.productId === productId ? { ...item, quantity: quantity } : item
      );
      calculateTotal(updatedItems);
      return updatedItems;
    });

    const cart = {
      productId: currentItem.productId,
      quantity: Math.abs(difference),
      price: currentItem.price,
      weight: currentItem.weight,
      warehouseIds: currentItem.warehouseIds,
      primaryImageUrl: currentItem.primaryImageUrl
    };

    if (difference > 0) {
      CartService.AddCart(id, cart)
        .catch(error => {
          console.error('Error updating cart item quantity:', error);
        });
    } else {
      CartService.DecreaseCart(id, cart)
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
      primaryImageUrl: item.primaryImageUrl
    };

    CartService.DecreaseCart(id, cart)
      .then(response => {
        setCartItems(prevCartItems => {
          const updatedItems = prevCartItems.map(item =>
            item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item
          );
          calculateTotal(updatedItems);
          return updatedItems;
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
      primaryImageUrl: item.primaryImageUrl
    };

    CartService.ClearProductInCart(id, cart)
      .then(response => {
        setCartItems(prevCartItems => {
          const updatedItems = prevCartItems.filter(item => item.productId !== productId);
          calculateTotal(updatedItems);
          return updatedItems;
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

  const getWarehouseIdsForProduct = (productId) => {
    return inventory
      .filter(item => item.productId === productId)
      .map(item => item.warehouseId);
  };
  
  const groupItemsByIndividualWarehouse = (selectedCartItems, inventory) => {
    let warehouseGroups = {};

    selectedCartItems.forEach(item => {
      const itemWarehouseIds = getWarehouseIdsForProduct(item.productId);

      itemWarehouseIds.forEach(warehouseId => {
        if (!warehouseGroups[warehouseId]) {
          warehouseGroups[warehouseId] = {
            warehouseIds: [warehouseId],
            items: []
          };
        }
        warehouseGroups[warehouseId].items.push(item);
      });
    });
    return Object.values(warehouseGroups);
  };
  
  const handleCheckout = () => {
    const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.productId));
    
    const warehouseGroups = groupItemsByIndividualWarehouse(selectedCartItems, inventory);
    
    console.log("Final Warehouse Groups:", warehouseGroups);
  
    const allInOneGroup = warehouseGroups.length === 1 || warehouseGroups.some(group => group.items.length === selectedCartItems.length);
  
    if (allInOneGroup) {
      console.log("All items in one group - proceeding to checkout:");
      const selectedGroup = warehouseGroups.find(group => group.items.length === selectedCartItems.length) || warehouseGroups[0];
      navigate(`/checkout/${id}`, { state: { selectedCartItems: selectedGroup.items, warehouseIds: selectedGroup.warehouseIds } });
    } else if (warehouseGroups.length > 1) {
      console.log("Multiple groups - showing modal:");
      setModalContent(warehouseGroups);
      setShowModal(true);
    } else if (warehouseGroups.length === 1) {
      console.log("Single group - proceeding to checkout:");
      console.log("Selected Cart Items:", warehouseGroups[0].items);
      console.log("Calculated WarehouseIds:", warehouseGroups[0].warehouseIds);
      navigate(`/checkout/${id}`, { state: { selectedCartItems: warehouseGroups[0].items, warehouseIds: warehouseGroups[0].warehouseIds } });
    }
  };
  
  const handleModalCheckout = () => {
    if (selectedModalGroup !== null) {
      const selectedGroup = modalContent[selectedModalGroup];
      console.log("Selected Cart Items for Modal Checkout:", selectedGroup.items);
      console.log("Selected Modal Group WarehouseIds:", selectedGroup.warehouseIds);
      navigate(`/checkout/${id}`, { state: { selectedCartItems: selectedGroup.items, warehouseIds: selectedGroup.warehouseIds } });
    }
    setShowModal(false);
  };
  
  return (
    <div className="cart-container">
      <h2 className="cart-header">Giỏ Hàng Của Bạn</h2>
      <div className="cart-items">
        {cartItems.length > 0 ? (
 <>
 <div className="select-all">
   <input
     type="checkbox"
     checked={selectedItems.length === cartItems.filter(item => item.inStock).length}
     onChange={handleSelectAllItems}
     className="cart-checkbox"
   /> 
   <p>Chọn tất cả</p>
 </div>
 {cartItems.map(item => (
   <div key={item.productId} className={`cart-item ${item.inStock ? '' : 'out-of-stock'}`}>
     <input
       type="checkbox"
       checked={selectedItems.includes(item.productId)}
       onChange={() => handleSelectItem(item.productId)}
       disabled={!item.inStock}
       className="cart-checkbox"
     />
     <img src={`http://localhost:6001${item.primaryImageUrl}`} alt="Primary" className="product-image" />
     <div className="product-info">
       <h3 onClick={() => handleProductClick(item.productId)} className="product-link">
         Tên: {item.name}
       </h3>
       <p>ID sản phẩm: {item.productId}</p>
       <p>Giá: ${item.price}</p>
       <p>Cân nặng: {item.weight} g</p>
       <p>Kho: {item.warehouse}</p>
       {!item.inStock && (
         <p style={{ color: 'red', fontWeight: 'bold' }}>Sản phẩm đã hết hàng</p>
       )}
     </div>
     <div className="quantity-control">
       <button onClick={() => handleDecreaseItem(item.productId)} className="quantity-button" disabled={!item.inStock}>-</button>
       <input
         type="number"
         value={item.quantity}
         onChange={(e) => handleQuantityChange(item.productId, e.target.value)}
         min="1"
         className="quantity-input"
         disabled={!item.inStock}
       />
       <button onClick={() => handleAddItem(item.productId)} className="quantity-button" disabled={!item.inStock}>+</button>
     </div>
     <button onClick={() => handleRemoveItem(item.productId)} className="remove-button">Xóa</button>
   </div>
 ))}
 <h3 className="total">Tổng cộng: ${total}</h3>
 <button onClick={handleCheckout} className="checkout-button" disabled={selectedItems.length === 0}>Tiến hành thanh toán</button>
</>

        ) : (
          <p className="empty-cart">Giỏ hàng trống.</p>
        )}
      </div>

      {showModal && (
        <div className="custom-modal">
          <div className="custom-modal-content">
            <div className="custom-modal-header">
              <h2>Thông báo</h2>
              <button onClick={() => setShowModal(false)} className="custom-close-modal-button">×</button>
            </div>
            <div className="custom-modal-body">
              <p>
                Các sản phẩm bạn chọn thuộc về các kho hàng khác nhau. Vui lòng chọn mua trước một trong số các đơn hàng sau:
              </p>
              {modalContent.map((group, index) => (
                <div key={index} className="custom-modal-group">
                  <h3>Đơn hàng {index + 1}</h3>
                  <table className="custom-modal-table">
                  <thead>
  <tr>
    <th>ID sản phẩm</th>
    <th>Tên</th>
    <th>Giá</th>
    <th>ID kho</th>
    <th>Hình ảnh</th>
  </tr>
</thead>

                    <tbody>
                      {group.items.map(item => (
                        <tr
                          key={item.productId}
                          onClick={() => setSelectedModalGroup(index)}
                          className={selectedModalGroup === index ? 'custom-selected-modal-group' : ''}
                        >
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
                  <button
                    onClick={handleModalCheckout}
                    className="custom-checkout-modal-button"
                    disabled={selectedModalGroup === null || selectedModalGroup !== index}
                  >
                    Thanh Toán Đơn Hàng {index + 1}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
