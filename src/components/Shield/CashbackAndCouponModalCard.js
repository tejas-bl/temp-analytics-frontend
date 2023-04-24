import React from "react";
import { Button, Dropdown, Modal } from "react-bootstrap";

class CashbackAndCouponModalCard extends React.Component {
  render() {
    const { title, onClose, size, show } = this.props;
    return (
      <Modal size={size} show={show} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
        <p>
            Most affiliate programs prohibit the use of browser extensions to engage the customer to prevent hijacking of attribution credit. ​
        </p>
        <p>
            BrandLock customers see an increase in CR (2%-4%) and a decrease in affiliate payouts (20%-35%) on average when they block these extensions.
        </p>
        <div className="d-flex flex-row justify-content-between">

            <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="card">
                <div className="header">
                    <h2>Cashback Extensions</h2>
                    <Dropdown as="ul" className="header-dropdown">
                    <Dropdown.Toggle variant="success" as="li" id="dropdown-basic">
                        <Dropdown.Menu
                        as="ul"
                        className="dropdown-menu dropdown-menu-right"
                        >
                        <li>
                            <a>All On</a>
                        </li>
                        <li>
                            <a>All Off</a>
                        </li>
                        </Dropdown.Menu>
                    </Dropdown.Toggle>
                    </Dropdown>
                    <div className="body pl-1 pr-1">
                    <ul className="list-unstyled basic-list ng-star-inserted">
                            <li
                            key={1}
                            className= "ng-star-inserted"
                            >
                            <i className="fa fa-list me-1"></i> Block All Cash Back​
                            <a onClick={() => null }>
                                <span
                                className="badge"
                                >
                                Off
                                </span>
                            </a>
                            </li>

                            <li
                            key={1}
                            className= "ng-star-inserted"
                            >
                            <i className="fa fa-list me-1"></i> Capital One​
                            <a onClick={() => null }>
                                <span
                                className="badge"
                                >
                                Off
                                </span>
                            </a>
                            </li>


                            <li
                            key={1}
                            className= "ng-star-inserted"
                            >
                            <i className="fa fa-list me-1"></i>Capital Two
                            <a onClick={() => null }>
                                <span
                                className="badge"
                                >
                                Off
                                </span>
                            </a>
                            </li>


                            <li
                            key={1}
                            className= "ng-star-inserted"
                            >
                            <i className="fa fa-list me-1"></i> Capital Three
                            <a onClick={() => null }>
                                <span
                                className="badge"
                                >
                                Off
                                </span>
                            </a>
                            </li>
                    </ul>
                    </div>
                </div>
            </div>
        </div>

        
        <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="card">
                <div className="header">
                    <h2>Coupon Extensions​</h2>
                    <Dropdown as="ul" className="header-dropdown">
                    <Dropdown.Toggle variant="success" as="li" id="dropdown-basic">
                        <Dropdown.Menu
                        as="ul"
                        className="dropdown-menu dropdown-menu-right"
                        >
                        <li>
                            <a>All On</a>
                        </li>
                        <li>
                            <a>All Off</a>
                        </li>
                        </Dropdown.Menu>
                    </Dropdown.Toggle>
                    </Dropdown>
                    <div className="body pl-1 pr-1">
                    <ul className="list-unstyled basic-list ng-star-inserted">
                            <li
                            key={1}
                            className= "ng-star-inserted"
                            >
                            <i className="fa fa-list me-1"></i> Block All Cash Back​
                            <a onClick={() => null }>
                                <span
                                className="badge"
                                >
                                Off
                                </span>
                            </a>
                            </li>

                            <li
                            key={1}
                            className= "ng-star-inserted"
                            >
                            <i className="fa fa-list me-1"></i> Honey
                            <a onClick={() => null }>
                                <span
                                className="badge"
                                >
                                Off
                                </span>
                            </a>
                            </li>


                            <li
                            key={1}
                            className= "ng-star-inserted"
                            >
                            <i className="fa fa-list me-1"></i> WikiBuy
                            <a onClick={() => null }>
                                <span
                                className="badge"
                                >
                                Off
                                </span>
                            </a>
                            </li>


                            <li
                            key={1}
                            className= "ng-star-inserted"
                            >
                            <i className="fa fa-list me-1"></i> Coupon Three
                            <a onClick={() => null }>
                                <span
                                className="badge"
                                >
                                Off
                                </span>
                            </a>
                            </li>
                    </ul>
                    </div>
                </div>
            </div>
        </div>
      </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default CashbackAndCouponModalCard;
