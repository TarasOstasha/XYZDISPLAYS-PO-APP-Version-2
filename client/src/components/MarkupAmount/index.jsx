import React from 'react';
import { FlagFill, InfoCircleFill  } from 'react-bootstrap-icons';
import styles from './MarkupAmount.module.scss';

function MarkupAmount() {
  return (
    <div>
        <span className={styles.note}>
            <FlagFill className={styles.flag} />
            {/* <InfoCircleFill className={styles.info}  /> */}
        </span>
    </div>
  )
}

export default MarkupAmount