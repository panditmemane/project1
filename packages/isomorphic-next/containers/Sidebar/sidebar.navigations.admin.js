import {
  ADMIN,
  TRAINEE,
  APPLICATION_SCRUTINY,
  JOB_POSTING_T,
  JOB_POSTING_P,
  MANAGEMENT,
} from '../../static/constants/userRoles';

export default [
  {
    key: '/admin/dashboard',
    label: 'sidebar.admin.dashboard',
    leftIcon: 'ion-home',
    withoutDashboard: true,
    roles: [ADMIN, TRAINEE, APPLICATION_SCRUTINY, JOB_POSTING_T, JOB_POSTING_P, MANAGEMENT],
  },
  {
    key: '/admin/approvals',
    label: 'sidebar.admin.approvals',
    leftIcon: 'ion-android-checkbox-outline',
    withoutDashboard: true,
    roles: [JOB_POSTING_T],
  },
  {
    key: '/admin/manage-job-post/temporary',
    label: 'sidebar.admin.manageJobPost(T)',
    leftIcon: 'ion-speakerphone',
    withoutDashboard: true,
    roles: [ADMIN, APPLICATION_SCRUTINY, JOB_POSTING_T],
  },
  {
    key: '/admin/manage-job-post/permanent',
    label: 'sidebar.admin.manageJobPost(P)',
    leftIcon: 'ion-speakerphone',
    withoutDashboard: true,
    roles: [ADMIN, APPLICATION_SCRUTINY, JOB_POSTING_P],
  },
  {
    key: '/admin/manage-trainees',
    label: 'sidebar.admin.manageTrainees',
    leftIcon: 'ion-person-stalker',
    withoutDashboard: true,
    roles: [TRAINEE],
  },
  {
    key: '/admin/reports',
    label: 'sidebar.admin.reports',
    leftIcon: 'ion-stats-bars',
    withoutDashboard: true,
    roles: [ADMIN],
  },
  {
    key: '/admin/admin-section',
    label: 'sidebar.admin.adminSection',
    leftIcon: 'ion-gear-b',
    children: [
      {
        key: '/admin/admin-section/manage-applicants',
        label: 'sidebar.admin.adminSection.manageApplicants',
        leftIcon: 'ion-gear-b',
        withoutDashboard: true,
        roles: [ADMIN, MANAGEMENT, APPLICATION_SCRUTINY],
      },
      {
        key: '/admin/admin-section/neeri-users-master',
        label: 'sidebar.admin.adminSection.neeriUsersMaster',
        leftIcon: 'ion-gear-b',
        withoutDashboard: true,
        roles: [ADMIN, MANAGEMENT, APPLICATION_SCRUTINY],
      },
      {
        key: '/admin/admin-section/document-master',
        label: 'sidebar.admin.adminSection.documentMaster',
        leftIcon: 'ion-gear-b',
        withoutDashboard: true,
        roles: [ADMIN],
      },
      {
        key: '/admin/admin-section/information-master',
        label: 'sidebar.admin.adminSection.informationMaster',
        leftIcon: 'ion-gear-b',
        withoutDashboard: true,
        roles: [ADMIN],
      },
      {
        key: '/admin/admin-section/qualification-master',
        label: 'sidebar.admin.adminSection.qualificationMaster',
        leftIcon: 'ion-gear-b',
        withoutDashboard: true,
        roles: [ADMIN],
      },
      {
        key: '/admin/admin-section/job-position-master/temporary',
        label: 'sidebar.admin.adminSection.jobPositionMaster(T)',
        leftIcon: 'ion-speakerphone',
        withoutDashboard: true,
        roles: [ADMIN, MANAGEMENT],
      },
      {
        key: '/admin/admin-section/job-position-master/permanent',
        label: 'sidebar.admin.adminSection.jobPositionMaster(P)',
        leftIcon: 'ion-speakerphone',
        withoutDashboard: true,
        roles: [ADMIN, MANAGEMENT],
      },
      {
        key: '/admin/admin-section/template-master',
        label: 'sidebar.admin.adminSection.templateMaster',
        leftIcon: 'ion-gear-b',
        withoutDashboard: true,
        roles: [ADMIN],
      },
      {
        key: '/admin/admin-section/department-master',
        label: 'sidebar.admin.adminSection.departmentMaster',
        leftIcon: 'ion-gear-b',
        withoutDashboard: true,
        roles: [ADMIN],
      },
      {
        key: '/admin/admin-section/zonal-master',
        label: 'sidebar.admin.adminSection.zonalMaster',
        leftIcon: 'ion-gear-b',
        withoutDashboard: true,
        roles: [ADMIN],
      },
    ],
    withoutDashboard: true,
    roles: [ADMIN, TRAINEE, APPLICATION_SCRUTINY, MANAGEMENT],
  },
];
