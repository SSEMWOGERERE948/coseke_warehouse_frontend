import { accessTokenKey, currentUser } from "./constants";
import { jwtDecode } from "jwt-decode";


export const getCurrentUser = () => {
    return  sessionStorage.getItem(currentUser) ? JSON.parse(sessionStorage.getItem(currentUser)!) : "";
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