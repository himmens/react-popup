// @flow
import React, { PureComponent, type Node, type ComponentType } from 'react';
import ReactDOM from 'react-dom';
import styles from './popup.css';
import classnames from 'classnames';

// container for rendering popup in portal
const parent: HTMLElement = document.createElement('div');

type Props = {|
    targetRect: ?ClientRect,
    children: ?Node,
    onClose: () => void
|};

type State = {|
    width: number,
    height: number,
|};

export default class Popup extends PureComponent<Props, State> {
    state = {
        width: 0,
        height: 0
    };
    popup: ?HTMLElement;

    componentDidMount() {
        document.addEventListener('mousedown', this.handleDocumentMouseDown);
        window.addEventListener('resize', this.handleResize);
        if (document.body) {
            document.body.appendChild(parent);
        }
        if (this.popup) {
            const width: number = this.popup.offsetWidth;
            const height: number = this.popup.offsetHeight;
            if (this.state.width !== width || this.state.height !== height) {
                this.setState({ width, height });
            }
        }
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleDocumentMouseDown);
        window.removeEventListener('resize', this.handleResize);
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
                <div ref={this.ref} className={classes} style={{ left: `${left}px`, top: `${top}px` }} onMouseDown={this.handleMouseDown} onClick={this.handleClick}>
                    {children}
                    <span className={styles.close} title='Close' onClick={this.handleClose} />
                </div>
            ),
            parent
        );
    }

    ref = (element: ?HTMLElement) => {
        this.popup = element;
    }

    close() {
        this.props.onClose();
    }

    handleClose = () => {
        this.close();
    }

    handleMouseDown = (event: Event) => {
        event.preventDefault();
        event.stopPropagation();
    }

    handleClick = (event: Event) => {
        event.stopPropagation();
    }

    handleDocumentMouseDown = (event: Event) => {
        if (!event.defaultPrevented) {
            this.close();
        }
    }

    handleResize = () => {
        this.close();
    }
}
