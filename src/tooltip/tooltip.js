// @flow
import React, { PureComponent, type Node, type ComponentType } from 'react';
import ReactDOM from 'react-dom';
import styles from './tooltip.css';
import classnames from 'classnames';

// container for rendering tooltip in portal
const parent: HTMLElement = document.createElement('div');

type Props = {|
    targetRect: ?ClientRect,
    children: ?Node
|};

type State = {|
    width: number,
    height: number,
|};

export default class Tooltip extends PureComponent<Props, State> {
    state = {
        width: 0,
        height: 0
    };
    tooltip: ?HTMLElement;

    componentDidMount() {
        if (document.body) {
            document.body.appendChild(parent);
        }
        if (this.tooltip) {
            const width: number = this.tooltip.offsetWidth;
            const height: number = this.tooltip.offsetHeight;
            if (this.state.width !== width || this.state.height !== height) {
                this.setState({ width, height });
            }
        }
    }

    componentWillUnmount() {
        if (document.body) {
            document.body.removeChild(parent);
        }
    }

    render(): Node {
        const { targetRect, children } = this.props;
        const { width, height } = this.state;

        const viewportWidth: number = window.innerWidth;
        const arrSize: number = 10;

        let align: string = 'center';
        let left: number = 0;
        let top: number = 0;

        if (targetRect) {
            top = targetRect.top - height - arrSize;
            if (targetRect.left + (targetRect.width - width) * 0.5 < 0) {
                align = 'left';
                left = targetRect.left + targetRect.width * 0.5 - arrSize * 2;
            } else if (targetRect.right + (width - targetRect.width) * 0.5 > viewportWidth) {
                align = 'right';
                left = targetRect.right - width - targetRect.width * 0.5 + 2 * arrSize;
            } else {
                align = 'center';
                left = targetRect.left + (targetRect.width - width) * 0.5;
            }
        }

        const classes = classnames(styles.root, {
            [styles['is-right']]: align === 'right',
            [styles['is-left']]: align === 'left',
            [styles['is-center']]: align === 'center'
        });

        return ReactDOM.createPortal(
            (
                <div ref={this.ref} className={classes} style={{ left: `${left}px`, top: `${top}px` }}>
                    {children}
                </div>
            ),
            parent
        );
    }

    ref = (element: ?HTMLElement) => {
        this.tooltip = element;
    }
}
