export const jobStatusList = ['draft', 'ready_to_be_published', 'published', 'suspended', 'cancelled', 'closed'];

//Job Post Permanent
export const jobStatus = {
  draft: 'Draft',
  ready_to_be_published: 'Ready to be Published',
  published: 'Published',
  suspended: 'Suspended',
  cancelled: 'Cancelled',
  closed: 'Closed',
  scheduled: 'Scheduled',
  archived: 'Archived',
};

export const jobTypes = {
  Contract_Basis: 'Contract Basis',
  Permanent: 'Permanent',
};

export const jobStatusFilters = [
  { text: 'Draft', value: 'draft' },
  { text: 'Ready to be Published', value: 'ready_to_be_published' },
  { text: 'Published', value: 'published' },
  { text: 'Suspended', value: 'suspended' },
  { text: 'Cancelled', value: 'cancelled' },
  { text: 'Closed', value: 'closed' },
  { text: 'Scheduled', value: 'scheduled' },
  { text: 'Archived', value: 'archived' },
];

export const jobTypesFilters = [
  { text: 'Contract Basis', value: 'Contract_Basis' },
  { text: 'Permanent', value: 'Permanent' },
  { text: 'Archived', value: 'archived' },
];

//Manage Trainee

export const traineeStatus = {
  active: 'Active',
  yet_to_join: 'Yet to Join',
  completed: 'Completed',
};

export const traineeStatusFilters = [
  { text: 'Active', value: 'active' },
  { text: 'Yet to Join', value: 'yet to join' },
  { text: 'Completed', value: 'completed' },
];

//Requirement Approvals

export const approveStatus = {
  draft: 'Draft',
  submit: 'Submit',
  lock: 'Lock',
  suspended: 'Suspended',
  reject: 'Reject',
  cancel: 'Cancel',
};

export const approveStatusFilters = [
  { text: 'Draft', value: 'draft' },
  { text: 'Submit', value: 'submit' },
  { text: 'Lock', value: 'lock' },
  { text: 'Suspended', value: 'suspended' },
  { text: 'Reject', value: 'reject' },
  { text: 'Cancel', value: 'cancel' },
];

export const applicantJobStatusFilters = [
  { text: 'Accepted', value: 'accepted' },
  { text: 'Hired', value: 'hired' },
  { text: 'Rejected', value: 'rejected' },
  { text: 'Received', value: 'received' },
  { text: 'Shortlisted', value: 'shortlisted' },
  { text: 'Offered', value: 'offered' },
  { text: 'Interview', value: 'interview' },
  { text: 'Awaiting Review', value: 'awaiting review' },
  { text: 'Closed', value: 'closed' },
];
