import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://stage.apzkyc.com/apzkyc',
  headers: {
    Authorization: `Bearer 4fcf3f78138f61fe6273dbd1d6c05f15e30496d7a085919bbcdcf11f271dcecfb564cd09ae8877ede8f0b29ede2a1cbf35b94bf6a5a20be074d54b23460d2165d61fe643f3f3fe8c9c2f46c64c3e1cc0cf729f3d8eef9e611a976fce84a224a9116b5268218240c68c0f06f68a437c0dd25672f357bf44779d56d520bc1909add8ebe5ec9c455396dd2300d2dd4ae587fc2a4f42372e623bca47a083a6602cd958e6de9863996447a8616006f7811af9957c5d55f0e3b0b12aacb959ae850e4e`, // Replace with your token
  },
});

export const uploadImage = async (image) => {
  const formData = new FormData();
  formData.append('image', image);
  const response = await apiClient.post('/uploadimage', formData);
  return response.data;
};
