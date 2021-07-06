import { APPLICANT } from '../../static/constants/userRoles';

export default [
  {
    key: '/job-posts',
    label: 'sidebar.jobPosts',
    leftIcon: 'ion-speakerphone',
    withoutDashboard: true,
    roles: [APPLICANT],
  },
  {
    key: '/manage-applications',
    label: 'sidebar.manageApplications',
    leftIcon: 'ion-android-checkbox-outline',
    withoutDashboard: true,
    roles: [APPLICANT],
  },
  {
    key: '/applicant-profile-main',
    label: 'sidebar.manageProfile',
    leftIcon: 'ion-person-stalker',
    withoutDashboard: true,
    roles: [APPLICANT],
  },
  {
    key: '/results',
    label: 'sidebar.results',
    leftIcon: 'ion-stats-bars',
    withoutDashboard: true,
    roles: [APPLICANT],
  },
];
