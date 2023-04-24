import React, { forwardRef } from 'react';
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import { Button } from 'react-bootstrap';
import styled, { keyframes } from 'styled-components';


class HighlightSection extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            runJoyRide: true,
            steps: [
                {
                    content: (
                        <div></div>
                    ),
                    locale: { skip: <strong aria-label="skip">skip</strong> },
                    placement: "left",
                    target: ".abchahahahha"
                }, {
                    content: (
                        <div></div>
                    ),
                    locale: { skip: <strong aria-label="skip">skip</strong> },
                    // placement: props.placement !== undefined ? props.placement : 'auto',
                    placement: 'top',
                    target: props.target.replace(/#/g, ".") ?? ''
                }
            ]
        }
    }

    handleJoyrideCallback = data => {
        const { action, index, status, type } = data;
        if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
            // Update state to advance the tour
            this.setState({ stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) });
        }
        else if ([STATUS.FINISHED, STATUS.SKIPPED, STATUS.PAUSED].includes(status)) {
            // Need to set our running state to false, so we can restart if we click start again.
            this.setState({ runJoyRide: false });
        }
    };

    render() {
        const Tooltip = ({
            backProps,
            continuous,
            index,
            isLastStep,
            primaryProps,
            skipProps,
            closeProps,
            step,
            tooltipProps
        }) => (
            <>
                <div {...tooltipProps} style={{ width: "300px", height: "50px", backgroundColor: "transparent" }}>
                    {step.content && <h3 className='d-none'>{step.content}</h3>}

                    {(
                        <Button {...skipProps} className='d-none'>
                            <span id="skip">close</span>
                        </Button>
                    )}
                </div>
            </>
        );


        const pulse = keyframes`
            0% {
            transform: scale(1);
            }

            55% {
            background-color: rgba(48, 48, 232, 0.9);
            transform: scale(1.6);
            }
            `;

        const BeaconButton = styled.button`
        animation: ${pulse} 1s ease-in-out infinite;
        background-color: rgba(48, 48, 232, 0.6);
        border: 0;
        border-radius: 50%;
        display: inline-block;
        height: 3rem;
        width: 3rem;
        display: none;
      `;
        const BeaconComponent = forwardRef((props, ref) => {
            return <BeaconButton ref={ref} {...props} />;
        });


        return <>
            {this.props.target && this.props.target.replace(/#/g, "") === this.props.highlightSectionId && <Joyride
                callback={(data) => this.handleJoyrideCallback(data)}
                continuous
                hideCloseButton={false}
                run={this.state.runJoyRide}
                scrollToFirstStep
                showProgress
                showSkipButton
                //debug
                steps={this.state.steps}
                stepIndex={1}
                styles={{
                    options: {
                        zIndex: 10000
                    }
                }}
                beaconComponent={BeaconComponent}
                tooltipComponent={Tooltip}
            />}
        </>
    }
}
export default HighlightSection;
