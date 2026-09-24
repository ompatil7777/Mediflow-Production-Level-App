import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { BilingualText } from '../../components/common/BilingualText';
import { authService } from '../../services/auth';
import { ShieldCheck, Sparkles } from 'lucide-react';

export const StaffSignIn: React.FC = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<{ en: string; mr: string } | null>(null);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) {
      setError({
        en: 'Please enter your staff ID or email.',
        mr: 'कृपया तुमचा कर्मचारी आयडी किंवा ईमेल टाका.',
      });
      return;
    }
    const res = authService.signInStaff(identifier);
    if (res.success && res.user) {
      redirectToRole(res.user.role);
    }
  };

  const redirectToRole = (role: string) => {
    switch (role) {
      case 'health_worker':
        navigate('/health-worker/dashboard');
        break;
      case 'pharmacist':
        navigate('/pharmacist/inventory');
        break;
      case 'authority':
        navigate('/district/overview');
        break;
      case 'supply':
        navigate('/supply/dashboard');
        break;
      default:
        navigate('/patient/home');
    }
  };

  const quickStaffLogin = (role: any) => {
    authService.signInWithDemoRole(role);
    redirectToRole(role);
  };

  return (
    <div className="w-full max-w-[340px] mx-auto py-2">
      <div className="text-center mb-5">
        <div className="w-12 h-12 rounded-[8px] bg-brand text-white flex items-center justify-center mx-auto mb-2 shadow-sm">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <BilingualText
          en="Staff & Health Worker Access"
          mr="कर्मचारी व आरोग्य कार्यकर्ते साइन इन"
          primaryClassName="text-xl font-bold text-content-primary text-center"
          secondaryClassName="text-sm text-content-secondary text-center mt-0.5"
        />
        <p className="text-xs text-content-muted mt-1">
          Authorized personnel of Rural Health Demo Network
        </p>
      </div>

      <form onSubmit={handleSignIn} className="space-y-2">
        <Input
          labelEn="Staff ID or Official Email"
          labelMr="कर्मचारी आयडी किंवा अधिकृत ईमेल"
          placeholder="e.g. ganesh.pharma@mediflow.demo"
          value={identifier}
          onChange={(e) => {
            setIdentifier(e.target.value);
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
            enText="Staff Sign In"
            mrText="कर्मचारी साइन इन करा"
          />
        </div>
      </form>

      {/* Staff Notice & Instant Demo Personas */}
      <div className="mt-5 p-3.5 rounded-[6px] bg-surface-well border border-surface-border text-left">
        <div className="flex items-center gap-1.5 text-xs font-bold text-brand mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Quick Staff Sign In (Demo Prototype)</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => quickStaffLogin('health_worker')}
            className="p-2 text-left rounded-[4px] bg-white border border-surface-border hover:border-brand active:bg-slate-50 transition-none"
          >
            <div className="text-xs font-bold text-content-primary">Sunita Gaikwad</div>
            <div className="text-[11px] text-content-muted">Health Worker</div>
          </button>
          <button
            type="button"
            onClick={() => quickStaffLogin('pharmacist')}
            className="p-2 text-left rounded-[4px] bg-white border border-surface-border hover:border-brand active:bg-slate-50 transition-none"
          >
            <div className="text-xs font-bold text-content-primary">Ganesh Jadhav</div>
            <div className="text-[11px] text-content-muted">Pharmacist</div>
          </button>
          <button
            type="button"
            onClick={() => quickStaffLogin('authority')}
            className="p-2 text-left rounded-[4px] bg-white border border-surface-border hover:border-brand active:bg-slate-50 transition-none"
          >
            <div className="text-xs font-bold text-content-primary">Dr. Meena Kulkarni</div>
            <div className="text-[11px] text-content-muted">District Health Office</div>
          </button>
          <button
            type="button"
            onClick={() => quickStaffLogin('supply')}
            className="p-2 text-left rounded-[4px] bg-white border border-surface-border hover:border-brand active:bg-slate-50 transition-none"
          >
            <div className="text-xs font-bold text-content-primary">Rajesh Pawar</div>
            <div className="text-[11px] text-content-muted">Supply Depot</div>
          </button>
        </div>
      </div>

      <div className="mt-4 text-center">
        <Link to="/auth/patient-signin" className="text-xs font-semibold text-brand hover:underline">
          Are you a patient? Go to Patient Sign In / रुग्ण साइन इन
        </Link>
      </div>
    </div>
  );
};
