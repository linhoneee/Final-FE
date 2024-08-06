import axios from 'axios';

const URL = 'http://localhost:4004/reviews';


class ReviewService {

     addReview = (review) => {
        return axios.post(URL, review);
    };
    
     getReviewsByProductId = (productId) => {
        return axios.get(`${URL}/product/${productId}`);
    };

    getReviewsWithoutResponses = () => {
        return axios.get(`${URL}/without-responses`);
    };
}

const instance = new ReviewService();
export default instance;
