import * as request from "request-promise";
import btoa = require("btoa");

import { oktaConfig } from "../constants/app.constants";

class AuthService {
  public async getAccessToken() {
    const token = btoa(`${oktaConfig.clientId}:${oktaConfig.clientSecret}`);

    return await request({
      uri: `${oktaConfig.issuer}/v1/token`,
      json: true,
      method: "POST",
      headers: {
        authorization: `Basic ${token}`,
      },
      form: {
        grant_type: oktaConfig.grantType,
        scope: oktaConfig.scope,
      },
    });
  }
}

export const authService = new AuthService();
