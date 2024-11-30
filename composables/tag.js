import axios from "axios";

export const useTag = () => {
  const { token } = userData();
  const getTag = async () => {
    try {
      const { data } = await axios.get(
        `https://upskilling-egypt.com:3006/api/v1/tag`,
        {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        }
      );
      return data;
    } catch (error) {
      useNuxtApp().$toast.error(error.response.data.message);
    }
  };

  onMounted(() => {
    getTag();
  });
  return {
    getTag,
  };
};
