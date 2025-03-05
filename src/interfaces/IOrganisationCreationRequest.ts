export default interface IOrganisationCreation {
  id: number;
  name: string;
  dateAdded: string; // ✅ Date when the organization was added
  expiryDate: string; // ✅ Expiry date for the organization
}
