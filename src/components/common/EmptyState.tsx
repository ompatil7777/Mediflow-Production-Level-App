import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { FolderOpen } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  titleEn: string;
  titleMr?: string;
  descEn: string;
  descMr?: string;
  actionEn?: string;
  actionMr?: string;
  onAction?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  titleEn,
  titleMr,
  descEn,
  descMr,
  actionEn,
  actionMr,
  onAction,
  icon: Icon = FolderOpen,
}) => {
  const { getBilingual } = useLanguage();
  const title = getBilingual(titleEn, titleMr);
  const desc = getBilingual(descEn, descMr);

  return (
    <div className="w-full p-6 bg-white rounded-[6px] border-[1.5px] border-surface-border flex flex-col items-center text-center my-4">
      <div className="w-12 h-12 rounded-full bg-surface-well border border-surface-border flex items-center justify-center text-content-secondary mb-3">
        <Icon className="w-6 h-6 stroke-[1.75]" />
      </div>
      <h3 className="text-base font-bold text-content-primary leading-snug">
        {title.primary}
      </h3>
      {title.secondary && (
        <p className="text-sm text-content-secondary mt-0.5">{title.secondary}</p>
      )}
      <p className="text-sm text-content-muted mt-2 max-w-[280px]">
        {desc.primary}
      </p>
      {desc.secondary && (
        <p className="text-xs text-content-muted mt-0.5 max-w-[280px]">
          {desc.secondary}
        </p>
      )}
      {actionEn && onAction && (
        <div className="mt-4 w-full max-w-[220px]">
          <Button variant="secondary" enText={actionEn} mrText={actionMr} onClick={onAction} />
        </div>
      )}
    </div>
  );
};
