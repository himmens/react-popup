// @flow
import React, { type Node } from 'react';
import TooltipHOC from './tooltip/tooltip';
import styles from './app.css';

export default function App(): Node {
    const TooltipComponent = TooltipHOC(Component);

    return (
        <div className={styles.root}>
            <TooltipComponent onMouseOver={()=>{console.log('TooltipComponent.onMouseOver')}}>
                <span>Tooltip</span>
            </TooltipComponent>
        </div>
    );
}

function Component(): Node {
    return (
        <div className={styles.component}><span>component</span></div>
    );
}