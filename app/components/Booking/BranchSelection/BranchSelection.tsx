import React from 'react';
 
import styles from './BranchSelection.module.scss';
import { MapPin } from 'lucide-react';

type Branch = {
  id: string | number;
  icon?: React.ReactNode;
  name: string;
  address: string;
};

type BranchSelectionProps = {
  branches: Branch[];
  onSelect: (branch: Branch) => void;
  categoryName?: string;
};

export const BranchSelection: React.FC<BranchSelectionProps> = ({ branches, onSelect }) => {
  return (
    <div className={styles.branchSelection}>
      <h2 className={styles.header}>
        <MapPin className={styles.headerIcon} />
        Select Bank Branch
      </h2>
      <div className={styles.branchGrid}>
        {branches.map(branch => (
          <button
            key={branch.id}
            onClick={() => onSelect(branch)}
            className={styles.branchCard}
          >
            <div className={styles.branchIcon}>{branch.icon}</div>
            <div className={styles.branchName}>{branch.name}</div>
            <div className={styles.branchAddress}>
              <MapPin className={styles.addressIcon} />
              {branch.address}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};