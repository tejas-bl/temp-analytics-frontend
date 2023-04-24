import {
  UPDATE_EMAIL,
  UPDATE_PASSWORD,
  ON_LOGGEDIN,
} from "../actions/LoginAction";

const initialState = {
  email: "",
  password: "",
  isLoggedin: false,
};

const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_EMAIL: {
      return {
        ...state,
        email: action.payload,
      };
    }

    case UPDATE_PASSWORD: {
      return {
        ...state,
        password: action.payload,
      };
    }

    case ON_LOGGEDIN: {

      const { status } = action.payload;
      return {
        ...state,
        isLoggedin: status,
      };

      // Invoke API function here...
      /*  ----  try {
         const result = loginWithEmailPasswordAsync(email, password).then((res) => {
           if (res.data.statuscode !== 200 || !res.hasOwnProperty('data')) {
 
             return {
               ...state,
               isLoggedin: false,
             };
           } else {
             setCurrentUser(res);
             history.push("/dashboard");
             return {
               ...state,
               isLoggedin: true,
             };
           }
         }).catch((err) => {
           return {
             ...state,
             isLoggedin: err,
           };
 
         }); -----  */
      // ADd the result in the localstorage
      // result.then((userData)=>{
      //   console.log("On Logged In", userData);
      //   if(userData !== null ){
      //     history.push("/dashboard");
      //       setCurrentUser(userData);
      //   }else{
      //     history.push("/login");
      //   }
      // }).catch(err => err)
      // return {
      //   ...state,
      //   isLoggedin: action.payload,
      // };
      /*   ------    } catch (err) {
              return {
                ...state,
                isLoggedin: err,
              };
            } ----- */
    }

    default:
      return state;
  }
};

export default loginReducer;
