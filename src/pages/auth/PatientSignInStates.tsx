import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { BilingualText } from '../../components/common/BilingualText';
import { ErrorState } from '../../components/common/ErrorState';

export const PatientSignInStates: React.FC = () => {
  const [activeState, setActiveState] = useState<'normal' | 'validation' | 'auth_failed' | 'network'>(
    'validation'
  );

  return (
    <div className="w-full max-w-[360px] mx-auto py-2">
      <div className="mb-4">
        <Link to="/auth/patient-signin" className="text-xs font-semibold text-brand underline">
          ← Back to Patient Sign In
        </Link>
        <h2 className="text-xl font-bold text-content-primary mt-2">
          Patient Sign In States Preview
        </h2>
        <p className="text-xs text-content-secondary mt-1">
          Demonstrating high-contrast validation and system states
        </p>
      </div>

      {/* State Switcher Tabs */}
      <div className="grid grid-cols-2 gap-1.5 mb-4 p-1 rounded-[6px] bg-surface-well border border-surface-border">
        <button
          onClick={() => setActiveState('normal')}
          className={`py-1.5 text-xs font-semibold rounded-[4px] ${
            activeState === 'normal' ? 'bg-white text-brand shadow-sm' : 'text-content-secondary'
          }`}
        >
          Normal State
        </button>
        <button
          onClick={() => setActiveState('validation')}
          className={`py-1.5 text-xs font-semibold rounded-[4px] ${
            activeState === 'validation' ? 'bg-white text-brand shadow-sm' : 'text-content-secondary'
          }`}
        >
          Validation Error
        </button>
        <button
          onClick={() => setActiveState('auth_failed')}
          className={`py-1.5 text-xs font-semibold rounded-[4px] ${
            activeState === 'auth_failed' ? 'bg-white text-brand shadow-sm' : 'text-content-secondary'
          }`}
        >
          Wrong Credentials
        </button>
        <button
          onClick={() => setActiveState('network')}
          className={`py-1.5 text-xs font-semibold rounded-[4px] ${
            activeState === 'network' ? 'bg-white text-brand shadow-sm' : 'text-content-secondary'
          }`}
        >
          Network Error
        </button>
      </div>

      {/* Render Selected State */}
      <div className="p-4 bg-white rounded-[6px] border-[1.5px] border-surface-border">
        {activeState === 'normal' && (
          <div className="space-y-3">
            <Input labelEn="Mobile Number" labelMr="मोबाईल नंबर" value="9876543210" readOnly />
            <Input labelEn="Password" labelMr="पासवर्ड" type="password" value="demo123" readOnly />
            <Button variant="primary" enText="Sign In" mrText="साइन इन करा" />
          </div>
        )}

        {activeState === 'validation' && (
          <div className="space-y-3">
            <Input
              labelEn="Mobile Number"
              labelMr="मोबाईल नंबर"
              value="9876"
              errorEn="Mobile number must be exactly 10 digits."
              errorMr="मोबाईल नंबर १० अंकी असावा."
              readOnly
            />
            <Input
              labelEn="Password"
              labelMr="पासवर्ड"
              type="password"
              value=""
              errorEn="Password is required."
              errorMr="पासवर्ड आवश्यक आहे."
              readOnly
            />
            <Button variant="primary" enText="Sign In" mrText="साइन इन करा" disabled />
          </div>
        )}

        {activeState === 'auth_failed' && (
          <div className="space-y-3">
            <div className="p-3 rounded-[6px] bg-[#FEF2F2] border border-[#DC2626] mb-3">
              <BilingualText
                en="Incorrect mobile number or password. Please try again."
                mr="चुकीचा मोबाईल नंबर किंवा पासवर्ड. कृपया पुन्हा प्रयत्न करा."
                primaryClassName="text-xs font-bold text-[#DC2626]"
                secondaryClassName="text-[11px] text-[#991B1B]"
              />
            </div>
            <Input labelEn="Mobile Number" labelMr="मोबाईल नंबर" value="9876543210" readOnly />
            <Input labelEn="Password" labelMr="पासवर्ड" type="password" value="wrongpass" readOnly />
            <Button variant="primary" enText="Sign In" mrText="साइन इन करा" />
          </div>
        )}

        {activeState === 'network' && (
          <div>
            <ErrorState
              titleEn="Network Connection Timed Out"
              titleMr="नेटवर्क संपर्क वेळ संपली"
              messageEn="Unable to reach the Rural Health Network. Showing cached offline data."
              messageMr="आरोग्य नेटवर्कशी संपर्क साधता आला नाही. सेव्ह केलेला डेटा दाखवत आहे."
              onRetry={() => setActiveState('normal')}
            />
          </div>
        )}
      </div>
    </div>
  );
};
