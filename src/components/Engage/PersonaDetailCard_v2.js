import React from "react";
import PersonaBriefDetailCard_v2 from "./PersonaBriefDetailCard_v2";
import PersonaMetricsCard from './PersonaMetricsCard';
import PersonaOverviewCard from './PersonaOverviewCard';
import PersonaSettingsCard from './PersonaSettingsCard';
import EngageSplitLogsCard from "./EngageSplitLogsCard";
import PersonaSettingCard from "./PromoBoxManagement/EngagePersonaDetailSettingCard";
import EngageTopCodesCard from "./EngageTopCodesCard";
import EngageTopPublisherWcCard from "./EngageTopPublisherWcCard";
import Loader from "../../helper/Loader";
import WrongCouponMetrics from "./prePhase/WrongCoupon/WrongCouponMetrics";
import AffiliatePayoutLostExtensionShopper from "./prePhase/ExtensionShopper/AffiliatePayoutLostExtensionShopper";
import CouponRunnerShopperImpact from "./prePhase/CouponRunnerShopper/CouponRunnerShopperImpact";
import WhynotShopperImpact from "./prePhase/WhynotShopper/WhynotShopperImpact";
//import RecycleAffiliateSessionsExtensionShopper from "./prePhase/ExtensionShopper/RecycleAffiliateSessionsExtensionShopper";
import WrongCouponImpact from "./prePhase/WrongCoupon/WrongCouponImpact";
import EngageTopCouponsCashbackCard from "./EngageTopCouponsCashbackCard";
import AttributeHijackingExtensionShopper from "./prePhase/ExtensionShopper/AttributeHijackingExtensionShopper";
import ShieldDashboardMainCard from "../Shield/shield-dashboard-main-card";
import MaliciousScriptCountsCard from "../Shield/MaliciousScriptCountsCard";
import SessionProtectedCard from "../Shield/SessionProtectedCard";
import ShieldRecoveredRevenue from "../Shield/ShieldRecoveredRevenue";
import ShieldProtectedAgainstCard from "../Shield/ShieldProtectedAgainstCard";
import ShieldMetricTableCard from "../Shield/ShieldMetricTableCard";
import TopInjectionsByType from "../Shield/TopInjectionsByType";
import TopFiveMaliciousScript from "../Shield/TopFiveMaliciousScript";
import SessionAttributionHijackingSourceFlow from "./Dashboard/SessionAttributionHijackingSourceFlow";
import EngageExtensionPublisherBreakdown from "./EngageExtensionPublisherBreakdown";
import ExtensionShopperTopCouponsCashbackCard from "./ExtensionShopperTopCouponsCashbackCard";
import HesitantShopperTopUserDropOff from "./HesitantShopperTopUserDropOff";
import HesitantShopperTriggerTimings from "./HesitantShopperTriggerTimings";
import CouponQualityMetrics from "./CouponQualityMetrics";
class PersonaDetailCard_v2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      promoCode: "",
    }
    this.handlePromoCodeChange = this.handlePromoCodeChange.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
  }

  handlePromoCodeChange(value) {
    this.setState({
      promoCode: value
    });
  }

  handleMessageChange() {
    this.props.handleMessageChange();
  }

  render() {
    return (<div className="d-flex flex-wrap">
      {this.props.singlePersonaData.personaShortCode !== 'shield' &&
        <>
          <div className="col-lg-12 col-md-12">
            <PersonaBriefDetailCard_v2 locationObject={this.props.locationObject} data={this.props.singlePersonaData} impactData={this.props.singlePersonaData.hasOwnProperty('impactData') && this.props.singlePersonaData.impactData} />
          </div>
          <div className="col-lg-6 col-md-6">
            <PersonaOverviewCard locationObject={this.props.locationObject} data={this.props.singlePersonaData.hasOwnProperty('personaOverview') && this.props.singlePersonaData.personaOverview} />
          </div>

          <div className="col-lg-6 col-md-6">
            <PersonaMetricsCard locationObject={this.props.locationObject} platform={this.props.platform} currency={this.props.currency} personaData={this.props.singlePersonaData} data={this.props.singlePersonaData.personaMetrics} />
          </div>
        </>
      }
      {this.props.singlePersonaData.personaShortCode === 'ti3' &&
        <>
          <div className="col-lg-6 col-md-6">
            <HesitantShopperTopUserDropOff locationObject={this.props.locationObject} hesitantTopDropoffPages={this.props.singlePersonaData.hasOwnProperty('hesitantTopDropoffPages') && this.props.singlePersonaData.hesitantTopDropoffPages} />
          </div>
          <div className="col-lg-6 col-md-6">
            <HesitantShopperTriggerTimings locationObject={this.props.locationObject} hesitantTriggerTimings={this.props.singlePersonaData.hasOwnProperty('hesitantTriggerTimings') && this.props.singlePersonaData.hesitantTriggerTimings} />
          </div>
        </>
      }
      {this.props.singlePersonaData.personaShortCode === 'shield' && this.props.singlePersonaData.personaPhase === 'live' &&
        <>
          <div className="col-lg-12 col-md-12">
            <PersonaBriefDetailCard_v2 locationObject={this.props.locationObject} data={this.props.singlePersonaData} impactData={this.props.singlePersonaData.hasOwnProperty('impactData') && this.props.singlePersonaData.impactData} />
          </div>
          <div className="col-lg-12 col-md-12">
            <PersonaOverviewCard locationObject={this.props.locationObject} data={this.props.singlePersonaData.hasOwnProperty('personaOverview') && this.props.singlePersonaData.personaOverview} />
          </div>
          <div className="col-lg-3 col-md-3">
            <div key={`CR_Lift__div_1`}>
              <ShieldRecoveredRevenue
                locationObject={this.props.locationObject}
                index={1}
                key={"CR_Lift_shield1"}
                Heading={[<h6 key={"CR_Lift__h6_1"}>CR LIFT</h6>]}
                Money={this.props.singlePersonaData.conversionLift !== 0 ? [<h3 key={"CR_Lift__h3_1"}><strong>{this.props.singlePersonaData.conversionLift}</strong></h3>] : 0}
                industryStd={this.props.singlePersonaData.industryStd}
                // PerText={(compareConversionLift > 0) ? [<div key={`CR_Lift__perText_${i}`}><span className="badge badge-warning"> <strong>{`${compareConversionLift}% Lift `} </strong> </span> <span> compared to {[<span className="smallText pb-0" key={`CR_Lift__smallText_${i}`}>{differenceInDays(this.props.singlePersonaData.endDate, this.props.singlePersonaData.startDate) + 1} days</span>]}</span></div>] : [<span key={`CR_Lift__no_data_${i}`} className="badge badge-info">No Lift data Available</span>]}
                PerText={false}
                Days=""
                isRandomUpdate={false}
                // Data={data.sparklineData}
                mainData={[1, 4, 1, 3, 7, 1]}
                chartColor={"#769ccd"}
                ContainerclassName="col-lg-12 col-md-12 col-sm-12 p-0"
                alignText="text-left"
                BlockHeight={70}
              />
            </div>
          </div>

          <div className="col-lg-3 col-md-3">
            <div key={`RPS_Lift__div_1`}>
              <ShieldRecoveredRevenue
                locationObject={this.props.locationObject}
                index={2}
                key={"RPS_LIFT_1"}
                Heading={[<h6 key={"RPS_LIFTh6_1"}>RPS LIFT</h6>]}
                Money={this.props.singlePersonaData.revenuePerSessionLift !== 0 ? [<h3 key={"RPS_LIFTh3_1"}><strong>{this.props.singlePersonaData.revenuePerSessionLift}</strong></h3>] : 0}
                industryStd={this.props.singlePersonaData.industryStd}
                PerText={false}
                Days=""
                isRandomUpdate={false}
                mainData={[1, 4, 1, 3, 7, 1]}
                chartColor={"#769ccd"}
                ContainerclassName="col-lg-12 col-md-12 col-sm-12 p-0"
                alignText="text-left"
                BlockHeight={70}
              />
            </div>
          </div>

          <div className="col-lg-6 col-md-6">
            <div key={`shield_div_1`}>
              <ShieldRecoveredRevenue
                locationObject={this.props.locationObject}
                index={3}
                key={`shield_recover_rev_1`}
                Heading={[<h6 key={"shield_recover_rev_h61"}>Recovered Revenue</h6>]}
                Money={this.props.singlePersonaData.recoveredRevenue !== 0 ? [<h3 className="pb-0" key={"shield_recover_rev_h31"}><strong>{parseFloat(this.props.singlePersonaData.recoveredRevenue).toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 })}</strong></h3>] : 0}
                PerText="How was it calculated?"
                industryStd={this.props.singlePersonaData.industryStd}
                Days={[<span className="smallText pb-0" key={"shield_recover_rev_span1"}>({this.props.numberOfDays} days)</span>]}
                isRandomUpdate={false}
                mainData={[1, 4, 1, 3, 7, 1]}
                chartColor={"#769ccd"}
                ContainerclassName="col-lg-12 col-md-12 col-sm-12 p-0"
                alignText="text-center"
                BlockHeight={this.props.singlePersonaData.recoveredRevenue !== 0 ? 25 : 40}
              />
            </div>
          </div>
          <div className="col-lg-4 col-md-4 col-md-4 shield_100_card_div">
            <ShieldDashboardMainCard locationObject={this.props.locationObject} currency={this.props.currency} />
          </div>
          <div className="col-lg-8 col-md-8 p-0">
            <ShieldMetricTableCard locationObject={this.props.locationObject} platform={this.props.platform} industryStd={this.props.singlePersonaData.industryStd} data={this.props.singlePersonaData.metricsData} />
          </div>

          <div className="col-lg-6 col-md-6 col-md-6 shield_100_card_div mt-4">
            <MaliciousScriptCountsCard
              locationObject={this.props.locationObject}
              topMaliciousScriptsLoading={false}
              topMaliciousScripts={this.props.singlePersonaData.topMaliciousScripts}
              index="1"
              key={"maliciousScriptDataKey1"}
              noCalc={true}
              Days=""
              mainData={[1, 4, 1, 3, 7, 1]}
              chartColor={"#769ccd"}
              isRandomUpdate={false}
              ContainerClass="col-lg-12 col-md-12 col-sm-12 p-0"
              alignText="text-center"
              BlockHeight={88}
            />
          </div>
          <div className="col-lg-6 col-md-6 col-md-6 shield_100_card_div mt-4">
            <SessionProtectedCard
              locationObject={this.props.locationObject}
              protectedSessionsLoading={false}
              protectedSessions={this.props.singlePersonaData.protectedSessions}
              index={"1"}
              key={"sessionProtectedDataKey1"}
              noCalc={true}
              Days=""
              mainData={[1, 4, 1, 3, 7, 1]}
              chartColor={"#769ccd"}
              isRandomUpdate={false}
              ContainerClass="col-lg-6 col-md-6 col-sm-6 p-0"
              alignText="text-center"
              BlockHeight={88}
            />
          </div>

          <div className="col-lg-6 col-md-6">
            <TopInjectionsByType locationObject={this.props.locationObject} className="dbCard" topInjectionTypes={this.props.topInjectionTypes} />
          </div>

          <div className="col-lg-6 col-md-6">
            <TopFiveMaliciousScript locationObject={this.props.locationObject} className="dbCard" topMaliciousPages={!this.state.topMaliciousPagesLoading && this.props.topMaliciousPages} />
          </div>

        </>}

      {this.props.singlePersonaData.personaShortCode === 'shield' && this.props.singlePersonaData.personaPhase !== 'live' &&
        <>
          <div className="col-lg-12 col-md-12">
            <PersonaBriefDetailCard_v2 locationObject={this.props.locationObject} data={this.props.singlePersonaData} impactData={this.props.singlePersonaData.hasOwnProperty('impactData') && this.props.singlePersonaData.impactData} />
          </div>
          <div className="col-lg-12 col-md-12">
            <PersonaOverviewCard locationObject={this.props.locationObject} data={this.props.singlePersonaData.hasOwnProperty('personaOverview') && this.props.singlePersonaData.personaOverview} />
          </div>
          <div className="col-lg-3 col-md-3">
            <div key={`CR_Lift__div_1`}>
              <ShieldRecoveredRevenue
                locationObject={this.props.locationObject}
                index={1}
                key={"CR_Lift_shield1"}
                Heading={[<h6 key={"CR_Lift__h6_1"}>CR LIFT</h6>]}
                Money={this.props.singlePersonaData.conversionLift !== 0 ? [<h3 key={"CR_Lift__h3_1"}><strong>{this.props.singlePersonaData.conversionLift}</strong></h3>] : 0}
                industryStd={this.props.singlePersonaData.industryStd}
                // PerText={(compareConversionLift > 0) ? [<div key={`CR_Lift__perText_${i}`}><span className="badge badge-warning"> <strong>{`${compareConversionLift}% Lift `} </strong> </span> <span> compared to {[<span className="smallText pb-0" key={`CR_Lift__smallText_${i}`}>{differenceInDays(this.props.singlePersonaData.endDate, this.props.singlePersonaData.startDate) + 1} days</span>]}</span></div>] : [<span key={`CR_Lift__no_data_${i}`} className="badge badge-info">No Lift data Available</span>]}
                PerText={false}
                Days=""
                isRandomUpdate={false}
                // Data={data.sparklineData}
                mainData={[1, 4, 1, 3, 7, 1]}
                chartColor={"#769ccd"}
                ContainerclassName="col-lg-12 col-md-12 col-sm-12 p-0"
                alignText="text-left"
                BlockHeight={70}
              />
            </div>
          </div>

          <div className="col-lg-3 col-md-3">
            <div key={`RPS_Lift__div_1`}>
              <ShieldRecoveredRevenue
                locationObject={this.props.locationObject}
                index={2}
                key={"RPS_LIFT_1"}
                Heading={[<h6 key={"RPS_LIFTh6_1"}>RPS LIFT</h6>]}
                Money={this.props.singlePersonaData.revenuePerSessionLift !== 0 ? [<h3 key={"RPS_LIFTh3_1"}><strong>{this.props.singlePersonaData.revenuePerSessionLift}</strong></h3>] : 0}
                industryStd={this.props.singlePersonaData.industryStd}
                PerText={false}
                Days=""
                isRandomUpdate={false}
                mainData={[1, 4, 1, 3, 7, 1]}
                chartColor={"#769ccd"}
                ContainerclassName="col-lg-12 col-md-12 col-sm-12 p-0"
                alignText="text-left"
                BlockHeight={70}
              />
            </div>
          </div>

          <div className="col-lg-6 col-md-6">
            <div key={`shield_div_1`}>
              <ShieldRecoveredRevenue
                locationObject={this.props.locationObject}
                index={3}
                key={`shield_recover_rev_1`}
                Heading={[<h6 key={"shield_recover_rev_h61"}>Recovered Revenue</h6>]}
                Money={this.props.singlePersonaData.recoveredRevenue !== 0 ? [<h3 className="pb-0" key={"shield_recover_rev_h31"}><strong>{parseFloat(this.props.singlePersonaData.recoveredRevenue).toLocaleString('en-US', { style: 'currency', currency: this.props.currency, minimumFractionDigits: 0, maximumFractionDigits: 0 })}</strong></h3>] : 0}
                PerText="How was it calculated?"
                industryStd={this.props.singlePersonaData.industryStd}
                Days={[<span className="smallText pb-0" key={"shield_recover_rev_span1"}>({this.props.numberOfDays} days)</span>]}
                isRandomUpdate={false}
                mainData={[1, 4, 1, 3, 7, 1]}
                chartColor={"#769ccd"}
                ContainerclassName="col-lg-12 col-md-12 col-sm-12 p-0"
                alignText="text-center"
                BlockHeight={this.props.singlePersonaData.recoveredRevenue !== 0 ? 25 : 40}
              />
            </div>
          </div>
          <div className="col-lg-3 col-md-3">
            <ShieldProtectedAgainstCard locationObject={this.props.locationObject} extensionShopperCashbackCoupons={this.props.extensionShopperCashbackCoupons !== false && this.props.extensionShopperCashbackCoupons} couponCashData={this.props.couponCashData} abData={this.props.abData} className="dbCard" />
          </div>
          <div className="col-lg-9 col-md-9 p-0">
            <ShieldMetricTableCard locationObject={this.props.locationObject} currency={this.props.currency} platform={this.props.platform} industryStd={this.props.singlePersonaData.industryStd} data={this.props.singlePersonaData.metricsData} />
          </div>

          <div className="col-lg-6 col-md-6">
            <TopInjectionsByType locationObject={this.props.locationObject} className="dbCard" topInjectionTypes={this.props.topInjectionTypes} />
          </div>
          <div className="col-lg-6 col-md-6">
            <TopFiveMaliciousScript locationObject={this.props.locationObject} className="dbCard topFiveMaliciousScript" topMaliciousPages={!this.state.topMaliciousPagesLoading && this.props.topMaliciousPages} />
          </div>
        </>
      }

      {(this.props.singlePersonaData.personaShortCode === 'epr' || this.props.singlePersonaData.personaShortCode === 'e-ei' || this.props.singlePersonaData.personaShortCode === 'wc') && <>
        <div className="col-lg-12 col-md-12">
          <SessionAttributionHijackingSourceFlow locationObject={this.props.locationObject} sessionHijackSourceFlow={this.props.singlePersonaData.hasOwnProperty('sessionHijackSourceFlow') && this.props.singlePersonaData.sessionHijackSourceFlow} />
        </div>
      </>}

      {this.props.singlePersonaData.personaShortCode === 'epr' && this.props.singlePersonaData.personaStatus === false &&
        <>
          <div className="col-lg-12 col-md-12">
            <CouponRunnerShopperImpact locationObject={this.props.locationObject} currency={this.props.currency} className="dbCard" impactData={this.props.singlePersonaData.hasOwnProperty('impactData') && this.props.singlePersonaData.impactData} />
          </div>
        </>
      }

      {this.props.singlePersonaData.personaShortCode === 'cs' && this.props.singlePersonaData.personaStatus === false &&
        <div className="col-lg-12 col-md-12">
          <WhynotShopperImpact locationObject={this.props.locationObject} currency={this.props.currency} className="dbCard" impactData={this.props.singlePersonaData.hasOwnProperty('impactData') && this.props.singlePersonaData.impactData} />
        </div>
      }
      {this.props.singlePersonaData.personaShortCode === 'wc' && this.props.singlePersonaData.personaStatus === false &&
        <>
          <div className="col-lg-6 col-md-6">
            <WrongCouponImpact locationObject={this.props.locationObject} currency={this.props.currency} className="dbCard" impactData={this.props.singlePersonaData.hasOwnProperty('impactData') && this.props.singlePersonaData.impactData} />
          </div>
          <div className="col-lg-6 col-md-6">
            <WrongCouponMetrics locationObject={this.props.locationObject} currency={this.props.currency} lassName="dbCard" impactData={this.props.singlePersonaData.hasOwnProperty('impactData') && this.props.singlePersonaData.impactData} />
          </div>
        </>
      }

      {this.props.singlePersonaData.personaShortCode === 'e-ei' && this.props.singlePersonaData.personaStatus === false &&
        <>
          <div className="col-lg-8 col-md-8">
            <AttributeHijackingExtensionShopper locationObject={this.props.locationObject} id="AttributeHijackingExtensionShopper" className="dbCard" impactData={this.props.singlePersonaData.hasOwnProperty('impactData') && this.props.singlePersonaData.impactData} />
          </div>
          <div className="col-lg-4 col-md-4">
            <AffiliatePayoutLostExtensionShopper locationObject={this.props.locationObject} id="AffiliatePayoutLostExtensionShopper" className="dbCard" impactData={this.props.singlePersonaData.hasOwnProperty('impactData') && this.props.singlePersonaData.impactData} />
          </div>
          {/*            <div className="col-lg-4 col-md-4">
            <SessionAttributionHijackingExtensionShopper id="SessionAttributionHijackingExtensionShopper" className="dbCard" impactData={this.props.singlePersonaData.hasOwnProperty('impactData') && this.props.singlePersonaData.impactData} />
          </div>

          <div className="col-lg-4 col-md-4">
            <OrderAttributionHijackingExtensionShopper id="OrderAttributionHijackingExtensionShopper" className="dbCard" impactData={this.props.singlePersonaData.hasOwnProperty('impactData') && this.props.singlePersonaData.impactData} />
          </div>
 */}
        </>
      }
      {this.props.singlePersonaData.personaShortCode === 'e-ei' &&
        <>
          <div className="col-lg-12 col-md-12">
            <ExtensionShopperTopCouponsCashbackCard locationObject={this.props.locationObject} className="dbCard" extensionShopperCashbackCoupons={this.props.extensionShopperCashbackCoupons !== false && this.props.extensionShopperCashbackCoupons} />
          </div>
          <div className="col-lg-12 col-md-12">
            <EngageExtensionPublisherBreakdown locationObject={this.props.locationObject} className="dbCard" publisherBreakdown={this.props.singlePersonaData.hasOwnProperty('extensionPublisherBreakdownData') && this.props.singlePersonaData.extensionPublisherBreakdownData} />
          </div>
        </>
      }

      {/* 
      {this.props.singlePersonaData.personaShortCode === 'e-ei' && this.props.singlePersonaData.personaStatus === false && this.props.recycleAffilaiteSessionsEEI !== false &&
          <div className="col-lg-12 col-md-12">
            <RecycleAffiliateSessionsExtensionShopper id="RecycleAffiliateSessionsExtensionShopper" className="dbCard" impactData={this.props.recycleAffilaiteSessionsEEI} />
          </div>
      } */}


      {
        <div className="col-lg-6 col-md-6">
          {this.props.singlePersonaData.personaShortCode === 'wc' && this.props.wcTopCode.hasOwnProperty('Dataset') ?
            <EngageTopCodesCard locationObject={this.props.locationObject} className="dbCard" wrongcoupondata={this.props.wcTopCode} />
            : this.props.singlePersonaData.personaShortCode !== 'wc' ? "" : <Loader width="col-md-12 col-lg-12" height="150px" />}
        </div>
      }
      {
        <div className="col-lg-6 col-md-6">
          {
            this.props.singlePersonaData.personaShortCode === 'wc' && this.props.wcTopPublisher.hasOwnProperty('Dataset') ?
              <EngageTopPublisherWcCard locationObject={this.props.locationObject} className="dbCard" wrongcouponaffilatedata={this.props.wcTopPublisher} />
              : this.props.singlePersonaData.personaShortCode !== 'wc' ? "" : <Loader width="col-md-12 col-lg-12" height="150px" />}
        </div>
      }

      {/*  {
        <div className="col-lg-6 col-md-6">
          {this.props.singlePersonaData.personaShortCode === 'wc' ?
           <CouponUsedCard className="dbCard" couponUsedData={this.props.singlePersonaData.wcCouponUsed} />
          : ""}
        </div>
      } */}

      {/*       {this.props.singlePersonaData.personaShortCode === 'wc' && this.props.singlePersonaData.hasOwnProperty('wcCheckoutPageConversionRate') ?
        <div className="col-lg-12 col-md-12">
          <CheckoutPageConversionRateCard className="dbCard" checkoutPageConversionRateData={this.props.singlePersonaData.wcCheckoutPageConversionRate} />
        </div>
        : ""}
 */}

      {this.props.singlePersonaData.personaShortCode !== 'shield' &&
        <>
          <div className="col-lg-12 col-md-12 clearfix">
            <PersonaSettingsCard locationObject={this.props.locationObject} renderPromoCode={(id) => this.props.handleSinglePersonaPromoCodeData({ id: id })} data={!this.props.singlePersonaPromoCodeData ? this.props.singlePersonaData.personaPromoCode : this.props.singlePersonaPromoCodeData.personaPromoCode} />
          </div>

          <div className="col-lg-6 col-md-6">
            <CouponQualityMetrics locationObject={this.props.locationObject} className="dbCard" couponQualityMetricsOverallScore={this.props.singlePersonaData.hasOwnProperty('couponQualityMetricsOverallScore') && this.props.singlePersonaData.couponQualityMetricsOverallScore} couponQualityMetrics={this.props.singlePersonaData.hasOwnProperty('couponQualityMetrics') && this.props.singlePersonaData.couponQualityMetrics} />
          </div>
          <div className="col-lg-6 col-md-6">
            <EngageSplitLogsCard locationObject={this.props.locationObject} persona={this.props.singlePersonaData} engagePersonaSplitList={this.props.engagePersonaSplitList} />
          </div>
          <div className="col-lg-6 col-md-6 d-none">
            <PersonaSettingCard locationObject={this.props.locationObject} handleMessageChange={this.handleMessageChange} siteId={this.props.siteId} personaId={this.props.singlePersonaData.id} engagePersonaMessages={this.props.engagePersonaMessages} promoCodeValue={this.state.promoCode} handlePromoCode={this.handlePromoCodeChange} />
          </div>
        </>
      }
    </div>)
  }
}

export default PersonaDetailCard_v2;