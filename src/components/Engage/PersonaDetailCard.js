import React from "react";
import { personaDetailCardData, personaMetricsCardData, personaOverviewCardData, personaSettingsTableData } from '../../Data/EngagePersonaData';
import PersonaBriefDetailCard from './PersonaBriefDetailCard';
import PersonaMetricsCard from './PersonaMetricsCard';
import PersonaOverviewCard from './PersonaOverviewCard';
import PersonaSettingsCard from './PersonaSettingsCard';
class PersonaDetailCard extends React.Component {
    render(){
        return(<div className="d-flex flex-wrap">
            <div className="col-lg-4 col-md-4">
                <PersonaBriefDetailCard title={this.props.title} data={personaDetailCardData}/>
              </div>
              <div className="col-lg-4 col-md-4">
                <PersonaOverviewCard data={personaOverviewCardData}  />
              </div>
              <div className="col-lg-4 col-md-4">
                <PersonaMetricsCard data={personaMetricsCardData}  />
              </div>
              <div className="col-lg-12 col-md-12 clearfix">
                <PersonaSettingsCard data={personaSettingsTableData} />
              </div>
        
        </div>)
    }
}

export default PersonaDetailCard;