import axios from "axios";
import React, { useEffect, useState } from "react";
import { Redirect, Route } from "react-router-dom";
import { checkAuthenticationAsync, logoutUserAsync, refresh } from "./api/authentication";
import { getCurrentUser } from "./helper/Utils";

function ProtectedRoute({ path, component: Component, ...restOfProps }) {
  // const isAuthenticated = localStorage.getItem("isAuthenticated");
  const [verifyUser, setVerifyUser] = useState(false);
  const isUserLoggedIn = getCurrentUser();

  useEffect(() => {

    let unmounted = false;
    const source = axios.CancelToken.source();

    let config = {
      headers: {
        Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && getCurrentUser().data && `Bearer ${getCurrentUser().data.data.access_token}`,
      },
      cancelToken: source.token,
    };
    const checkAuthentication = async () => {
      await checkAuthenticationAsync(getCurrentUser() && getCurrentUser().hasOwnProperty('data') && getCurrentUser().data.data.refresh_token, config).then(async (res) => {
        if(res.data.statuscode === 400){
          const logout = await logoutUserAsync();
          setVerifyUser(true);
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: path }
              }}
            />
          );
        }
        if (res.data.error.statusCode !== 200 ) {
          await refresh(getCurrentUser() && getCurrentUser().hasOwnProperty('data') && getCurrentUser().data.data.refresh_token, {
            headers: {
              Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${getCurrentUser().data.data.refresh_token}`,
            }
          })
            .then(async (response) => {
              if (response === false || (response.hasOwnProperty("data") && response.data.status !== 200) ) {
                const logout = await logoutUserAsync();
                setVerifyUser(true);
                return (
                  <Redirect
                    to={{
                      pathname: '/login',
                      state: { from: path }
                    }}
                  />
                );
                // if (logout && logout.data.statuscode === 200) {
                //   // this.props.history.push('/login');
                // }
              } else {
                config = {
                  ...config,
                  headers: {
                    Authorization:
                      getCurrentUser() && getCurrentUser().hasOwnProperty('data') &&
                      `Bearer ${getCurrentUser().data.data.access_token}`,
                  },
                };
                checkAuthentication();
              }
            })
            .catch(async (err) => {
              const logout = await logoutUserAsync();
              setVerifyUser(true);
              return (
                <Redirect
                  to={{
                    pathname: '/login',
                    state: { from: path }
                  }}
                />
              );
              // if (logout && logout.data.statuscode === 200) {
              // this.props.history.push('/login');
              // }
            });
        }else{
    
        }
      }).catch(err => {
      
      });
    };
    checkAuthentication();
    return function () {
      unmounted = true;
      source.cancel('Cancelling in cleanup');
    };
  });


  if (verifyUser || isUserLoggedIn === null || isUserLoggedIn.hasOwnProperty('data') === false) {
    return (
      <Redirect
        to={{
          pathname: '/login',
        }}
      />
    );
  } else {

    return (
      <Route
        {...restOfProps}
        render={(props) =>
          !verifyUser || isUserLoggedIn !== null || isUserLoggedIn.hasOwnProperty('data') !== false ? <Component {...props} /> : <Redirect to={{
            pathname: '/login',
            state: { from: path }
          }} />
        }
      />
    );
  }

}

export default ProtectedRoute;