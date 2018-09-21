// @flow
import React, { Fragment, PureComponent, type Node, type ComponentType } from 'react';
import Tooltip from './tooltip';

type State = {|
    hidden: boolean,
    targetRect: ?ClientRect
|};

export default function TooltipHOC<Props>(Component: ComponentType<Props>): ComponentType<Props> {
    return class ComponentWithTooltip extends PureComponent<Props, State> {
        state = {
            hidden: true,
            targetRect: null
        };

        render(): Node {
            return (
                <Fragment>
                    <Component {...this.props} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut} />
                    {this.renderTooltip()}
                </Fragment>
            );
        }

        renderTooltip(): Node {
            const { children } = this.props;
            const { hidden, targetRect } = this.state;

            if (hidden) {
                return null;
            }

            return (
                <Tooltip targetRect={targetRect}>
                    {children}
                </Tooltip>
            );
        }

        handleMouseOver = (event: SyntheticEvent<HTMLElement>) => {
            const target: HTMLElement = event.currentTarget;
            const targetRect: ClientRect = target.getBoundingClientRect();
            this.setState({ hidden: false, targetRect });
        }

        handleMouseOut = () => {
            this.setState({ hidden: true });
        }
    };
}
