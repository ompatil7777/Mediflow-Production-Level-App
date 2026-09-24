import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { BilingualText } from '../../components/common/BilingualText';
import { LogOut, Shield } from 'lucide-react';

export const SignOutConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  const handleConfirm = () => {
    signOut();
    navigate('/welcome');
  };

  const handleCancel = () => {
    setIsOpen(false);
    navigate(-1);
  };

  return (
    <div className="w-full max-w-[340px] mx-auto py-6 text-center">
      <div className="p-6 bg-white rounded-[6px] border-[1.5px] border-surface-border">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-content-primary">
          <LogOut className="w-6 h-6" />
        </div>
        <BilingualText
          en="Sign Out Confirmation Preview"
          mr="साइन आउट पुष्टीकरण पूर्वावलोकन"
          primaryClassName="text-lg font-bold text-content-primary text-center"
          secondaryClassName="text-sm text-content-secondary text-center mt-0.5"
        />
        <p className="text-xs text-content-muted mt-2">
          This preview demonstrates the standalone modal component used when signing out from Settings or bottom profile bar.
        </p>
        <div className="mt-4">
          <Button
            variant="primary"
            enText="Open Sign Out Modal"
            mrText="साइन आउट डायलॉग उघडा"
            onClick={() => setIsOpen(true)}
          />
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={handleCancel}
        title={
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-brand" />
            <h3 className="text-lg font-bold text-content-primary">
              Sign Out Confirmation
            </h3>
          </div>
        }
      >
        <div className="space-y-4 text-left">
          <p className="text-sm text-content-secondary">
            Are you sure you want to sign out? Your saved offline data will remain preserved on this device.
          </p>
          <p className="text-xs text-content-muted">
            तुम्हाला खात्री आहे की तुम्ही साइन आउट करू इच्छिता? सेव्ह केलेले ऑफलाइन रेकॉर्ड या डिव्हाइसवर सुरक्षित राहतील.
          </p>
          <div className="flex gap-2.5 pt-2">
            <Button
              variant="secondary"
              enText="Cancel"
              mrText="रद्द करा"
              onClick={handleCancel}
            />
            <Button
              variant="destructive"
              enText="Yes, Sign Out"
              mrText="होय, साइन आउट करा"
              onClick={handleConfirm}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
