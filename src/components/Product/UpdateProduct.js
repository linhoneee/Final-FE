import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductService from '../../services/ProductService';
import BrandService from '../../services/BrandService'; 
import CategoryService from '../../services/CategoryService'; 
import './UpdateProduct.css'; 
import showGeneralToast from '../toastUtils/showGeneralToast'; 

const UpdateProduct = () => {
  const { id } = useParams();
  const [productName, setProductName] = useState('');
  const [descriptionDetails, setDescriptionDetails] = useState('');
  const [price, setPrice] = useState('');
  const [weight, setWeight] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    ProductService.GetProductById(id)
      .then((response) => {
        const productData = response.data.product;
        setProductName(productData.productName);
        setDescriptionDetails(productData.descriptionDetails);
        setPrice(productData.price);
        setWeight(productData.weight);
        setSelectedBrand(productData.brandId);
        setSelectedCategory(productData.categoryId);
        const urls = response.data.productImages.map((img) => ({
          id: img.id,
          url: `http://localhost:6001${img.url}`,
          isPrimary: img.isPrimary
        }));
        setImageUrls(urls);
      })
      .catch((err) => {
        console.error('Error fetching product data:', err);
      });

    BrandService.getAllBrands()
      .then((response) => {
        setBrands(response.data);
      })
      .catch((err) => {
        console.error('Error fetching brands:', err);
      });

    CategoryService.getAllCategories()
      .then((response) => {
        setCategories(response.data);
      })
      .catch((err) => {
        console.error('Error fetching categories:', err);
      });
  }, [id]);

  // Handle image selection and auto-upload
// Handle image selection and auto-upload
// Handle image selection and auto-upload
const handleImageChange = (e) => {
  const files = Array.from(e.target.files);
  console.log(files);  // Kiểm tra xem các file có đúng không

  // Lưu ảnh vào state files (không xóa ảnh cũ)
  setImageFiles((prevFiles) => [...prevFiles, ...files]);

  // Automatically upload images
  uploadImages(files);
};

// Upload images
const uploadImages = (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('images', file);
  });

  ProductService.UploadProductImages(id, formData)
    .then((response) => {
      console.log(response.data); // Kiểm tra dữ liệu trả về
      if (Array.isArray(response.data)) { // Kiểm tra nếu data là một mảng
        const newUrls = response.data.map((img) => ({
          id: img.id,
          url: `http://localhost:6001${img.url}`,
          isPrimary: img.isPrimary,
        }));

        // Cập nhật danh sách ảnh mới vào danh sách ảnh hiện tại (cả ảnh cũ và mới)
        setImageUrls((prevUrls) => [...prevUrls, ...newUrls]);

        showGeneralToast("Hình ảnh đã được cập nhật thành công!", "success");
      } else {
        showGeneralToast("Phản hồi từ server không hợp lệ.", "error");
      }
    })
    .catch((err) => {
      console.error('Error uploading images:', err);
      showGeneralToast("Có lỗi xảy ra khi cập nhật hình ảnh", "error");
    });
};

  

  // Remove image
  const handleRemoveImage = (index) => {
    const removedImage = imageUrls[index];
    if (removedImage.id) {
      setDeletedImages([...deletedImages, removedImage.id]);
    }

    // Remove from state
    const newImageUrls = imageUrls.filter((_, i) => i !== index);
    const newImageFiles = imageFiles.filter((_, i) => i !== index);

    setImageUrls(newImageUrls);
    setImageFiles(newImageFiles);

    // Call API to delete image
    if (removedImage.id) {
      ProductService.DeleteProductImage(removedImage.id)
        .then(() => {
          showGeneralToast("Hình ảnh đã được xóa thành công!", "success");
        })
        .catch((err) => {
          console.error('Error deleting image:', err);
          showGeneralToast("Có lỗi xảy ra khi xóa hình ảnh", "error");
        });
    }
  };

  // Set image as primary
  const setAsPrimaryImage = (index) => {
    const image = imageUrls[index];
    ProductService.SetPrimaryImage(id, image.id)
      .then(() => {
        const updatedImages = imageUrls.map((img, i) => ({
          ...img,
          isPrimary: i === index,
        }));
        setImageUrls(updatedImages);
        showGeneralToast("Hình ảnh đã được đặt làm chính!", "success");
      })
      .catch((err) => {
        console.error('Error setting primary image:', err);
        showGeneralToast("Có lỗi xảy ra khi đặt ảnh làm chính", "error");
      });
  };

  // Update product details
  const updateProductDetails = (e) => {
    e.preventDefault();

    const product = {
      productName,
      descriptionDetails,
      price,
      weight,
      brandId: selectedBrand,
      categoryId: selectedCategory
    };

    ProductService.UpdateProduct(product, id)
      .then(() => {
        showGeneralToast("Sản phẩm đã được cập nhật thành công!", "success");
      })
      .catch((err) => {
        console.error('Error updating product:', err);
        showGeneralToast("Có lỗi xảy ra khi cập nhật sản phẩm", "error");
      });
  };

  return (
    <div className="update-product-container">
      <h2 className="update-product-header">Cập Nhật Sản Phẩm</h2>
      <form className="update-product-form" onSubmit={updateProductDetails}>
        <div className="update-product-form-group">
          <label className="update-product-label">Tên Sản Phẩm:</label>
          <input
            type="text"
            className="update-product-input"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>
        <div className="update-product-form-group">
          <label className="update-product-label">Mô Tả:</label>
          <textarea
            className="update-product-textarea"
            value={descriptionDetails}
            onChange={(e) => setDescriptionDetails(e.target.value)}
          />
        </div>
        <div className="update-product-form-group">
          <label className="update-product-label">Giá:</label>
          <input
            type="number"
            className="update-product-input"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="update-product-form-group">
          <label className="update-product-label">Cân Nặng:</label>
          <input
            type="number"
            className="update-product-input"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>

        <div className="update-product-form-group">
          <label className="update-product-label">Thương Hiệu:</label>
          <select
            value={selectedBrand || ''}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="update-product-input"
          >
            <option value="">-- Chọn Thương Hiệu --</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
        </div>

        <div className="update-product-form-group">
          <label className="update-product-label">Danh Mục:</label>
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="update-product-input"
          >
            <option value="">-- Chọn Danh Mục --</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="update-product-button">Cập Nhật Thông Tin Sản Phẩm</button>
      </form>

      <h2 className="update-product-header">Cập Nhật Hình Ảnh Sản Phẩm</h2>
      <div className="update-product-images">
        {imageUrls.map((image, index) => (
          <div key={index} className="update-product-image-container">
            <img src={image.url} alt={`Sản phẩm ${index + 1}`} className="update-product-image" />
            <button type="button" className="update-product-button update-product-remove-button" onClick={() => handleRemoveImage(index)}>Xóa</button>
            <button type="button" className="update-product-button update-product-primary-button" onClick={() => setAsPrimaryImage(index)}>
              {image.isPrimary ? 'Chính' : 'Đặt Là Chính'}
            </button>
          </div>
        ))}
      </div>

      <label className="update-product-file-label" htmlFor="file-input">Chọn Tập Tin</label>
      <input
        id="file-input"
        type="file"
        multiple
        className="update-product-file-input"
        onChange={handleImageChange}
        ref={fileInputRef}
      />
    </div>
  );
};

export default UpdateProduct;
