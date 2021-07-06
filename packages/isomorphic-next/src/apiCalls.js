// Get Job Post All List
export const getJobPost = async (client) => {
  const response = await client.get('/job_posting/job_posting_list/');

  return response.data;
};

// Get Job Post Permanent List
export const getJobPostPermanent = async (client) => {
  const response = await client.get('/job_posting/job_posting_list/?job_type=Permanent');

  return response.data;
};

// Get Job Post Contract_Basis List
export const getJobPostContractBasis = async (client) => {
  const response = await client.get('/job_posting/job_posting_list/?job_type=Contract_Basis');

  return response.data;
};

// Get All Zonal
export const getZonals = async (client) => {
  const response = await client.get('/job_posting/zonal_lab_list_and_create/');

  return response.data;
};

// Get All Division
export const getDivisions = async (client) => {
  const response = await client.get('/job_posting/division_list_and_create/');

  return response.data;
};

// Get All Qualification
export const getQualification = async (client) => {
  const response = await client.get('/job_posting/qualification_list/');

  return response.data;
};

// Get All Permanent Positions
export const getPermanentPositions = async (client) => {
  const response = await client.get('/job_posting/permanent_positions/');

  return response.data;
};

// Get All Temporary Positions
export const getTemporaryPositions = async (client) => {
  const response = await client.get('/job_posting/temporary_positions/');

  return response.data;
};

// Get All Qualification Job History
export const getQualificationJobHistory = async (client) => {
  const response = await client.get('/job_posting/qualification_job_history/');

  return response.data;
};

// Get All Doocuments
export const getDocuments = async (client) => {
  const response = await client.get('/document/docs/');

  return response.data;
};

// Get All Information Required
export const getInformationRequired = async (client) => {
  const response = await client.get('/document/info/');

  return response.data;
};

// Create Job Post
export const createJobPost = async (client, request) => {
  const response = await client.post('/job_posting/job_posting_create/', request);

  return response.data;
};

// Update Job Post
export const updateJobPost = async (client, request, id) => {
  const response = await client.put(`/job_posting/detail/${id}/`, request);

  return response.data;
};

// Delete Job Post
export const deleteJobPost = async (client, request, id) => {
  const response = await client.put(`/job_posting/detail/${id}/`, request);

  return response.data;
};

// Get Job Post Details
export const getJobPostDetails = async (client, id) => {
  const response = await client.get(`/job_posting/detail/${id}/`);

  return response.data;
};

export const uploadFile = async (client, request) => {
  const response = await client.post('/user/public/file_upload/?doc_type=job_docs', request);
  console.log('response', response);

  return response.data;
};
