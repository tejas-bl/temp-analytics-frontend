import React from "react";
import price_comparison from "../../assets/images/shield/top_injections/price_comparison.png";
import video_ads from "../../assets/images/shield/top_injections/video_ads.png";
import banner_ads from "../../assets/images/shield/top_injections/banner_ads.png";
import in_text_ads from "../../assets/images/shield/top_injections/in_text_ads.png";
import malicious_scripts from "../../assets/images/shield/top_injections/malicious_scripts.png";
import ModalImage from "react-modal-image";
import HighlightSection from "../HighlightSection";
class TopInjectionsByType extends React.Component {
    render() {
        const data = this.props.topInjectionTypes.data;
        return (
            <div className="card col-lg-12 col-md-12 TopInjectionsByType">
                <h6 className="card-title mb-0 pt-3">Top Malware Injections By Type</h6>
                <HighlightSection location={this.props.location} placement="right" highlightSectionId="TopInjectionsByType" target={this.props.locationObject.hash} />
                <div className="body">
                    <div className="row clearfix w_social3" style={{ justifyContent: "center" }}>


                        {data !== undefined && data.length > 0 ?
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Type</th>
                                        <th>Injections</th>
                                        <th>Preview</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map(function (d, i) {
                                        return (
                                            <tr key={i} className={`malware_modal_by_type malware_modal_by_type_${i}`}>
                                                <td className="icon m-b-5">

                                                    <img height="30px" alt={d.shopper_top_data} src={`${(i === 0) ? price_comparison : (i === 1) ? video_ads : (i === 2) ? banner_ads : (i === 3) ? in_text_ads : malicious_scripts}`} /></td>
                                                <td>{d.shopper_top_data}</td>
                                                <td className="number">{d.values !== null ? `${d.values}%` : "0%"}</td>
                                                <td className="number">
                                                    <div className="modalImagePersonaDiv">
                                                        {<ModalImage className="modalImagePersona"
                                                            small={`${d.screenshot_url}`}
                                                            medium={`${d.screenshot_url}`}
                                                            hideDownload={true}
                                                            hideZoom={true}
                                                        />}
                                                    </div>

                                                </td>
                                            </tr>)
                                    })
                                    }
                                </tbody>
                            </table> :

                            <div className="row no_data_row p-2" style={{ width: "100%" }}>
                                <div className="col-md-12 col-lg-12 no_data_avl_md12">
                                    <h3 className="badge no_data_available">No Data Available</h3>
                                    <table className="table table-striped noDataAvailable"><thead>  <tr>
                                        <th>#</th>
                                        <th>Type</th>
                                        <th>Injections</th>
                                        <th>Preview</th>
                                    </tr></thead><tbody>


                                            <tr>
                                                <td>---</td>
                                                <td>---</td>
                                                <td>---</td>
                                                <td>---</td>
                                            </tr>

                                            <tr>
                                                <td>---</td>
                                                <td>---</td>
                                                <td>---</td>
                                                <td>---</td>
                                            </tr>

                                            <tr>
                                                <td>---</td>
                                                <td>---</td>
                                                <td>---</td>
                                                <td>---</td>
                                            </tr>
                                            <tr>
                                                <td>---</td>
                                                <td>---</td>
                                                <td>---</td>
                                                <td>---</td>
                                            </tr>

                                        </tbody></table>

                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default TopInjectionsByType;
