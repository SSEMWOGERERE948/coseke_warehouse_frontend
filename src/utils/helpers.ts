import { accessTokenKey, currentUser } from "./constants";
import { jwtDecode } from "jwt-decode";

export const getCurrentUser = () => {
  return sessionStorage.getItem(currentUser)
    ? JSON.parse(sessionStorage.getItem(currentUser)!)
    : "";
};

export const isAuthenticated = () => {
  const accessToken = sessionStorage.getItem(accessTokenKey);
  if (accessToken) {
    const { exp } = jwtDecode(accessToken);

    const expirationTime = (exp as number) * 1000 - 60000;

    if (Date.now() >= expirationTime) {
      return false;
    }

    return true;
  }
  return false;
};

export const getTokenFromSessionStorage = (): string => {
  const token = sessionStorage.getItem(accessTokenKey) as string;
  return token;
};

export function convertArrayToDate(dateArray: number[]): Date | null {
  // Check if the array has at least 3 elements (year, month, day)
  if (dateArray.length < 3) {
    return null; // or handle it as you see fit
  }

  // Extract year, month, day, and other optional parts
  const year = dateArray[0];
  const month = dateArray[1] - 1; // Month is 0-indexed in JavaScript
  const day = dateArray[2];
  const hour = dateArray[3] || 0; // Defaults to 0 if not provided
  const minute = dateArray[4] || 0; // Defaults to 0 if not provided
  const second = dateArray[5] || 0; // Defaults to 0 if not provided
  const millisecond = dateArray[6] || 0; // Defaults to 0 if not provided

  // Create a new Date object
  return new Date(year, month, day, hour, minute, second, millisecond);
}
