import MockAdapter from 'axios-mock-adapter';
import axiosApiInstance from './axios';
import Constant from './constant';

const axiosMock = new MockAdapter(axiosApiInstance, {
  delayResponse: Constant.MOCK_API_DELAY_RESPONSE,
});

export default axiosMock;
