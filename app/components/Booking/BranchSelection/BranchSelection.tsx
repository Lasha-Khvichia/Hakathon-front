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

export const BranchSelection: React.FC<BranchSelectionProps> = ({ branches, onSelect, categoryName }) => {
  const getBranchTitle = () => {
    if (!categoryName) return 'Select Branch';
    
    if (categoryName.includes('ბანკი') || categoryName.includes('Bank')) {
      return 'Select Bank Branch - ბანკის ფილიალის არჩევა';
    }
    if (categoryName.includes('კლინიკა') || categoryName.includes('Clinic')) {
      return 'Select Clinic Branch - კლინიკის არჩევა';
    }
    if (categoryName.includes('მომსახურების ცენტრები') || categoryName.includes('Government')) {
      return 'Select Government Office - სახელმწიფო ოფისის არჩევა';
    }
    if (categoryName.includes('ფოსტა') || categoryName.includes('Post')) {
      return 'Select Post Office - საფოსტო ოფისის არჩევა';
    }
    if (categoryName.includes('ქსელები') || categoryName.includes('Telecom')) {
      return 'Select Telecom Center - ტელეკომ ცენტრის არჩევა';
    }
    if (categoryName.includes('ავტო სერვისი') || categoryName.includes('Car Service')) {
      return 'Select Car Service - ავტოსერვისის არჩევა';
    }
    
    return 'Select Branch - ფილიალის არჩევა';
  };

  return (
    <div className={styles.branchSelection}>
      <h2 className={styles.header}>
        <MapPin className={styles.headerIcon} />
        {getBranchTitle()}
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