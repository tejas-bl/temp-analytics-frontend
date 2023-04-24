import React from "react";
import { connect } from "react-redux";
import { websiteRecordAction, onPressSideMenuTab, onLoggedin } from '../../actions';
import PageHeader from "../../components/PageHeader";
import { Button, Form } from "react-bootstrap";
import DeleteReportModal from "../../components/reports/DeleteReportModal";
import { convertDateTOLocale, formatDate, getCurrentUser, isValidHttpUrl } from "../../helper/Utils";
import { Toast } from "react-bootstrap";
import { getDataTableConfig } from "../../helper/GetDatatableConfig";
import DataTable from "../../helper/Component/DataTable";
import { logoutUserAsync } from "../../api/authentication";
import { getScreenshots, getShopperTopData, uploadScreenshot } from "../../api/Dashboard/Reports";
import { ErrorMessage, Field, Formik, isString } from "formik";
import Select from "react-dropdown-select";
import DeleteScreenshotModal from "../../components/reports/DeleteScreenshotModal";
import EditScreenshotModal from "../../components/reports/EditScreenshotModal";
import { top_shopper_data } from "./topShopperData";
import DateRange from "../../helper/DateRange";
import { subDays } from "date-fns";
import RefreshButton from "../../helper/Component/RefreshButton";

class ScreenshotManagement extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: true,
			screenshots: [],
			shoppersTopData: [],
			resettingInitialValues: false,
			loadingModal: false,
			showCreateReportModal: false,
			isSubmitting: false,
			selectedShopper: "",
			screenshotType: "",
			startDate: subDays(new Date(), 31),
			endDate: subDays(new Date(), 2),
			showEditScreenshotModal: false,
			topShopperData: top_shopper_data,
			resetShopperTopData: [],
			adwareShopperSequenceNumber: [
				{ label: "1", value: "1" },
				{ label: "2", value: "2" },
				{ label: "3", value: "3" },
				{ label: "4", value: "4" },
				{ label: "5", value: "5" },
				{ label: "6", value: "6" },
				{ label: "7", value: "7" },
				{ label: "8", value: "8" }
			],
			showAdwareShopperInjectionTypeDropdown: true,
			showShopperInjectionTypeTextFieldCustomData: false,
			showAdwareShopperSequenceNumberDropdown: true,
			editModalData: {},
			showDeleteModal: false,
			deleteData: {},
			newScreenshotdata: {},
			isNewScreenshotdataLoading: true,
			loadToaster: false,
			toasterMessage: null,
			fileUploaded: false,
			//////////
			formField: { report_type: "", screenshot_type: "", shoppers: "", site_id: this.props.sessionClient.web_id, remarks: "", screenshots: "", shopper_top_data: "", top_data_order: "", shopper_top_data_custom_value: "" },
			reportTypeOptions: [
				{ label: "InDepth/Listening Phase/Custom Report", value: "indepth" },
				/* { label: "Listening Phase Report", value: "listening" },
				{ label: "MTD Report", value: "mtd" } */
			],
			screenshotTypeOptions: [
				{ label: "Problem", value: "problem" },
				{ label: "Solution", value: "solution" },
				{ label: "Analytics", value: "analytics" },
				{ label: "Significance", value: "significance" },
			],
			shoppersOptions: [
				{ label: `${this.props.shopperRecord.shield}`, value: 7 },
                { label: `${this.props.shopperRecord.ti3}`, value: 2 },
                { label: `${this.props.shopperRecord.epr}`, value: 4 },
                { label: `${this.props.shopperRecord['e-ei']}`, value: 3 },
                { label: `${this.props.shopperRecord.cs}`, value: 5 },
                { label: `${this.props.shopperRecord.wc}`, value: 1 },
				/*                 { label: "Listening Phase Report", value: "listening" },
								{ label: "MTD Report", value: "mtd" } */
			]
		}
		this.onClickEditScreenshotModal = this.onClickEditScreenshotModal.bind(this);
		this.onCloseEditScreenshotModal = this.onCloseEditScreenshotModal.bind(this);
		this.onCloseDeleteScreenshotModal = this.onCloseDeleteScreenshotModal.bind(this);
		this.onUploadScreenshot = this.onUploadScreenshot.bind(this);
		this.props.onPressSideMenuTab(4);
		this.onClickDeleteScreenshotModal = this.onClickDeleteScreenshotModal.bind(this);
		this.handleOnRefreshData = this.handleOnRefreshData.bind(this);
	}
	async componentDidMount() {
		let currentUser = null;
		const siteIdInput = this.props.sessionClient.web_id;

		if (getCurrentUser() && getCurrentUser().hasOwnProperty('data')) {
			currentUser = getCurrentUser().data.data;
		}
		const headerConfig = {
			headers: {
				Authorization: currentUser && `Bearer ${currentUser.refresh_token}`,
			}
		}
		await this.getScreenshotLists();
	}

	async handleOnRefreshData() {
		await this.getScreenshotLists();
	}
	async componentDidUpdate(prevProps) {
		if (this.props.sessionClient.web_id !== prevProps.sessionClient.web_id) {
			this.setState({
				resettingInitialValues: true,
				formField: { report_type: "", screenshot_type: "", site_id: this.props.sessionClient.web_id, remarks: "", screenshots: "", shopper_top_data: "", top_data_order: "", shopper_top_data_custom_value: "" },
			})
			await this.getScreenshotLists();
		}
	}

	async handleDateChange(item) {

		const itemStartDate = item[0].startDate;
		const itemEndDate = item[0].endDate;
		this.setState({
			startDate: itemStartDate,
			endDate: itemEndDate
		})
	}
	onClickEditScreenshotModal(data) {
		this.setState({
			editModalData: data,
			showEditScreenshotModal: true
		});
	}


	async onCloseEditScreenshotModal(status) {
		if (status) {
			await this.getScreenshotLists();
		}
		this.setState({
			showEditScreenshotModal: false
		});
	}



	async onUploadScreenshot(data) {
		this.setState({
			isSubmitting: true
		});
		const currentUser = getCurrentUser();
		const headerConfig = {
			headers: {
				Authorization: currentUser && currentUser.hasOwnProperty('data') && `Bearer ${currentUser.data.data.refresh_token}`,
				'Content-Type': 'multipart/form-data'
			}
		}

		var formData = new FormData()
		formData.append('site_id', parseInt(this.props.sessionClient.web_id))
		formData.append('report_type', data.report_type)
		formData.append('shoppers', data.shoppers)
		formData.append('shopper_top_data', data.shopper_top_data)
		formData.append('top_data_order', data.top_data_order)
		formData.append('remarks', data.remarks)
		formData.append('screenshot_type', data.screenshot_type)
		formData.append('screenshot', data.screenshots)
		formData.append('updated_at', data.updated_at)
		formData.append('from_date', data.from_date)
		formData.append('to_date', data.to_date)

		try {
			const uploadScreenshotResponse = await uploadScreenshot(formData, headerConfig);
			if (uploadScreenshotResponse.hasOwnProperty('data') && uploadScreenshotResponse.data.hasOwnProperty('data') && uploadScreenshotResponse.data.data.hasOwnProperty('statuscode') && uploadScreenshotResponse.data.data.statuscode === 200) {
				this.setState({
					loadToaster: true,
					toasterMessage: "Created Successfully",
					isSubmitting: false
				});
			} else {
				this.setState({
					loadToaster: true,
					toasterMessage: "Something went wrong!",
					isSubmitting: false
				});
			}
			await this.getScreenshotLists();

		} catch (err) {
			this.setState({
				loadToaster: true,
				toasterMessage: "Something went wrong!",
				isSubmitting: false
			});

		}
	}

	onClickDeleteScreenshotModal(data) {
		this.setState({
			showDeleteModal: true,
			deleteData: data
		});
	}

	async onCloseDeleteScreenshotModal(flag) {
		if (flag !== undefined) {
			if (flag) {
				this.setState({
					showDeleteModal: false,
					loadToaster: true,
					toasterMessage: "Deleted Successfully"
				});
				await this.getScreenshotLists();
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

	async getScreenshotLists() {

		const siteIdInput = this.props.sessionClient.web_id;
		this.setState({
			isLoading: true,
			resettingInitialValues: false
		});
		let currentUser = null;
		if (getCurrentUser() && getCurrentUser().hasOwnProperty('data')) {
			currentUser = getCurrentUser().data.data;
		}
		const headerConfig = {
			headers: {
				Authorization: currentUser && `Bearer ${currentUser.refresh_token}`,
			}
		}
		try {

			//const screenshots = await this.getScreenshots({ siteIdInput }, headerConfig);
			const screenshots = await getScreenshots({ siteIdInput }, headerConfig)
			if (screenshots.data.hasOwnProperty('data') && screenshots.data.data.length) {
				await this.createScreenshotDataTable(screenshots.data.data);
				this.setState({
					isLoading: false,
					screenshots: screenshots.data.data
				});
			} else {
				this.setState({
					isLoading: false,
					screenshots: []
				});
			}
		} catch (err) {
			this.setState({
				loadToaster: true,
				toasterMessage: "Something went Wrong!"
			});
		}
	}



	async createScreenshotDataTable(screenshotData) {
		let mainScreenshotData = [];
		screenshotData.map((e, i) => {
			const data = {
				no: ++i,
				screenshot_url: e.screenshot_url,
				report_type_name: e.report_type_name,
				report_type: e.report_type,
				shopper_name: e.shopper_name,
				shopper_top_data: e.shopper_top_data,
				top_data_order: e.top_data_order,
				screenshot_type: e.screenshot_type,
				remarks: e.remarks,
				created_at: e.created_at ? formatDate(e.created_at) : "",
				delete: e,
				edit: e
			}
			mainScreenshotData.push(data);
		});
		const userdata = await getDataTableConfig(mainScreenshotData, /* User Table */
			[
				{ accessor: 'no', Header: '#', width: 50 },
				{ accessor: 'report_type_name', Header: 'Report Type' },
				{ accessor: 'shopper_name', Header: 'Shopper' },
				{ accessor: 'screenshot_type', Header: 'Screenshot Type' },
				{
					accessor: 'shopper_top_data', Header: 'Shopper Top Data',
					Cell: ({ value }) => {
						if (isValidHttpUrl(value)) {
							return <a href={value} style={{ cursor: "pointer" }} className="" target="_blank"> {value} </a>
						} else {
							return value
						}
					}
				},
				{ accessor: 'top_data_order', Header: 'Order No.' },
				{ accessor: 'remarks', Header: 'Remark' },
				{ accessor: 'created_at', Header: 'Created at' },
				{
					accessor: 'screenshot_url', Header: 'Download URL',
					Cell: ({ value }) => {
						return <a download href={value} style={{ cursor: "pointer" }} className="" target="_blank"> <i className="badge badge-danger fa fa-download"> </i> </a>
					}
				},
				/* { accessor: 'deleted_on', Header: 'Deleted' }, */
				{
					accessor: 'delete', Header: 'Delete', Cell: ({ value }) => {
						return !value.deleted_on ? <span style={{ cursor: "pointer" }} className="" onClick={(e) => { this.onClickDeleteScreenshotModal(value) }}> <i className="badge badge-danger fa fa-trash"> </i> </span> : "NA"
					}
				},
				{
					accessor: 'edit', Header: 'Edit', Cell: ({ value }) => {
						return <span style={{ cursor: "pointer" }} className="" onClick={(e) => { this.onClickEditScreenshotModal(value) }}> <i className="badge badge-danger fa fa-pencil"> </i> </span>
					}
				}
			]);

		this.setState({
			newScreenshotdata: userdata,
			isNewScreenshotdataLoading: false,
		});
	}

	async onChangeTopShopperData(e, setFieldValue) {

		this.setState({
			shoppersTopData: [],
			selectedShopper: e[0].value,
			resetShopperTopData: []
		})
		if (top_shopper_data[e[0].value]["data_source"] === 'db' && this.state.screenshotType === 'problem') {
			let currentUser = null;
			if (getCurrentUser() && getCurrentUser().hasOwnProperty('data')) {
				currentUser = getCurrentUser().data.data;
			}
			const headerConfig = {
				headers: {
					Authorization: currentUser && `Bearer ${currentUser.refresh_token}`,
				}
			}
			const getShopperTopDataResponse = await getShopperTopData(top_shopper_data[e[0].value].query(this.props.sessionClient.web_id, convertDateTOLocale(this.state.startDate), convertDateTOLocale(this.state.endDate)), headerConfig)
			if (getShopperTopDataResponse.data.data.length) {
				this.setState({
					shoppersTopData: getShopperTopDataResponse.data.data,
					selectedShopper: e[0].value,
					showAdwareShopperInjectionTypeDropdown: true,
					showAdwareShopperSequenceNumberDropdown: true,
					showShopperInjectionTypeTextFieldCustomData: false
				})
			} else {
				this.setState({
					shoppersTopData: getShopperTopDataResponse.data.data,
					selectedShopper: e[0].value,
					showAdwareShopperInjectionTypeDropdown: true,
					showAdwareShopperSequenceNumberDropdown: true,
					showShopperInjectionTypeTextFieldCustomData: true
				})
			}
		} else if (top_shopper_data[e[0].value]["data_source"] === 'static' && this.state.screenshotType === 'problem') {
			this.setState({
				shoppersTopData: top_shopper_data[e[0].value]["data"],
				selectedShopper: e[0].value,
				showAdwareShopperInjectionTypeDropdown: true,
				showAdwareShopperSequenceNumberDropdown: true,
				showShopperInjectionTypeTextFieldCustomData: false
			})
		} else {
			this.setState({
				showAdwareShopperInjectionTypeDropdown: false,
				showAdwareShopperSequenceNumberDropdown: false,
				showShopperInjectionTypeTextFieldCustomData: false
			})
		}

		/* 		if (e[0].value === 7) {
					this.setState({
						selectedShopper: e[0].value,
						showAdwareShopperInjectionTypeDropdown: true,
						showAdwareShopperSequenceNumberDropdown: true
					})
				} else {
					this.setState({
						selectedShopper: e[0].value,
						showAdwareShopperInjectionTypeDropdown: false,
						showAdwareShopperSequenceNumberDropdown: false
					})
					setFieldValue('shopper_top_data', null);
					setFieldValue('top_data_order', null);
				} */

		setFieldValue('shopper_top_data', null);
		setFieldValue('shoppers', JSON.stringify({
			name: e[0].label,
			id: e[0].value
		}));
		if (e[0].value === 2) {
			setFieldValue('shopper_top_data_custom_value', 686)
		} else {
			setFieldValue('shopper_top_data_custom_value', "")
		}
	}
	render() {
		return (
			<div className="container-fluid">
				<div className="row clearfix">
					<div className="col-lg-6 col-md-4">
						<PageHeader
							HeaderText="List of Screenshot"
							Breadcrumb={[{ name: "List of Screenshot" }]}
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
							<div className="body pt-0" id="addSreenshotBody">
								<Formik
									validate={(values) => {
										let errors = {};

										if (!values.report_type) {
											errors.report_type = 'Required';
										}
										if (!values.shoppers) {
											errors.shoppers = 'Required';
										}
										if (!values.screenshot_type) {
											errors.screenshot_type = 'Required';
										}

										if (this.state.screenshotType === 'problem' && this.state.selectedShopper !== '' && top_shopper_data.hasOwnProperty(this.state.selectedShopper) && !values.shopper_top_data && this.state.showAdwareShopperInjectionTypeDropdown && top_shopper_data[this.state.selectedShopper]["showShopperTopData"] === true) {
											errors.shopper_top_data = 'Required';
										}
										if (this.state.screenshotType === 'problem' && this.state.selectedShopper !== '' && top_shopper_data.hasOwnProperty(this.state.selectedShopper) && !values.top_data_order && this.state.showAdwareShopperSequenceNumberDropdown && top_shopper_data[this.state.selectedShopper]["showOrderSequence"] === true) {
											errors.top_data_order = 'Required';
										}

										if (this.state.showShopperInjectionTypeTextFieldCustomData && !values.shopper_top_data_custom_value) {
											errors.shopper_top_data_custom_value = 'Required';
										}
										return errors;
									}}
									initialValues={this.state.formField}
									onSubmit={async (values, { setSubmitting }) => {
										if (values.report_type.length > 0 && this.state.fileUploaded !== false) {
											if (this.state.showShopperInjectionTypeTextFieldCustomData && !isString(values.shopper_top_data) && values.shopper_top_data.value === undefined) {
												values.shopper_top_data.value = values.shopper_top_data_custom_value
											} else {
												this.setState({
													showShopperInjectionTypeTextFieldCustomData: false
												})
											}
											if (!isString(values.shopper_top_data)) {
												values.shopper_top_data = JSON.stringify(values.shopper_top_data)
											}
											const data = {
												"report_type": values.report_type,
												"site_id": values.site_id,
												"remarks": values.remarks,
												"from_date": convertDateTOLocale(this.state.startDate),
												"to_date": convertDateTOLocale(this.state.endDate),
												"screenshots": values.screenshots,
												"shoppers": values.shoppers,
												"screenshot_type": values.screenshot_type,
												"shopper_top_data": values.shopper_top_data !== "" ? values.shopper_top_data : null,
												"top_data_order": values.top_data_order !== undefined && values.top_data_order !== "" ? values.top_data_order : null,
												"deleted_on": null,
												"client_details": this.props.sessionClient,
												"updated_at": new Date()
											}
											await this.onUploadScreenshot(data);
										} else {
											this.setState({
												loadToaster: true,
												toasterMessage: "Please Choose File",
											});
										}
										setSubmitting(false);
									}}
								>
									{({ touched, errors, isSubmitting, handleSubmit, setFieldValue }) => (
										<Form onSubmit={(e) => {
											e.preventDefault();
											handleSubmit()
										}}>
											<div className="row">
												<div className="form-group col-md-4 col-lg-4 mt-0">
													<h6 className="mt-0" >Report Date</h6>
													<DateRange name="date_range" startDate={this.state.startDate} endDate={this.state.endDate} onDateRangeChange={(item) => this.handleDateChange(item)} />
												</div>
												<div className="form-group col-md-4 col-lg-4">
													<label htmlFor="report_type">Screenshots for</label>
													<Select
														placeholder="Select Report Type"
														name="report_type"
														className={`col-md-12 form-control ${touched.report_type && errors.report_type ? "is-invalid" : ""}`}
														valueField="value"
														labelField="label"
														searchBy="label"
														searchable
														style={{ paddingLeft: "7px", borderRadius: "5px" }}
														multi={false}
														closeOnSelect={true}
														backspaceDelete={true}
														clearOnSelect={true}
														options={this.state.reportTypeOptions}
														onChange={(e) => {
															setFieldValue('report_type', JSON.stringify({
																name: e[0].label,
																type: e[0].value
															}));
														}}
													/>

													<ErrorMessage
														component="div"
														name="report_type"
														className="invalid-feedback"
													/>
												</div>
												<div className="form-group col-md-4 col-lg-4">
													<label htmlFor="screenshot_type">Screenshot Type</label>
													<Select
														placeholder="Select Screenshot Type"
														name="screenshot_type"
														className={`col-md-12 form-control ${touched.screenshot_type && errors.screenshot_type ? "is-invalid" : ""}`}
														valueField="value"
														labelField="label"
														searchBy="label"
														searchable
														style={{ paddingLeft: "7px", borderRadius: "5px" }}
														multi={false}
														closeOnSelect={true}
														backspaceDelete={true}
														clearOnSelect={true}
														options={this.state.screenshotTypeOptions}
														onChange={(e) => {
															this.setState({
																screenshotType: e[0].value
															})
															if (e[0].value === 'solution') {
																this.setState({
																	showShopperInjectionTypeTextFieldCustomData: false
																})
																setFieldValue('shopper_top_data', null);
																setFieldValue('top_data_order', null);
															}
															setFieldValue('screenshot_type', JSON.stringify({
																name: e[0].label,
																type: e[0].value
															}));
														}}
													/>

													<ErrorMessage
														component="div"
														name="screenshot_type"
														className="invalid-feedback"
													/>
												</div>

											</div>

											<div className="row">
												<div className="form-group col-md-4 col-lg-4">
													<label htmlFor="remarks">Remark</label>
													<Field
														type="text"
														name="remarks"
														placeholder="Enter Remark"
														className={`form-control ${touched.remarks && errors.remarks ? "is-invalid" : ""
															}`}
													/>
													<ErrorMessage
														component="div"
														name="remarks"
														className="invalid-feedback"
													/>
												</div>

												<div className="form-group col-md-4 col-lg-4">
													<label htmlFor="shoppers">Shoppers</label>
													<Select
														placeholder="Select Shopper"
														name="shoppers"
														className={`col-md-12 form-control ${touched.shoppers && errors.shoppers ? "is-invalid" : ""}`}
														valueField="value"
														labelField="label"
														searchBy="label"
														searchable
														style={{ paddingLeft: "7px", borderRadius: "5px" }}
														multi={false}
														closeOnSelect={true}
														backspaceDelete={true}
														clearOnSelect={true}
														options={this.state.shoppersOptions}
														onChange={async (e) => {
															await this.onChangeTopShopperData(e, setFieldValue)
														}}
													/>

													<ErrorMessage
														component="div"
														name="shoppers"
														className="invalid-feedback"
													/>
												</div>
												{this.state.selectedShopper !== '' && this.state.screenshotType === 'problem' && top_shopper_data.hasOwnProperty(this.state.selectedShopper) && <>
													<div className={this.state.showAdwareShopperInjectionTypeDropdown ? "form-group col-md-4 col-lg-4" : "form-group col-md-4 col-lg-4 d-none"}>
														<label htmlFor="shopper_top_data">Shopper Top Data Type</label>
														<Select
															placeholder="Select Shopper Top Data Type"
															name="shopper_top_data"
															className={`col-md-12 form-control ${touched.shopper_top_data && errors.shopper_top_data ? "is-invalid" : ""}`}
															valueField="label"
															labelField="label"
															searchBy="label"
															searchable
															create={true}
															onCreateNew={(c) => {
																this.setState({
																	showShopperInjectionTypeTextFieldCustomData: true
																})
															}}
															style={{ paddingLeft: "7px", borderRadius: "5px" }}
															multi={false}
															closeOnSelect={true}
															backspaceDelete={true}
															clearOnSelect={true}
															values={this.state.resetShopperTopData}
															options={this.state.shoppersTopData}
															onChange={(e) => {
																if (e && e.length && e[0].hasOwnProperty('label')) {
																	setFieldValue('shopper_top_data', {
																		name: e[0].label,
																		value: e[0].value
																	});
																} else {
																	setFieldValue('shopper_top_data', null);
																}
															}}
														/>

														<ErrorMessage
															component="div"
															name="shopper_top_data"
															className="invalid-feedback"
														/>
														<span className="text-muted industryAvg">If not found then please add new one using the same dropdown as text field</span>
													</div>
												</>
												}

												{this.state.selectedShopper !== '' && this.state.screenshotType === 'problem' && top_shopper_data.hasOwnProperty(this.state.selectedShopper) && <>
													<div className={this.state.showShopperInjectionTypeTextFieldCustomData ? "form-group col-md-4 col-lg-4" : "form-group col-md-4 col-lg-4 d-none"}>
														<label htmlFor="shopper_top_data_custom_value">Top Data Value</label>
														<Field
															type="text"
															name="shopper_top_data_custom_value"
															placeholder="Enter Top Data Value"
															className={`form-control ${touched.shopper_top_data_custom_value && errors.shopper_top_data_custom_value ? "is-invalid" : ""
																}`}
														/>
														{this.state.selectedShopper === 2 ?
															<span className="text-muted industryAvg">Time in Seconds</span>
															: ""
														}
														<ErrorMessage
															component="div"
															name="shopper_top_data_custom_value"
															className="invalid-feedback"
														/>
													</div>
												</>
												}

												{this.state.selectedShopper !== '' && this.state.screenshotType === 'problem' && top_shopper_data.hasOwnProperty(this.state.selectedShopper) && top_shopper_data[this.state.selectedShopper]["showOrderSequence"] === true && top_shopper_data[this.state.selectedShopper]["showShopperTopData"] === true && <>
													<div className={this.state.showAdwareShopperSequenceNumberDropdown ? "form-group col-md-4 col-lg-4" : "form-group col-md-4 col-lg-4 d-none"}>
														<label htmlFor="top_data_order">Sequence Number</label>
														<Select
															placeholder="Select Sequence Number"
															name="top_data_order"
															className={`col-md-12 form-control ${touched.top_data_order && errors.top_data_order ? "is-invalid" : ""}`}
															valueField="value"
															labelField="label"
															searchBy="label"
															searchable
															style={{ paddingLeft: "7px", borderRadius: "5px" }}
															multi={false}
															closeOnSelect={true}
															backspaceDelete={true}
															clearOnSelect={true}
															options={this.state.adwareShopperSequenceNumber}
															onChange={(e) => {
																setFieldValue('top_data_order', JSON.stringify({
																	name: e[0].label,
																	value: e[0].value
																}));
															}}
														/>

														<ErrorMessage
															component="div"
															name="top_data_order"
															className="invalid-feedback"
														/>
													</div>
												</>
												}
												<div className="form-group col-md-4 col-lg-4">
													<label htmlFor="screenshots">Upload Image</label>
													<input id="screenshots" name="screenshots" type="file" onChange={(event) => {
														this.setState({
															fileUploaded: true
														})
														setFieldValue("screenshots", event.currentTarget.files[0]);
													}} />
													<ErrorMessage
														component="div"
														name="screenshots"
														className="invalid-feedback"
													/>
												</div>

											</div>
											<div className="row justify-content-center">
												<button
													type="submit"
													className="btn btn-primary btn-block w-25 mr-4"
													disabled={this.state.isSubmitting || isSubmitting}
												>
													{this.state.isSubmitting || isSubmitting ? "Please wait..." : "Upload Screenshot"}

												</button>
											</div>
										</Form>
									)}
								</Formik>
								<RefreshButton customCSS={{ float: "right", marginTop: "5px", marginRight: "15px", verticalAlign: "-webkit-baseline-middle", verticalAlign: "baseline-middle" }} handleOnRefreshData={() => this.handleOnRefreshData()} />
								{!this.state.isLoading &&
									<div className="main-content body table-responsive scrollableUserTableFixedHeader cardScrollBar m-r-5 clearfix" style={{ overflow: "scroll" }}>

										{/* Add DataTable Here 
                                        */}
										{this.state.screenshots.length > 0 && !this.state.isNewScreenshotdataLoading ?
											<DataTable data={this.state.newScreenshotdata.Dataset} columns={this.state.newScreenshotdata.columnConfig} searchBoxStyle={false} />
											:
											<div className="row no_data_row p-2">
												<div className="col-md-12 col-lg-12 no_data_avl_md12">
													<h3 className="badge no_data_available">No Screenshots Available</h3>
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

				<EditScreenshotModal
					key={"EditScreenshotModal"}
					size={"lg"}
					title={"Edit Screenshot"}
					data={this.state.editModalData}
					show={this.state.showEditScreenshotModal}
					onClose={(flag) => this.onCloseEditScreenshotModal(flag)}
				/>


				<DeleteScreenshotModal
					key={"DeleteReportModal_002"}
					size={"lg"}
					title={"Delete User"}
					data={this.state.deleteData}
					show={this.state.showDeleteModal}
					onClose={(flag) => this.onCloseDeleteScreenshotModal(flag)}
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
	shopperRecord: websiteRecordReducer.shopperRecord,
	isLoggedin: loginReducer.isLoggedin
});

export default connect(mapStateToProps, {
	websiteRecordAction,
	onPressSideMenuTab,
	onLoggedin
})(ScreenshotManagement);