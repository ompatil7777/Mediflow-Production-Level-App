import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { BilingualText } from '../../components/common/BilingualText';
import { MOCK_VILLAGES, MOCK_PHCS } from '../../data/mockData';
import { Building2 } from 'lucide-react';

export const RegisterStep2: React.FC = () => {
  const navigate = useNavigate();
  const [selectedVillageId, setSelectedVillageId] = useState(MOCK_VILLAGES[1].id); // Shivapur
  const [emergencyContact, setEmergencyContact] = useState('0000 000000');

  const selectedVillage = MOCK_VILLAGES.find((v) => v.id === selectedVillageId) || MOCK_VILLAGES[0];
  const assignedPhc = MOCK_PHCS.find((p) => p.id === selectedVillage.phcId) || MOCK_PHCS[0];

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const prev = JSON.parse(sessionStorage.getItem('mediflow_reg_step1') || '{}');
    sessionStorage.setItem(
      'mediflow_reg_data',
      JSON.stringify({
        ...prev,
        villageId: selectedVillage.id,
        villageName: selectedVillage.name,
        assignedPhcId: assignedPhc.id,
        assignedPhcName: assignedPhc.name,
        emergencyContact,
      })
    );
    navigate('/auth/register/consent');
  };

  return (
    <div className="w-full max-w-[340px] mx-auto py-2">
      {/* Progress header */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-content-secondary font-semibold mb-1">
          <span>Step 2 of 3</span>
          <span>Village & Primary Centre / गाव व आरोग्य केंद्र</span>
        </div>
        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div className="w-2/3 h-full bg-brand rounded-full"></div>
        </div>
      </div>

      <div className="mb-4">
        <BilingualText
          en="Location & Assigned Health Centre"
          mr="गाव आणि नियुक्त प्राथमिक आरोग्य केंद्र"
          primaryClassName="text-xl font-bold text-content-primary"
          secondaryClassName="text-sm text-content-secondary"
        />
      </div>

      <form onSubmit={handleNext} className="space-y-4">
        <div className="flex flex-col">
          <label className="mb-1.5 text-base font-bold text-content-primary">
            Select Village / गाव निवडा
          </label>
          <select
            className="h-[52px] w-full px-3.5 bg-white rounded-[6px] text-base font-medium text-content-primary border-2 border-surface-border focus:border-brand"
            value={selectedVillageId}
            onChange={(e) => setSelectedVillageId(e.target.value)}
          >
            {MOCK_VILLAGES.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} / {v.nameMr}
              </option>
            ))}
          </select>
        </div>

        {/* Assigned PHC card */}
        <div className="p-3.5 rounded-[6px] bg-surface-well border-[1.5px] border-surface-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-[6px] bg-brand text-white flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-content-muted font-medium">
              Assigned Health Centre / नियुक्त केंद्र
            </span>
            <span className="text-base font-bold text-brand">
              {assignedPhc.name}
            </span>
            <span className="text-xs text-content-secondary">
              {assignedPhc.nameMr} · {assignedPhc.doctorName}
            </span>
          </div>
        </div>

        <Input
          labelEn="Emergency Contact Number"
          labelMr="आपत्कालीन संपर्क क्रमांक"
          type="text"
          placeholder="0000 000000"
          value={emergencyContact}
          onChange={(e) => setEmergencyContact(e.target.value)}
          helperTextEn="Fictional contact for rural demo prototype"
          helperTextMr="प्रात्यक्षिक हेतूसाठी काल्पनिक संपर्क क्रमांक"
        />

        <div className="pt-2 flex gap-2.5">
          <Button
            type="button"
            variant="secondary"
            enText="Back"
            mrText="मागे"
            onClick={() => navigate('/auth/register/step-1')}
          />
          <Button
            type="submit"
            variant="primary"
            enText="Next: Consent"
            mrText="पुढे: संमती"
          />
        </div>
      </form>
    </div>
  );
};
