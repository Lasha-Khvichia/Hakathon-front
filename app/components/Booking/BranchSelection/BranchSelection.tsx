import React, { useEffect, useState } from 'react';
import axios from 'axios';
 
import styles from './BranchSelection.module.scss';
import { MapPin } from 'lucide-react';

type Branch = {
  id: string | number;
  icon?: React.ReactNode;
  name: string;
  address: string;
  image?: string | null;
};

type BranchSelectionProps = {
  branches?: Branch[];
  onSelect: (branch: Branch) => void;
  categoryId?: number | string;
  categoryName?: string;
};

export const BranchSelection: React.FC<BranchSelectionProps> = ({ branches, onSelect, categoryId }) => {
  const [localBranches, setLocalBranches] = useState<Branch[]>(branches || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // DEV fallback token (use localStorage first)
  const DEV_AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwic3ViIjoxLCJyb2xlIjoidXNlciIsImlhdCI6MTc2MDgxODQyNCwiZXhwIjoxNzYwOTA0ODI0fQ.jNXAGyjvEKu8cNDJ6m6S4uZyH6t76o-Ulw8GEihZ_tA';

  useEffect(() => {
    if (branches && branches.length > 0) {
      setLocalBranches(branches);
    }
  }, [branches]);

  useEffect(() => {
    // If categoryId provided, fetch companies from backend via Next proxy
    if (!categoryId) return;

    const fetchCompanies = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = (typeof window !== 'undefined' && localStorage.getItem('authToken')) || DEV_AUTH_TOKEN;
        const res = await axios.get(`/api/company?categoryId=${categoryId}`, {
          timeout: 5000,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const companies = res.data as Array<any>;
        const mapped: Branch[] = companies.map((c: any) => {
          // Prefer explicit image fields, but if backend provides the image under `url`, use it for the image
          const image = c.photo || c.photoUrl || c.logo || c.image || c.avatar || c.url || null;
          return {
            id: c.id,
            name: c.name,
            // Use explicit address if available; don't overwrite it with the image url
            address: c.address || c.location || 'Address not available',
            icon: '🏢',
            image,
          } as Branch;
        });
        setLocalBranches(mapped);
      } catch (err: any) {
        console.error('Failed to load companies in BranchSelection:', err?.message || err);
        setError('Failed to load branches');
        setLocalBranches(branches || []);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [categoryId, branches]);

  return (
    <div className={styles.branchSelection}>
      <h2 className={styles.header}>
        <MapPin className={styles.headerIcon} />
        Select Bank Branch
      </h2>
      <div className={styles.branchGrid}>
        {localBranches.map(branch => (
          <button
            key={branch.id}
            onClick={() => onSelect(branch)}
            className={styles.branchCard}
          >
            <div className={styles.branchIcon}>
              {branch.image ? (
                <img src={branch.image} alt={branch.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />
              ) : (
                branch.icon
              )}
            </div>
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