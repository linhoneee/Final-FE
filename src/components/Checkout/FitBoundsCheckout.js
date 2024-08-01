import { useMap } from 'react-leaflet';

const FitBounds = ({ bounds }) => {
  const map = useMap();
  if (bounds) {
    map.fitBounds(bounds);
  }
  return null;
};

export default FitBounds;
