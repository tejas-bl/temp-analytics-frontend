import axios from "axios";
import { API_BASE_URL } from "..";
import { getCurrentUser, setCurrentUser } from "../../helper/Utils";

export const headerConfig = {
  headers: {
    Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${ getCurrentUser().data.data.refresh_token}`,
  }
}
export const loginWithEmailPasswordAsync = async (email, password) => {
  return await axios
    .post(`${API_BASE_URL}/users/login`, { email, password })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err;
    });
};

export const checkAuthenticationAsync = async (refreshToken, config) => {
  return await axios
    .post(`${API_BASE_URL}/users/authenticate`, {refreshToken: refreshToken}, config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
};

export const refresh = (refreshToken, config) => {

  return new Promise((resolve, reject) => {
    axios
      .get(
        `${API_BASE_URL}/users/refresh-login`,
        config
      )
      .then((res) => {
        if (res.data.data.statuscode !== 200) {
          // set message and return.
          // setVerifyUser(true);
          resolve(false);
        } else {
          // const accessToken = res.data.accessToken;
          const userData = getCurrentUser();
          userData.data.data.access_token = res.data.data.data;
          setCurrentUser(userData);
          resolve({
            data: {
              status: 200,
              access_token: res.data.data.data,
              id: res.data.id,
            },
          });
        }
      }).catch(async (err) => {
/*         if (localStorage.getItem("current_user") !== null) {
          const logout = await logoutUserAsync();
          if (logout && logout.data.statuscode === 200) {
            localStorage.removeItem("current_user");
          }
        } */
        resolve(false);
      })
  });
};



export const logoutUserAsync = async () => {
  return await axios
    .get(`${API_BASE_URL}/users/logout`, {
      headers: {
        Authorization: getCurrentUser().data && `Bearer ${getCurrentUser().data.data.refresh_token}`,
      }
    })
    .then((res) => {
      if (res.data.data.statuscode === 200 || res.data.data.statuscode === 400) {
        localStorage.removeItem("current_user");
        localStorage.removeItem("website_data");
        localStorage.removeItem("persist:websiteRecordReducer");
        return res.data;
      } else {
        return res.data;
      }

    })
    .catch((err) => {
      return err.response;
    });
};
