import { combineReducers } from "redux";
import loginReducer from "./loginReducer";
import websiteRecordReducer from "./websitesReducer";
import navigationReducer from "./navigationReducer";
import analyticalReducer from "./analyticalReducer";
import demographicReducer from "./demographicReducer";
import ioTReducer from "./ioTReducer";
import mailInboxReducer from "./mailInboxReducer";
import UIElementsReducer from "./UIElementsReducer";

export default combineReducers({
  loginReducer,
  websiteRecordReducer,
  navigationReducer: navigationReducer,
  analyticalReducer: analyticalReducer,
  demographicReducer: demographicReducer,
  ioTReducer: ioTReducer,
  mailInboxReducer: mailInboxReducer,
  UIElementsReducer: UIElementsReducer,
});
