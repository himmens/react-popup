// @flow
import React, { type Node } from 'react';
import TooltipHOC from './tooltip/hoc';
import styles from './app.css';

export default function App(): Node {
    const ids: Array<string> = [];
    for (let i: number = 0; i < 100; i++) {
        ids.push(i.toString(10));
    }

    return (
        <div className={styles.root}>
            {
                ids.map(id => {
                    const left: number = Math.random() * (window.innerWidth - 20);
                    const top: number = Math.random() * (window.innerHeight - 20);
                    const padding: number = 10 + Math.random() * 100;

                    return (
                        <TooltipComponent key={id} id={id} style={{ left: `${left}px`, top: `${top}px`}}>
                            <span style={{ padding: `${padding}px` }}>{`Tooltip${id}`}</span>
                        </TooltipComponent>
                    );
                })
            }
        </div>
    );
}

type ComponentProps = {
    id: string
}

function Component(props: ComponentProps): Node {
    const { id, ...otherProps } = props;

    return (
        <div {...otherProps} className={styles.component}><span>{`${id}`}</span></div>
    );
}

const TooltipComponent = TooltipHOC(Component);