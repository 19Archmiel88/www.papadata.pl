import { apiPost } from './api';

export type DeleteOrganizationRequest = {
  tenantId?: string;
  reason?: string;
};

export type DeleteOrganizationResponse = {
  status: 'deleted';
};

export const deleteOrganization = async (
  payload: DeleteOrganizationRequest
): Promise<DeleteOrganizationResponse> => {
  return apiPost<DeleteOrganizationResponse>('/settings/org/delete', payload);
};
