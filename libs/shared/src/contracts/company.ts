export interface CompanyLookupResponse {
  nip: string;
  name: string;
  address: {
    street: string;
    postalCode: string;
    city: string;
  };
  regon?: string;
  krs?: string;
  source?: {
    gus: boolean;
    mf: boolean;
  };
}
