import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://stage.apzkyc.com/apzkyc',
  headers: {
    Authorization: `Bearer 4fcf3f78138f61fe6273dbd1d6c05f15e30496d7a085919bbcdcf11f271dcecfb564cd09ae8877ede8f0b29ede2a1cbf35b94bf6a5a20be074d54b23460d2165d61fe643f3f3fe8c9c2f46c64c3e1cc0cf729f3d8eef9e611a976fce84a224a916269c85b1364969f1e05b3bd80240b2904889f38038797c92db24adc6179957f15389e2f6e3327a0c1b6d30efc6e5ee39aead1a0599f137069ed2931075076ffb329f80967eb6f1f38d2e7461a682ab1dc9e3e871c457cc71adb3bc7318d3ac`, // Replace with your token
  },
});

export const uploadImage = async (image) => {
  const formData = new FormData();
  formData.append('image', image);
  const response = await apiClient.post('/uploadimage', formData);
  return response.data;
};
