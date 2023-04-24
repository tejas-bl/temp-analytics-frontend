import React from "react";
import { Modal } from "react-bootstrap";

class WcAffiliateDetailsModalCard extends React.Component {
    constructor(props) {
        super(props);
        this.onCloseModal = this.onCloseModal.bind(this);
    }

    onCloseModal() {
        this.props.onClose();
    }

    render() {
        const { title, onClose, size, show } = this.props;
        return (
            /* If using graph make sure to add onEnter={this.handleLoad} see commit 0c8104697d86bd9dfd90fd340127eb21baa14699 (uat)*/
            <Modal size={size} show={show} onHide={this.onCloseModal} className="wcAffiliateDetailsModal">
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex flex-row justify-content-between flex-wrap">
                        <div className="col-lg-12 col-md-6 col-sm-12">
                            <div className="">
                                <div className="body">
                                    {/* {this.props.sourceFlowData && this.state.loadGraph && <SourceFlow graphHeight={this.props.sourceFlowData.graphHeight} sourceFlowData={this.props.sourceFlowData} title={this.props.title} id={"sourceFlow"} />} */}
                                    {this.props.data && this.props.data.length > 0 ?
                                        <div className="body table-responsive scrollableTableFixedHeader cardScrollBar m-r-5 clearfix">
                                            <table className="table table-striped tableLayoutFixed">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>{this.props.tableHeading.head1}</th>
                                                        <th>{this.props.tableHeading.head2}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    {this.props.data.map((data, i) => {
                                                        return (
                                                            <tr key={i}>
                                                                <td>{++i}</td>
                                                                <td>{data.modalColumn1}</td>
                                                                <td>{data.modalColumn2}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div> :
                                        <div className="body table-responsive" >
                                            <div className="row no_data_row p-2">
                                                <div className="col-md-12 col-lg-12 no_data_avl_md12">
                                                    <h3 className="badge no_data_available">No Data Available</h3>
                                                    <table className="table table-striped noDataAvailable">
                                                        <thead><tr><th>Code</th><th>Count</th></tr></thead>
                                                        <tbody>

                                                            <tr><td>No Data Available</td>

                                                                <td>---</td>

                                                                <td>---</td>

                                                            </tr>


                                                            <tr><td>No Data Available</td>

                                                                <td>---</td>

                                                                <td>---</td>

                                                            </tr>


                                                            <tr><td>No Data Available</td>

                                                                <td>---</td>

                                                                <td>---</td>

                                                            </tr>

                                                            <tr><td>No Data Available</td>

                                                                <td>---</td>

                                                                <td>---</td>

                                                            </tr>
                                                        </tbody></table>

                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
}




export default WcAffiliateDetailsModalCard;