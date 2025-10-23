// app/components/dev/EnvironmentStatus.tsx
"use client"

import React, { useState, useEffect } from 'react';
import { getEnvironmentInfo } from '../../utils/env-validation';

interface EnvironmentStatusProps {
  show?: boolean;
}

export const EnvironmentStatus: React.FC<EnvironmentStatusProps> = ({ show = false }) => {
  const [envInfo, setEnvInfo] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setEnvInfo(getEnvironmentInfo());
    }
  }, []);

  if (process.env.NODE_ENV !== 'development' || !envInfo) {
    return null;
  }

  const toggleVisibility = () => setIsVisible(!isVisible);

  const statusColor = envInfo.validation.isValid ? '#4ade80' : '#ef4444';
  const warningColor = envInfo.validation.warnings.length > 0 ? '#f59e0b' : '#4ade80';

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 1000,
      fontFamily: 'monospace',
      fontSize: '12px',
    }}>
      {/* Status Indicator */}
      <div
        onClick={toggleVisibility}
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          backgroundColor: statusColor,
          cursor: 'pointer',
          marginLeft: 'auto',
          marginBottom: '8px',
          border: '2px solid white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
        title={`Environment: ${envInfo.validation.isValid ? 'Valid' : 'Invalid'}`}
      />

      {/* Environment Info Panel */}
      {isVisible && (
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '12px',
          borderRadius: '8px',
          minWidth: '300px',
          maxWidth: '400px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '8px',
            borderBottom: '1px solid #333',
            paddingBottom: '8px'
          }}>
            <strong>Environment Status</strong>
            <button
              onClick={toggleVisibility}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              ×
            </button>
          </div>

          <div style={{ marginBottom: '8px' }}>
            <div>Mode: <span style={{ color: '#60a5fa' }}>{envInfo.nodeEnv}</span></div>
            <div>API URL: <span style={{ color: '#60a5fa' }}>{envInfo.apiUrl}</span></div>
            <div>Backend: <span style={{ color: '#60a5fa' }}>{envInfo.backendUrl}</span></div>
            <div>Timeout: <span style={{ color: '#60a5fa' }}>{envInfo.timeout}ms</span></div>
            <div>Gemini: <span style={{ color: envInfo.hasGeminiKey ? '#4ade80' : '#ef4444' }}>
              {envInfo.hasGeminiKey ? 'Configured' : 'Not configured'}
            </span></div>
          </div>

          <div style={{ marginBottom: '8px' }}>
            <div style={{ color: statusColor }}>
              Status: {envInfo.validation.isValid ? '✅ Valid' : '❌ Invalid'}
            </div>
            {envInfo.validation.missingVars.length > 0 && (
              <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>
                Missing: {envInfo.validation.missingVars.join(', ')}
              </div>
            )}
          </div>

          {envInfo.validation.warnings.length > 0 && (
            <div style={{ color: warningColor, fontSize: '11px' }}>
              <div>⚠️ Warnings:</div>
              {envInfo.validation.warnings.map((warning: string, i: number) => (
                <div key={i} style={{ marginLeft: '8px' }}>• {warning}</div>
              ))}
            </div>
          )}

          {envInfo.debugMode && (
            <div style={{ 
              marginTop: '8px', 
              padding: '4px', 
              backgroundColor: 'rgba(255,255,0,0.1)', 
              borderRadius: '4px',
              fontSize: '11px'
            }}>
              🐛 Debug mode enabled
            </div>
          )}
        </div>
      )}
    </div>
  );
};