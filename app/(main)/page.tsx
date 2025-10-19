import React from 'react';
import AppComponents from '../components/AppComponents/AppComponents';
import styles from './page.module.scss';


export default function Home() {
  return (
    <div className={styles.everythingWrapper}>
       <AppComponents/>
       
    </div>
  );
};