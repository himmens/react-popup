// @flow
import React, { Fragment, PureComponent, type Node, type ComponentType } from 'react';
import Popup from './popup';

type State = {|
    hidden: boolean,
    targetRect: ?ClientRect
|};

export default function PopupHOC<Props>(Component: ComponentType<Props>): ComponentType<$Diff<Props, { children: Node }>> {
    return class WrappedComponent extends PureComponent<*, State> {
        state = {
            hidden: true,
            targetRect: null
        };

        render(): Node {
            return (
                <Fragment>
                    <Component {...this.props} onClick={this.handleClick} />
                    {this.renderPopup()}
                </Fragment>
            );
        }

        renderPopup(): Node {
            const { children } = this.props;
            const { hidden, targetRect } = this.state;

            if (hidden) {
                return null;
            }

            return (
                <Popup targetRect={targetRect} onClose={this.handleClose}>
                    {children}
                </Popup>
            );
        }

        handleClick = (event: SyntheticEvent<HTMLElement>) => {
            const target: HTMLElement = event.currentTarget;
            const targetRect: ClientRect = target.getBoundingClientRect();
            this.setState({ hidden: false, targetRect });
        }

        handleClose = () => {
            this.setState({ hidden: true });
        };
    };
}
