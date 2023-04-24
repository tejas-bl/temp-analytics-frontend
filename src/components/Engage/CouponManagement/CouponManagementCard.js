import React from "react";
import { Button } from "react-bootstrap";
import { getPersonaPromoCode } from "../../../api/Engage/PromoCode";
import { personaCouponTableData } from "../../../Data/EngageCouponData";
import { formatDate, getCurrentUser } from "../../../helper/Utils";
import AddCouponModalCard from "./AddCouponModalCard";
import DeleteCouponModalCard from "./DeleteCouponModalCard";
import EditCouponModalCard from "./EditCouponModalCard";
import {
  websiteRecordAction
} from "../../../actions";
import { connect } from "react-redux";
import { getEngagePersona } from "../../../api/Engage/OldDB";


class CouponManagementCard extends React.Component {
  constructor() {
    super();
    this.state = {
      showAddCouponModal: false,
      showEditCouponModal: false,
      showDeleteCouponModal: false,
      loadingModal: false,
      loadingModalId: null,
      couponData: {},
      personaData: {},
      personaId: {},
      personaIdIsLoading: true,
      personaKeyValue: {},
      personaIsLoading: true,
      personaKeyValueIsLoading: true,
      loadingMessage: ""
    }
  }


  componentDidMount() {
    const headerConfigPassed = {
      headers: {
        Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${getCurrentUser().data.data.refresh_token}`,
      }
    }
    getEngagePersona(headerConfigPassed)
      .then(res => {
        this.setState({
          personaIsLoading: false,
          personaData: res.data
        })
      })
      .catch(err => {
        console.log(err);
      })
  }

  componentDidUpdate(prevProps) {
    if (this.props.sessionClient.web_id !== prevProps.sessionClient.web_id) {
      const headerConfigPassed = {
        headers: {
          Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${getCurrentUser().data.data.refresh_token}`,
        }
      }
      getEngagePersona(headerConfigPassed)
        .then(res => {
          this.setState({
            personaIsLoading: false,
            personaData: res.data
          })
        })
        .catch(err => {
          console.log(err);
        })
    }
  }


  onClickAddCouponModal(coupon) {
    if (coupon === true) {
      this.setState({
        showAddCouponModal: !this.state.showAddCouponModal
      })
      this.props.renderPromoCode();
    } else {
      this.setState({ showAddCouponModal: !this.state.showAddCouponModal })
    }
  }

  async onClickEditCouponModal(coupon, rowId) {


    this.setState({
      loadingModal: coupon !== undefined && true,
      loadingModalId: coupon !== undefined && rowId
    })
    // const compareSiteInputs = { siteIdInput: this.props.sessionClient.web_id, startDate: convertDateTOLocale(this.state.compareStartDate), endDate: convertDateTOLocale(this.state.compareEndDate) };
    const headerConfigPassed = {
      headers: {
        Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${getCurrentUser().data.data.refresh_token}`,
      }
    }

    if (coupon === true) {
      this.setState({
        showEditCouponModal: !this.state.showEditCouponModal,
        loadingModal: false,
        loadingModalId: null
      })
      this.props.renderPromoCode();
    } else {

      if (!this.state.showEditCouponModal) {
        const siteInputs = { siteIdInput: this.props.sessionClient.web_id, promoCodeId: coupon.id };
        await getPersonaPromoCode(siteInputs, headerConfigPassed).then(res => {
          let personaIdArray = [];
          res.data.map((data) => {
            personaIdArray.push(data.persona_id.toString());
            return;
          })
          this.setState({
            couponData: coupon,
            personaKeyValueIsLoading: false,
            personaIdIsLoading: false,
            personaId: personaIdArray,
            personaKeyValue: res.data,
            showEditCouponModal: !this.state.showEditCouponModal,
            loadingModal: false,
            loadingModalId: null
          });
        });
      } else {
        this.setState({
          showEditCouponModal: !this.state.showEditCouponModal,
          loadingModal: false,
          loadingModalId: null
        })
      }
    }
  }
  async onClickDeleteCouponModal(coupon) {
    if (coupon === true) {
      this.setState({
        showDeleteCouponModal: !this.state.showDeleteCouponModal
      })
      this.props.renderPromoCode();
    } else {

      if (!this.state.showDeleteCouponModal) {
        this.setState({
          showDeleteCouponModal: !this.state.showDeleteCouponModal,
          couponData: coupon
        })
      } else {
        this.setState({
          showDeleteCouponModal: !this.state.showDeleteCouponModal,
          couponData: {}
        })

      }
    }
  }
  render() {

    const personaData = !this.state.personaIsLoading && this.state.personaData;
    const promoCodePersonas = !this.state.personaKeyValueIsLoading && this.state.personaKeyValue;
    const personaId = !this.state.personaIdIsLoading && this.state.personaId;

    return (
      <div className="col-lg-12 col-md-12">
        <div className="card pt-3 pb-3">
          <div className="row p-l-30 p-r-30">
            <div className="col-md-6 col-lg-6">
              <h4>
                Coupon Management
              </h4>
            </div>
            <div className="col-md-6 col-lg-6">
              <Button onClick={() => { this.onClickAddCouponModal(); }} className="btn btn-outline-info btn-info text-white float-right"><span>Add Coupon </span> <i className="fa fa-download"></i> </Button>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="body table-responsive">
                {this.props.data ?
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Code</th>
                        {/*  <th>Site Id</th> */}
                        <th>Valid From</th>
                        <th>Valid To</th>
                        {/*   <th>Status</th> */}
                        <th>Is Active</th>
                        <th>Remarks</th>
                        <th>Created On</th>
                        <th>Modified On</th>
                        <th>Edit</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* {!this.props.data && <tr><td>No Data</td></tr>} */}
                      {this.props.data.map((data, i) => {
                        return (
                          <tr key={`p_promo_code_${i}`}>
                            <td scope="row" className="text-center">
                              {/* {data.id} */}
                              {++i}
                              {/* <div className="fancy-checkbox">
                            <label>
                              <input type="checkbox" />
                              <span></span>
                            </label>
                          </div> */}
                            </td>
                            <td>{data.offer_heading}</td>
                            <td>{data.offer_sub_heading}</td>
                            <td>{data.code}</td>
                            {/*  <td>{data.site_id}</td> */}
                            <td>{data.valid_from !== null ? formatDate(data.valid_from) : ""}</td>
                            <td>{data.valid_to !== null ? formatDate(data.valid_to) : ""}</td>
                            {/*  <td>{data.status}</td> */}
                            <td>{(data.is_active) ? "ON" : "OFF"}</td>
                            <td>{data.remarks}</td>
                            <td>{data.created_on !== null ? formatDate(data.created_on) : ""}</td>
                            <td>{data.modified_on !== null ? formatDate(data.modified_on) : ""}</td>
                            <td onClick={(e) => this.onClickEditCouponModal(data, i)}>
                              {this.state.loadingModal === true && this.state.loadingModalId === i ?
                                <i className="fa fa-spinner fa-spin text-info"></i>
                                : <i className="badge badge-info fa fa-pencil"> </i>
                              }
                            </td>
                            <td className="" onClick={(e) => this.onClickDeleteCouponModal(data)}> <i className="badge badge-danger fa fa-trash"> </i>  </td>
                          </tr>
                        );
                      })
                      }
                    </tbody>
                  </table> :
                  <div className="row no_data_row p-2">
                    <div className="col-md-12 col-lg-12 no_data_avl_md12">
                      <h3 className="badge no_data_available">No Coupons Available</h3>
                      <table className="table table-striped noDataAvailable"><thead><tr><th>#</th><th>Name</th><th>Description</th><th>Code</th><th>Valid From</th><th>Valid To</th><th>Is Active</th><th>Remarks</th><th>Created On</th><th>Modified On</th><th>Edit</th><th>Delete</th></tr></thead><tbody>


                        <tr><td scope="row" className="text-center">1</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>---</td><td></td><td>No Data Available</td><td>No Data Available</td><td className=""> <i className="badge badge-info fa fa-pencil"> </i>  </td><td className=""> <i className="badge badge-danger fa fa-trash"> </i>  </td></tr>


                        <tr><td scope="row" className="text-center">2</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>---</td><td></td><td>No Data Available</td><td>No Data Available</td><td className=""> <i className="badge badge-info fa fa-pencil"> </i>  </td><td className=""> <i className="badge badge-danger fa fa-trash"> </i>  </td></tr>

                        <tr><td scope="row" className="text-center">3</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>---</td><td></td><td>No Data Available</td><td>No Data Available</td><td className=""> <i className="badge badge-info fa fa-pencil"> </i>  </td><td className=""> <i className="badge badge-danger fa fa-trash"> </i>  </td></tr><tr><td scope="row" className="text-center">4</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>---</td><td></td><td>No Data Available</td><td>No Data Available</td><td className=""> <i className="badge badge-info fa fa-pencil"> </i>  </td><td className=""> <i className="badge badge-danger fa fa-trash"> </i>  </td></tr></tbody></table>
                    </div>
                  </div>}
              </div>
            </div>
          </div>
        </div >
        <AddCouponModalCard
          key={"add_coupon_1"}
          size={"lg"}
          title={"Add Coupon"}
          data={personaCouponTableData}
          couponData={this.props.data}
          personaData={personaData}
          show={this.state.showAddCouponModal}
          onClose={(flag) => this.onClickAddCouponModal(flag)}
        />

        <EditCouponModalCard
          key={"edit_coupon_1"}
          size={"lg"}
          title={"Edit Coupon"}
          data={this.state.couponData}
          couponData={this.props.data}
          promoCodePersonas={promoCodePersonas}
          personaData={personaData}
          personaId={personaId}
          show={this.state.showEditCouponModal}
          onClose={(flag) => this.onClickEditCouponModal(flag)}
        />

        <DeleteCouponModalCard
          key={"delete_coupon_1"}
          size={"md"}
          title={"Edit Coupon"}
          data={this.state.couponData}
          show={this.state.showDeleteCouponModal}
          onClose={(flag) => this.onClickDeleteCouponModal(flag)}
        />

      </div >
    );
  }
}

const mapStateToProps = ({
  websiteRecordReducer
}) => {
  return {
    sessionClient: websiteRecordReducer.sessionClient,
    websiteRecord: websiteRecordReducer.websiteRecord
  }
}

export default connect(mapStateToProps, {
  websiteRecordAction
})(CouponManagementCard);
