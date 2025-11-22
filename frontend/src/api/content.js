import apiClient from './apiClient';

export const saveContentApi = async (contentData) => {
  try {
    const { data } = await apiClient.post('/content', contentData);
    return data;
  } catch (error) {
    console.error("Error saving content:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Failed to save content');
  }
};

export const getUserContentApi = async () => {
  try {
    const { data } = await apiClient.get('/content');
    return data;
  } catch (error) {
    console.error("Error fetching user content:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch content');
  }
};
