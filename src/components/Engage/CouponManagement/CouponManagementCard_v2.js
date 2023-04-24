import React from "react";
import { Button } from "react-bootstrap";
import { connect } from "react-redux";
import AddCouponModalCard from "./AddCouponModalCard";
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';

class CouponManagementCard_v2 extends React.Component {
    constructor(){
        super();
        this.state = {
            showAddCouponModal : false
        }
    }
    onClickAddCouponModal() { 
        this.setState({showAddCouponModal:!this.state.showAddCouponModal})  
      }
  render() {
    
    const columns = [
      {
        dataField: 'id',
        text: 'Id',
      },
      {
        dataField: 'activate_coupon',
        text: 'Activate Coupon',
        editor: {
            type: Type.CHECKBOX,
            value: 'Y:N'
          },
        events: {
            onClick: (e, column, columnIndex, row, rowIndex) => {
                alert("Checkbix Select");
            },
        }
      }, 
      {
        dataField: 'coupon',
        text: 'Coupon',
        events: {
          onClick: (e, column, columnIndex, row, rowIndex) => {

          },
          onMouseEnter: (e, column, columnIndex, row, rowIndex) => {
          },
          onBlur: (e, column, columnIndex, row, rowIndex) => {
            alert("On Blurrrr");
          }
        }
      }, {
        dataField: 'description',
        text: 'Description'
    },{
        dataField: 'expiry',
        text: 'Expiry Date'
    },{
        dataField: 'orderValue',
        text: 'Order Value'
    },{
        dataField: 'couponType',
        text: 'Coupon Type'
    },
];

    var products = [
        {
            id : 1,
            activate_coupon : 'yes',
            coupon: "HBD15​​​​",
            description: "15% of all orders over $150​",
            expiry : "Dec 15 2021",
            orderValue: "$150",
            couponType: "%off"
          },
          {
            id : 2,
            activate_coupon : 'yes',
            coupon: "20off",
            description: "20% of all orders over $100 or more​",
            expiry : "No Expiry",
            orderValue: "$150",
            couponType: "%off"
          },
          {
            id : 3,
            activate_coupon : 'yes',
            coupon: "HBD15",
            description: "15% of all orders over $150​",
            expiry : "Dec 15 2021",
            orderValue: "$150",
            couponType: "%off"
          },
          {
            id : 4,
            activate_coupon : 'yes',
            coupon: "HBD15​​​​",
            description: "15% of all orders over $150​",
            expiry : "Dec 15 2021",
            orderValue: "$150",
            couponType: "%off"
          },
          {
            id : 5,
            activate_coupon : 'yes',
            coupon: "HBD15",
            description: "15% of all orders over $150​",
            expiry : "Dec 15 2021",
            orderValue: "$150",
            couponType: "%off"
          },
          {
            id : 6,
            activate_coupon : 'yes',
            coupon: "HBD15​​​​",
            description: "15% of all orders over $150​",
            expiry : "Dec 15 2021",
            orderValue: "$150",
            couponType: "%off"
          }];
    
    const selectRow = {
    mode: 'checkbox',
    clickToSelect: true,
    clickToEdit: true,
    onSelect: (row, isSelect, rowIndex, e) => {
    }
    };

    

    return (
      <div className="col-lg-12 col-md-12">
        <div className="card d-flex flex-row flex-wrap pt-3 pb-3">
            <div className="col-lg-12 col-md-12">
                <div className="header">
                    <h4>
                        Coupon Management
                    </h4>
                    <Button onClick={()=>{ this.onClickAddCouponModal(); }} className="btn btn-outline-info btn-info text-white float-right"><span>Add Coupon </span> <i className="fa fa-download"></i> </Button>
                </div>
            </div>

            <BootstrapTable
                keyField="id"
                striped
                hover
                data={ products }
                columns={ columns }
                selectRow={ selectRow }
                bordered={ false }
                cellEdit={ cellEditFactory({ mode: 'click' }) }
            />

            <div className="col-lg-12 col-md-12">
                <div className="body table-responsive">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                            <th>Activate Coupon</th>
                            <th>Coupon</th>
                            <th>Description</th>
                            <th>Expiry Date</th>
                            <th>Order Value</th>
                            <th>Coupon Type</th>
                            </tr>
                        </thead>
                        <tbody>

                        {this.props.data.map((data, i) => {
                            return (
                                <tr key={i}>
                                <td scope="row" className="text-center">
                                <div className="fancy-checkbox">
                                    <label>
                                    <input type="checkbox" />
                                    <span></span>
                                    </label>
                                </div>
                                </td>
                                <td>{data.coupon}</td>
                                <td>{data.description}</td>
                                <td>{data.expiry}</td>
                                <td>{data.orderValue}</td>
                                <td>{data.couponType}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
             </div>               
        </div>
        <AddCouponModalCard
            key={"add_coupon_1"}
            size={"lg"}
            title={"Add Coupon"}
            show={this.state.showAddCouponModal}
            onClose={() => this.onClickAddCouponModal()}
            />


      </div>
    );
  }
}

const mapStateToProps = ({ mailInboxReducer }) => ({});

export default connect(mapStateToProps, {})(CouponManagementCard_v2);
