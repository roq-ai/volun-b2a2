interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['Organization Owner'],
  customerRoles: ['Local Business Owner'],
  tenantRoles: ['Student Volunteer', 'Reward Administrator', 'Volunteer Coordinator', 'Organization Owner'],
  tenantName: 'Nonprofit',
  applicationName: 'Volun',
  addOns: ['file', 'notifications', 'chat'],
};
