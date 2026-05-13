import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "https://your-azure-api.azurewebsites.net";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err);
    return Promise.reject(err);
  }
);

export const uploadScreeningData = async (jdFile, skills, resumeZip) => {
  const formData = new FormData();
  formData.append("job_description", jdFile);
  formData.append("skills_criteria", skills);
  formData.append("resumes_zip", resumeZip);
  return api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getProcessingStatus = async () => api.get("/status");
export const getCandidates = async () => api.get("/candidates");
export const getCandidateById = async (id) => api.get(`/candidates/${id}`);
export const sendSelectedEmails = async () => api.post("/email/selected");
export const sendRejectedEmails = async () => api.post("/email/rejected");

export default api;
