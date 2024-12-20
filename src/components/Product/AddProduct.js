import React, { useState, useEffect, useRef } from 'react';
import ProductService from '../../services/ProductService';
import BrandService from '../../services/BrandService'; // Thêm BrandService
import CategoryService from '../../services/CategoryService'; // Thêm CategoryService
import showGeneralToast from '../toastUtils/showGeneralToast'; // Import toast function
import './AddProduct.css'; // Import CSS file

const AddProduct = ({ onClose, refreshProductList  }) => {
  const [productName, setProductName] = useState('');
  const [descriptionDetails, setDescriptionDetails] = useState('');
  const [price, setPrice] = useState('');
  const [weight, setWeight] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [brands, setBrands] = useState([]); // State cho danh sách thương hiệu
  const [categories, setCategories] = useState([]); // State cho danh sách thể loại
  const [selectedBrand, setSelectedBrand] = useState(''); // State cho thương hiệu đã chọn
  const [selectedCategory, setSelectedCategory] = useState(''); // State cho thể loại đã chọn
  const fileInputRef = useRef(null);

  useEffect(() => {
    BrandService.getAllBrands()
      .then((response) => {
        setBrands(response.data); 
      })
      .catch((err) => {
        console.error('Error fetching brands', err);
        showGeneralToast('Không thể tải danh sách thương hiệu', 'error');
      });

    CategoryService.getAllCategories()
      .then((response) => {
        setCategories(response.data); 
      })
      .catch((err) => {
        console.error('Error fetching categories', err);
        showGeneralToast('Không thể tải danh sách thể loại', 'error');
      });
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // Chuyển đổi đối tượng FileList thành mảng
    setImageFiles([...imageFiles, ...files]); // Cập nhật mảng imageFiles với các file đã chọn
    const urls = files.map((file) => ({ url: URL.createObjectURL(file) })); // Tạo URL tạm thời cho mỗi file
    setImageUrls([...imageUrls, ...urls]); // Cập nhật mảng imageUrls để hiển thị ảnh
  };
  

  const handleRemoveImage = (index) => {
    const newImageUrls = imageUrls.filter((_, i) => i !== index);
    //dấu gạch dưới _  để chỉ rằng tham số này không được nên chỉ cần quan tâm đến tham số thứ hai
    const newImageFiles = imageFiles.filter((_, i) => i !== index);
    setImageUrls(newImageUrls);
    setImageFiles(newImageFiles);
  };

  const saveProduct = (e) => {
    e.preventDefault();
    if (!selectedBrand || !selectedCategory) {
      showGeneralToast('Vui lòng chọn thương hiệu và thể loại!', 'error');
      return;
    }

    const product = { productName, descriptionDetails, price, weight, brandId: selectedBrand, categoryId: selectedCategory };

    ProductService.CreateProduct(product)
      .then((response) => {
        const productId = response.data.id;
        const formData = new FormData();
        imageFiles.forEach((file) => {
          formData.append('images', file);
        });

        ProductService.UploadProductImages(productId, formData)
          .then(() => {
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
            setImageFiles([]);
            onClose(); // Close modal after save
            showGeneralToast('Sản phẩm đã được thêm thành công!', 'success');
            refreshProductList(); 
          })
          .catch((err) => {
            console.error('Có lỗi xảy ra khi tải lên hình ảnh!', err);
            showGeneralToast('Có lỗi xảy ra khi tải lên hình ảnh', 'error');
          });
      })
      .catch((err) => {
        console.error('Có lỗi xảy ra khi tạo sản phẩm!', err);
        if (err.response && err.response.data) {
          const { message } = err.response.data;
          showGeneralToast(message, 'error');
        } else {
          showGeneralToast('Có lỗi xảy ra khi tạo sản phẩm', 'error');
        }
      });
  };

  return (
    <div className="add-product-modal">
      <div className="add-product-modal-content1">
        <h2 className="add-product-modal-title">Thêm Sản Phẩm</h2>
        <form className="add-product-form" onSubmit={saveProduct}>
          <div className="add-product-form-group">
            <label className="add-product-label">Tên Sản Phẩm:</label>
            <input
              type="text"
              className="add-product-input"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <div className="add-product-form-group">
            <label className="add-product-label">Mô Tả:</label>
            <textarea
              className="add-product-textarea"
              value={descriptionDetails}
              onChange={(e) => setDescriptionDetails(e.target.value)}
            />
          </div>
          <div className="add-product-form-group">
            <label className="add-product-label">Giá:</label>
            <input
              type="number"
              className="add-product-input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="add-product-form-group">
            <label className="add-product-label">Cân Nặng:</label>
            <input
              type="number"
              className="add-product-input"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
  
          {/* Dropdown cho thương hiệu */}
          <div className="add-product-form-group">
            <label className="add-product-label">Thương Hiệu:</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="add-product-input"
            >
              <option value="">-- Chọn Thương Hiệu --</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </div>
  
          {/* Dropdown cho thể loại */}
          <div className="add-product-form-group">
            <label className="add-product-label">Danh Mục:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="add-product-input"
            >
              <option value="">-- Chọn Danh Mục --</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
  
          <div className="add-product-form-group">
            <label className="add-product-label">Hình Ảnh:</label>
            <div className="add-product-images">
              {imageUrls.map((image, index) => (
                <div key={index} className="add-product-image-container">
                  <img src={image.url} alt={`Product ${index + 1}`} className="add-product-image" />
                  <button type="button" className="add-product-remove-button" onClick={() => handleRemoveImage(index)}>X</button>
                </div>
              ))}
            </div>
            <label className="add-product-file-label" htmlFor="file-input">Chọn Tập Tin</label>
            <input
              id="file-input"
              type="file"
              multiple
              className="add-product-file-input"
              onChange={handleImageChange}
              ref={fileInputRef}
            />
          </div>
          <button type="submit" className="add-product-button add-product-button-primary">Lưu</button>
          <button type="button" onClick={onClose} className="add-product-button add-product-button-danger">Hủy</button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
