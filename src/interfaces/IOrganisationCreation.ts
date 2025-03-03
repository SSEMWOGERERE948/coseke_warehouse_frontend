export default interface IOrganization {
  id?: number; // ✅ Optional since backend may generate it
  name: string;
  dateAdded?: string; // ✅ Backend sets this automatically
  expiryDate?: string; // ✅ Allow expiry extension
}
