import { useEffect, useState } from "react";
import ProductService from "../../services/ProductService";
import ProductDiscountService from "../../services/ProductDiscountService";
import InventoryService from "../../services/InventoryService"; // Import InventoryService
import AddProductDiscount from "../DiscountAndPromotion/AddProductDiscount";
import EditProductDiscount from "../DiscountAndPromotion/EditProductDiscount";
import { useNavigate } from "react-router-dom";
import './ProductList.css'; // Import CSS file

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [images, setImages] = useState([]);
  const [productDiscounts, setProductDiscounts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    ProductService.GetAllProduct().then((response) => {
      setProducts(response.data);
      console.log("Products:", response.data);
    }).catch(err => {
      console.error("Error fetching products:", err);
    });

    ProductService.GetAllProductImages().then((response) => {
      setImages(response.data);
      console.log("Images:", response.data);
    }).catch(err => {
      console.error("Error fetching product images:", err);
    });

    ProductDiscountService.getAllProductDiscounts().then((response) => {
      setProductDiscounts(response.data);
      console.log("Product Discounts:", response.data);
    }).catch(err => {
      console.error("Error fetching product discounts:", err);
    });

    InventoryService.getAllInventory().then((response) => {
      setInventory(response.data);
      console.log("Inventory:", response.data);
    }).catch(err => {
      console.error("Error fetching inventory:", err);
    });
  }, []);

  const deleteProduct = (id) => {
    ProductService.DeleteProduct(id).then(() => {
      setProducts(products.filter((product) => product.id !== id));
      setImages(images.filter((image) => image.productId !== id));
    }).catch(err => {
      console.error("Error deleting product:", err);
    });
  };

  const updateProduct = (id) => {
    navigate(`/updateproduct/${id}`);
  };

  const getProductImages = (productId) => {
    return images.filter(image => image.productId === productId).map(image => ({
      ...image,
      url: `http://localhost:6001${image.url}`
    }));
  };

  const getDiscountedPrice = (productId) => {
    const discount = productDiscounts.find(discount => discount.productId === productId);
    return discount ? discount.newPrice : null;
  };

  const openAddModal = (product) => {
    setSelectedProduct(product);
    setShowAddModal(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setSelectedProduct(null);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedProduct(null);
  };

  const deleteDiscount = (productId) => {
    const discount = productDiscounts.find(discount => discount.productId === productId);
    if (discount) {
      ProductDiscountService.deleteProductDiscount(discount.id).then(() => {
        setProductDiscounts(productDiscounts.filter(d => d.id !== discount.id));
      }).catch(err => {
        console.error("Error deleting product discount:", err);
      });
    }
  };

  const checkStockForProduct = (productId) => {
    const productInventory = inventory.filter(item => item.productId === productId);
    const totalQuantity = productInventory.reduce((acc, item) => acc + item.quantity, 0);
    return totalQuantity > 0;
  };

  return (
    <div>
      <h1>Product List</h1>
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>name</th>
            <th>description</th>
            <th>original price</th>
            <th>discounted price</th>
            <th>weight</th>
            <th>images</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const inStock = checkStockForProduct(product.id);
            return (
              <tr key={product.id} style={{ backgroundColor: inStock ? 'white' : 'lightgrey' }}>
                <td>{product.id}</td>
                <td>{product.productName}</td>
                <td>{product.descriptionDetails}</td>
                <td>
                  {getDiscountedPrice(product.id) ? (
                    <span style={{ textDecoration: 'line-through' }}>${product.price}</span>
                  ) : (
                    <span>${product.price}</span>
                  )}
                </td>
                <td>
                  {getDiscountedPrice(product.id) ? (
                    <span style={{ color: 'red' }}>${getDiscountedPrice(product.id)}</span>
                  ) : (
                    <span>N/A</span>
                  )}
                </td>
                <td>{product.weight}</td>
                <td>
                  {getProductImages(product.id).map((image, index) => (
                    <img key={index} src={image.url} alt={product.productName} width="50" />
                  ))}
                </td>
                <td>
                  <button onClick={() => deleteProduct(product.id)}>Delete</button>
                  <button onClick={() => updateProduct(product.id)}>Update</button>
                  {!getDiscountedPrice(product.id) ? (
                    <button onClick={() => openAddModal(product)}>Add Discount</button>
                  ) : (
                    <>
                      <button onClick={() => openEditModal(product)}>Edit Discount</button>
                      <button onClick={() => deleteDiscount(product.id)}>Delete Discount</button>
                    </>
                  )}
                  {!inStock && <p style={{ color: 'red' }}>Sản phẩm đã hết hàng</p>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <AddProductDiscount
              product={selectedProduct}
              closeModal={closeAddModal}
              setProductDiscounts={setProductDiscounts}
              productDiscounts={productDiscounts}
            />
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <EditProductDiscount
              product={selectedProduct}
              closeModal={closeEditModal}
              setProductDiscounts={setProductDiscounts}
              productDiscounts={productDiscounts}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
