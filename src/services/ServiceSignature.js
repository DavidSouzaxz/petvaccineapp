import api from "./api";

const ServiceSignature = {
  getSignature: async () => {
    try {
      console.log(
        "Headers atuais:",
        api.defaults.headers.common["Authorization"],
      );

      const response = await api.get("/signature");
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.error(
          "Erro 403: O servidor negou o acesso. Verifique se o Token JWT foi enviado.",
        );
      }
      throw error;
    }
  },

  uploadImage: async (fileUri, authData) => {
    const data = new FormData();

    data.append("file", {
      uri: fileUri,
      type: "image/jpeg",
      name: "occurrence_photo.jpg",
    });

    data.append("api_key", authData.api_key);
    data.append("timestamp", authData.timestamp.toString());
    data.append("signature", authData.signature);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${authData.cloud_name}/image/upload`,
        {
          method: "POST",
          body: data,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const result = await response.json();

      if (result.secure_url) {
        return result.secure_url;
      } else {
        throw new Error("Falha no upload para o Cloudinary");
      }
    } catch (error) {
      console.error("Erro no upload Cloudinary:", error);
      throw error;
    }
  },
};

export default ServiceSignature;
