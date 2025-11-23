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
export const getUserContentApi = async () => {
  try {
    const { data } = await apiClient.get('/content');
    return data;
  } catch (error) {
    throw error;
  }
};