import React from "react";
import { connect } from "react-redux";
import { websiteRecordAction, onPressSideMenuTab, onLoggedin } from '../../actions';
import { getUsers } from "../../api/Dashboard/OldDB";
import PageHeader from "../../components/PageHeader";
import { Button } from "react-bootstrap";
import AddUserModal from "./AddUserModal";
import EditUserModal from "../../components/users/EditUserModal";
import DeleteUserModal from "./DeleteUserModal";
import { getCurrentUser } from "../../helper/Utils";
import { Toast } from "react-bootstrap";
import { User_Data_Columns } from "../../helper/GetColumnsConfig";
import { getDataTableConfig } from "../../helper/GetDatatableConfig";
import DataTable from "../../helper/Component/DataTable";
import { logoutUserAsync } from "../../api/authentication";

class UsersList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            users: [],
            loadingModal: false,
            showAddUserModal: false,
            showEditUserModal: false,
            editModalData: {},
            showDeleteModal: false,
            deleteData: {},
            newUserdata: {},
            isNewUserdataLoading: true,
            loadToaster: false,
            toasterMessage: null
        }
        this.onClickEditUserModal = this.onClickEditUserModal.bind(this);
        this.onClickAddUsersModal = this.onClickAddUsersModal.bind(this);
        this.onCloseAddUserModal = this.onCloseAddUserModal.bind(this);
        this.onCloseEditUserModal = this.onCloseEditUserModal.bind(this);
        this.onCloseDeleteUserModal = this.onCloseDeleteUserModal.bind(this);
        this.props.onPressSideMenuTab(4);
        this.onClickDeleteCouponModal = this.onClickDeleteCouponModal.bind(this);
    }

    async componentDidMount() {
        await this.getUserLists();
    }

    async componentDidUpdate(prevProps) {
        if (this.props.sessionClient.web_id !== prevProps.sessionClient.web_id) {
            await this.getUserLists();
        }
    }

    onClickEditUserModal(data) {
        this.setState({
            editModalData: data,
            showEditUserModal: true
        });
    }

    onClickAddUsersModal() {
        this.setState({
            showAddUserModal: true
        });
    }

    async onCloseAddUserModal(status) {

        if (status !== undefined) {
            if (status) {
                this.setState({
                    showAddUserModal: false,
                    loadToaster: true,
                    toasterMessage: "Created Successfully"
                });
                await this.getUserLists();

            } else {
                this.setState({
                    showAddUserModal: false,
                    loadToaster: true,
                    toasterMessage: "Something went Wrong!"
                });
            }
        } else {
            this.setState({
                showAddUserModal: false
            });
        }

    }

    async onCloseEditUserModal(status) {

        if (status !== undefined) {
            if (status) {
                this.setState({
                    showEditUserModal: false,
                    loadToaster: true,
                    toasterMessage: "Updated Successfully"
                });
                await this.getUserLists();
            } else {
                this.setState({
                    showEditUserModal: false,
                    loadToaster: true,
                    toasterMessage: "Something went Wrong!"
                })
            }
        } else {
            this.setState({
                showEditUserModal: false
            });
        }
    }

    onClickDeleteCouponModal(data) {
        this.setState({
            showDeleteModal: true,
            deleteData: data
        });
    }

    async onCloseDeleteUserModal(flag) {
        if (flag !== undefined) {
            if (flag) {
                this.setState({
                    showDeleteModal: false,
                    loadToaster: true,
                    toasterMessage: "Deleted Successfully"
                });
                await this.getUserLists();
            } else {
                this.setState({
                    showDeleteModal: false,
                    loadToaster: true,
                    toasterMessage: "Something went Wrong!"
                });
            }
        } else {
            this.setState({
                showDeleteModal: false
            });
        }
    }

    async getUserLists() {
        this.setState({
            isLoading: true
        });
        let currentUser = null;
        if (getCurrentUser() && getCurrentUser().hasOwnProperty('data')) {
            currentUser = getCurrentUser().data.data;
        }
        const headerConfig = {
            headers: {
                Authorization: getCurrentUser() && getCurrentUser().hasOwnProperty('data') && `Bearer ${currentUser.refresh_token}`,
            }
        }
        try {

            const users = await getUsers(headerConfig);
            if (users.hasOwnProperty("status") && users.status === 403) {
                const logout = await logoutUserAsync();
                if (logout && (logout.data.statuscode === 200 || logout.data.statuscode === 400)) {
                    this.props.onLoggedin({ status: false });
                    this.props.history.push({ pathname:'/login'});
                    this.props.history.go();
                }
            } else {
                await this.createUserDataTable(users);
                this.setState({
                    isLoading: false,
                    users: users
                });
            }
        } catch (err) {
            this.setState({
                loadToaster: true,
                toasterMessage: "Something went Wrong!"
            });
        }
    }



    async createUserDataTable(userData) {
        let mainUserData = [];
        userData.map((e, i) => {
            const data = {
                no: ++i,
                firstName: e.firstName,
                lastName: e.lastName,
                email: e.email,
                roles: e.roles,
                is_active: e.is_active ? "Active" : "In Active",
                edit: e,
                delete: e

            }
            mainUserData.push(data);
        });
        const userdata = await getDataTableConfig(mainUserData, /* User Table */
            [
                { accessor: 'no', Header: '#', width: 50 },
                { accessor: 'firstName', Header: 'First Name' },
                { accessor: 'lastName', Header: 'Last Name' },
                { accessor: 'email', Header: 'Email' },
                { accessor: 'roles', Header: 'Role' },
                { accessor: 'is_active', Header: 'Status' },
                {
                    accessor: 'edit', Header: 'Edit', Cell: ({ value }) => {
                        return <div>
                            <span style={{ cursor: "pointer" }} onClick={() => this.onClickEditUserModal(value)}>{this.state.loadingModal === true ?
                                <i className="fa fa-spinner fa-spin text-info"></i>
                                : <i className="badge badge-info fa fa-pencil"> </i>
                            }</span>
                        </div>
                    }
                },
                {
                    accessor: 'delete', Header: 'Delete', Cell: ({ value }) => {
                        return <span style={{ cursor: "pointer" }} className="" onClick={(e) => this.onClickDeleteCouponModal(value)}> <i className="badge badge-danger fa fa-trash"> </i> </span>
                    }
                }
            ]);

        this.setState({
            newUserdata: userdata,
            isNewUserdataLoading: false,
        });
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row clearfix">
                    <div className="col-lg-6 col-md-4">
                        <PageHeader
                            HeaderText="List of Users"
                            Breadcrumb={[{ name: "List of Users" }]}
                        />
                    </div>
                </div>
                <div className="mian-content">
                    <Toast
                        id="toast-container"
                        show={this.state.loadToaster}
                        onClose={() => {
                            this.setState({
                                loadToaster: false
                            })
                        }}
                        className="toast-info toast-top-right"
                        autohide={true}
                        delay={3500}
                    >
                        <Toast.Header className="toast-info mb-0">
                            {this.state.toasterMessage}
                        </Toast.Header>
                    </Toast>
                    <div className="card col-lg-12 col-md-12">
                        <div className="body">
                            <div className="body pt-0" id="addCouponBody">
                                <div className="row">
                                    <div className="col-md-6 col-lg-6">
                                    </div>
                                    <div className="col-md-6 col-lg-6 mb-2">
                                        <Button onClick={() => { this.onClickAddUsersModal(); }} className="btn btn-outline-info btn-info text-white float-right"><span>Add Users +</span></Button>
                                    </div>
                                </div>
                                {!this.state.isLoading &&
                                    <div className="main-content body table-responsive scrollableUserTableFixedHeader cardScrollBar m-r-5 clearfix">

                                        {/* Add DataTable Here 
                                        */}
                                        {this.state.users.length > 0 && !this.state.isNewUserdataLoading ?
                                            <DataTable data={this.state.newUserdata.Dataset} columns={this.state.newUserdata.columnConfig} />
                                            :
                                            <div className="row no_data_row p-2">
                                                <div className="col-md-12 col-lg-12 no_data_avl_md12">
                                                    <h3 className="badge no_data_available">No Coupons Available</h3>
                                                    <table className="table table-striped noDataAvailable"><thead><tr><th>#</th><th>Name</th><th>Description</th><th>Code</th><th>Valid From</th><th>Valid To</th><th>Is Active</th><th>Remarks</th><th>Created On</th><th>Modified On</th><th>Edit</th><th>Delete</th></tr></thead><tbody>


                                                        <tr><td scope="row" className="text-center">1</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>---</td><td></td><td>No Data Available</td><td>No Data Available</td><td className=""> <i className="badge badge-info fa fa-pencil"> </i>  </td><td className=""> <i className="badge badge-danger fa fa-trash"> </i>  </td></tr>


                                                        <tr><td scope="row" className="text-center">2</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>---</td><td></td><td>No Data Available</td><td>No Data Available</td><td className=""> <i className="badge badge-info fa fa-pencil"> </i>  </td><td className=""> <i className="badge badge-danger fa fa-trash"> </i>  </td></tr>

                                                        <tr><td scope="row" className="text-center">3</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>---</td><td></td><td>No Data Available</td><td>No Data Available</td><td className=""> <i className="badge badge-info fa fa-pencil"> </i>  </td><td className=""> <i className="badge badge-danger fa fa-trash"> </i>  </td></tr><tr><td scope="row" className="text-center">4</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>No Data Available</td><td>---</td><td></td><td>No Data Available</td><td>No Data Available</td><td className=""> <i className="badge badge-info fa fa-pencil"> </i>  </td><td className=""> <i className="badge badge-danger fa fa-trash"> </i>  </td></tr></tbody></table>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <AddUserModal
                    key={"addUserModal_001"}
                    size={"lg"}
                    title={"Add User"}
                    show={this.state.showAddUserModal}
                    onClose={(flag) => this.onCloseAddUserModal(flag)}
                />

                <EditUserModal
                    key={"editUserModal_002"}
                    size={"lg"}
                    title={"Edit User"}
                    data={this.state.editModalData}
                    show={this.state.showEditUserModal}
                    onClose={(flag) => this.onCloseEditUserModal(flag)}
                />

                <DeleteUserModal
                    key={"deleteUserModal_002"}
                    size={"lg"}
                    title={"Delete User"}
                    data={this.state.deleteData}
                    show={this.state.showDeleteModal}
                    onClose={(flag) => this.onCloseDeleteUserModal(flag)}
                />
            </div>
        )
    }

}

const mapStateToProps = ({
    websiteRecordReducer,
    loginReducer
}) => ({
    sessionClient: websiteRecordReducer.sessionClient,
    websiteRecord: websiteRecordReducer.websiteRecord,
    isLoggedin: loginReducer.isLoggedin
});

export default connect(mapStateToProps, {
    websiteRecordAction,
    onPressSideMenuTab,
    onLoggedin
})(UsersList);