export default {
  meEndpoint: "http://localhost:4001/auth/me",
  loginEndpoint: "http://localhost:4001/auth/login",
  refreshTokenEndpoint: "http://localhost:4001/auth/refreshtoken",

  // registerEndpoint: '/jwt/register',
  storageTokenKeyName: "access_token",
  refreshTokenKeyName: "refreshToken",
  onTokenExpiration: "refreshToken", // logout | refreshToken
};
