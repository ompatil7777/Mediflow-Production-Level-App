import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { BilingualText } from '../../components/common/BilingualText';
import { authService } from '../../services/auth';

export const PatientSignIn: React.FC = () => {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<{ en: string; mr: string } | null>(null);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || mobile.length < 10) {
      setError({
        en: 'Please enter a valid 10-digit mobile number.',
        mr: 'कृपया वैध १० अंकी मोबाईल नंबर टाका.',
      });
      return;
    }
    if (!password) {
      setError({
        en: 'Please enter your password.',
        mr: 'कृपया तुमचा पासवर्ड टाका.',
      });
      return;
    }

    const res = authService.signInPatient(mobile);
    if (res.success) {
      navigate('/patient/home');
    } else {
      setError({
        en: res.error || 'Authentication failed. Please check your credentials.',
        mr: 'साइन इन अयशस्वी. कृपया तपशील तपासा.',
      });
    }
  };

  const fillDemoPatient = () => {
    setMobile('9876543210');
    setPassword('demo123');
    setError(null);
  };

  return (
    <div className="w-full max-w-[340px] mx-auto py-4">
      {/* Title */}
      <div className="text-center mb-6">
        <BilingualText
          en="Patient Sign In"
          mr="रुग्ण साइन इन"
          primaryClassName="text-2xl font-bold text-content-primary text-center"
          secondaryClassName="text-base text-content-secondary text-center mt-0.5"
        />
        <p className="text-xs text-content-muted mt-1.5">
          Sign in with your registered mobile number
        </p>
      </div>

      <form onSubmit={handleSignIn} className="space-y-2">
        <Input
          labelEn="Mobile Number"
          labelMr="मोबाईल नंबर"
          type="tel"
          maxLength={10}
          placeholder="e.g. 9876543210"
          value={mobile}
          onChange={(e) => {
            setMobile(e.target.value.replace(/\D/g, ''));
            setError(null);
          }}
          errorEn={error?.en}
          errorMr={error?.mr}
        />

        <Input
          labelEn="Password"
          labelMr="पासवर्ड"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(null);
          }}
        />

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            enText="Sign In"
            mrText="साइन इन करा"
          />
        </div>
      </form>

      {/* Demo Credentials Quick Fill */}
      <div className="mt-4 p-3 rounded-[6px] bg-surface-well border border-surface-border text-center">
        <p className="text-xs font-semibold text-content-primary">
          Demo Patient Account / डेमो खाते
        </p>
        <p className="text-xs text-content-secondary mt-0.5">
          Ramesh Patil: <span className="font-mono font-bold">9876543210</span>
        </p>
        <button
          type="button"
          onClick={fillDemoPatient}
          className="mt-2 text-xs font-bold text-brand underline"
        >
          Auto-fill Demo Credentials
        </button>
      </div>

      {/* Auxiliary links */}
      <div className="mt-5 text-center flex flex-col gap-2">
        <Link
          to="/auth/register/step-1"
          className="text-sm font-semibold text-brand hover:underline"
        >
          New patient? Register here / नवीन रुग्ण? येथे नोंदणी करा
        </Link>
        <Link
          to="/auth/patient-signin-states"
          className="text-xs text-content-muted hover:underline"
        >
          View Validation & Error States Demo
        </Link>
        <p className="text-[11px] text-content-muted mt-2">
          Forgot password? Contact your PHC or District Health Office.
        </p>
      </div>
    </div>
  );
};
