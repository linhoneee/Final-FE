import { useEffect, useState } from "react";
import ShippingService from "../../services/ShippingService";
import { useNavigate } from "react-router-dom";

const ShippingList = () => {
  const [shippings, setShippings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    ShippingService.getAllShipping()
      .then((response) => {
        setShippings(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error fetching shipping data:', error);
      });
  }, []);

  const addShipping = () => {
    navigate("/addshipping");
  };

  const updateShipping = (id) => {
    navigate(`/updateshipping/${id}`);
  };

  const deleteShipping = (id) => {
    ShippingService.deleteShippingById(id)
      .then((response) => {
        setShippings(shippings.filter((shipping) => shipping.id !== id));
      })
      .catch((error) => {
        console.error('Error deleting shipping data:', error);
      });
  };

  return (
    <div>
      <button onClick={addShipping}>Add</button>

      <h2>List Shipping Type</h2>
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>name</th>
            <th>Giá theo km</th>
            <th>giá theo kg</th>
            <th>hành động</th>
          </tr>
        </thead>
        <tbody>
          {shippings.map((shipping) => (
            <tr key={shipping.id}>
              <td>{shipping.id}</td>
              <td>{shipping.name}</td>
              <td>{shipping.pricePerKm}</td>
              <td>{shipping.pricePerKg}</td>
              <td>
                <button onClick={() => updateShipping(shipping.id)}>Update</button>
                <button onClick={() => deleteShipping(shipping.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShippingList;
