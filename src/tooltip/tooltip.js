// @flow
import React, { Fragment, PureComponent, type Node, type ComponentType } from 'react';
import ReactDOM from 'react-dom';
import styles from './tooltip.css';
import classnames from 'classnames';

type State = {|
    align: 'left' | 'center' | 'right',
    hidden: boolean
|};

const parent: HTMLElement = document.createElement('div');

export default function TooltipHOC<Props>(Component: ComponentType<Props>): ComponentType<Props> {
    return class Tooltip extends PureComponent<Props, State> {
        state = {
            align: 'center',
            hidden: true
        };

        tooltip = React.createRef();

        componentDidMount() {
            if (document.body) {
                document.body.appendChild(parent);
            }
        }

        componentWillUnmount() {
            if (document.body) {
                document.body.removeChild(parent);
            }
        }

        render(): Node {
            const { ...componentProps } = this.props;

            return (
                <Fragment>
                    <Component onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut} {...componentProps} />
                    {this.renderTooltip()}
                </Fragment>
            );
        }

        renderTooltip(): Node {
            const { children } = this.props;
            const { align, hidden } = this.state;

            const classes = classnames(styles.root, {
                [styles['is-right']]: align === 'right',
                [styles['is-left']]: align === 'left',
                [styles['is-center']]: align === 'center',
                [styles['is-shown']]: !hidden,
                [styles['is-hidden']]: hidden
            });

            return ReactDOM.createPortal(
                (
                    <div ref={this.tooltip} className={classes}>
                        {children}
                    </div>
                ),
                parent
            );
        }

        handleMouseOver = (event: SyntheticEvent<HTMLElement>) => {
            console.log('handleMouseOver')
            const target: HTMLElement = event.currentTarget;
            const targetRect = target.getBoundingClientRect();

            const viewportWidth: number = window.innerWidth;

            const tooltip: HTMLElement = this.tooltip.current;
            tooltip.style.display = 'block';
            const tooltipWidth: number = tooltip.offsetWidth;
            const tooltipHeight: number = tooltip.offsetHeight;

            const arrSize: number = 10;

            let left: number = 0;
            const top: number = targetRect.top - tooltipHeight - arrSize;

            if (targetRect.left + (targetRect.width - tooltipWidth) * 0.5 <= 0) { // left
                left = targetRect.left + targetRect.width * 0.5 - arrSize * 2;
                this.setState({ align: 'left', hidden: false });
            } else if (targetRect.right + (tooltipWidth - targetRect.width) * 0.5 >= viewportWidth) { // right
                left = targetRect.right - tooltipWidth - targetRect.width * 0.5 + 2 * arrSize;
                this.setState({ align: 'right', hidden: false });
            } else { // center
                left = targetRect.left + (targetRect.width - tooltipWidth) * 0.5;
                this.setState({ align: 'center', hidden: false });
            }

            tooltip.style.top = `${top}px`;
            tooltip.style.left = `${left}px`;
        }

        handleMouseOut = () => {
            console.log('handleMouseOut')
            // this.setState({ hidden: true });
            this.tooltip.current.style.display = 'none';
        }
    };
}
