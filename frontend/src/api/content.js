import apiClient from './apiClient';

/**
 * Saves a new piece of content.
 * @param {object} contentData - The content data to save.
 * @returns {Promise<object>} The saved content object.
 */
export const saveContentApi = async (contentData) => {
  try {
    const { data } = await apiClient.post('/content', contentData);
    return data;
  } catch (error) {
    // The apiClient interceptor will log the error, so we just re-throw it
    // for the component to handle.
    throw error;
  }
};

/**
 * Fetches all content for the authenticated user.
 * @returns {Promise<Array>} An array of content objects.
 */
export const updateContentApi = async (id, updateData) => {
  try {
    const { data } = await apiClient.put(`/content/${id}`, updateData);
    return data;
  } catch (error) {
    console.error("Error updating content:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Failed to update content');
  }
};

export const getUserContentApi = async (filters = {}) => {
  try {
    const { data } = await apiClient.get('/content', { params: filters });
    return data;
  } catch (error) {
    console.error("Error fetching user content:", error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch content');
  }
};