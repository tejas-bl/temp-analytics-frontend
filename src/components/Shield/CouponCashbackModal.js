import React from "react";
import { Button, Modal } from "react-bootstrap";
import EngageTop5CouponsCashbackCard from "../Engage/EngageTop5CouponsCashbackCard";
import ExtensionShopperTopCouponsCashbackCard from "../Engage/ExtensionShopperTopCouponsCashbackCard";
class CouponCashbackModal extends React.Component {
    render() {
        const { show , title, size ,onClose , couponCashData, extensionShopperCashbackCoupons } = this.props;

        return (
            <Modal size={size} show={show} onHide={onClose}>
                <Modal.Body>
                    <div className="couponCashMainDiv">
                    <ExtensionShopperTopCouponsCashbackCard className="dbCard" extensionShopperCashbackCoupons={extensionShopperCashbackCoupons}/>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default CouponCashbackModal;