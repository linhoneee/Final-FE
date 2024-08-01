import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProductService from '../../services/ProductService';

const UpdateProduct = () => {
    const { id } = useParams();
    const [productName, setProductName] = useState('');
    const [descriptionDetails, setDescriptionDetails] = useState('');
    const [price, setPrice] = useState('');
    const [weight, setWeight] = useState('');
    const [newImages, setNewImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        ProductService.GetProductById(id).then((response) => {
            setProductName(response.data.productName);
            setDescriptionDetails(response.data.descriptionDetails);
            setPrice(response.data.price);
            setWeight(response.data.weight);
            setExistingImages(response.data.images || []);
        }).catch(err => {
            console.error("There was an error fetching the product!", err);
        });
    }, [id]);

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        setNewImages([...newImages, ...files]);
    };

    const handleDeleteImage = (imageId) => {
        ProductService.DeleteProductImage(imageId).then(() => {
            setExistingImages(existingImages.filter(image => image.id !== imageId));
        }).catch(err => {
            console.error("There was an error deleting the image!", err);
        });
    };

    const updateProduct = (e) => {
        e.preventDefault();
        const product = { productName, descriptionDetails, price, weight };
        ProductService.UpdateProduct(product, id).then(() => {
            const formData = new FormData();
            newImages.forEach((image) => {
                formData.append("images", image);
            });
            ProductService.UploadProductImages(id, formData).then(() => {
                navigate('/products');
            }).catch(err => {
                console.error("There was an error uploading the product image!", err);
            });
        }).catch(err => {
            console.error("There was an error updating the product!", err);
        });
    };

    return (
        <div>
            <h2>Update Product</h2>
            <form onSubmit={updateProduct}>
                <div>
                    <label>Product Name:</label>
                    <input 
                        type="text" 
                        value={productName} 
                        onChange={(e) => setProductName(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea 
                        value={descriptionDetails} 
                        onChange={(e) => setDescriptionDetails(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Price:</label>
                    <input 
                        type="number" 
                        value={price} 
                        onChange={(e) => setPrice(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Weight:</label>
                    <input 
                        type="number" 
                        value={weight} 
                        onChange={(e) => setWeight(e.target.value)} 
                    />
                </div>
                <div>
                    <label>Existing Images:</label>
                    {existingImages.map((image) => (
                        <div key={image.id}>
                            <img src={image.url} alt="Product" width="100" />
                            <button type="button" onClick={() => handleDeleteImage(image.id)}>X</button>
                        </div>
                    ))}
                </div>
                <div>
                    <label>New Images:</label>
                    <input 
                        type="file" 
                        multiple 
                        onChange={handleImageChange} 
                    />
                </div>
                <button type="submit">Update</button>
            </form>
        </div>
    );
}

export default UpdateProduct;
