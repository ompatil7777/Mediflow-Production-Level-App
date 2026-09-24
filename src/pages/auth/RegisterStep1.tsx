import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { BilingualText } from '../../components/common/BilingualText';

export const RegisterStep1: React.FC = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'M' | 'F' | 'Other'>('M');
  const [error, setError] = useState('');

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !mobile || !password || !age) {
      setError('Please fill all required personal details.');
      return;
    }
    // Save partial data in sessionStorage
    sessionStorage.setItem(
      'mediflow_reg_step1',
      JSON.stringify({ fullName, mobile, password, age: parseInt(age, 10), gender })
    );
    navigate('/auth/register/step-2');
  };

  return (
    <div className="w-full max-w-[340px] mx-auto py-2">
      {/* Progress header */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-content-secondary font-semibold mb-1">
          <span>Step 1 of 3</span>
          <span>Personal Details / वैयक्तिक माहिती</span>
        </div>
        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div className="w-1/3 h-full bg-brand rounded-full"></div>
        </div>
      </div>

      <div className="mb-4">
        <BilingualText
          en="Register as New Patient"
          mr="नवीन रुग्ण नोंदणी"
          primaryClassName="text-xl font-bold text-content-primary"
          secondaryClassName="text-sm text-content-secondary"
        />
      </div>

      {error && (
        <div className="p-2.5 rounded-[4px] bg-[#FEF2F2] border border-[#DC2626] text-xs font-semibold text-[#DC2626] mb-3">
          {error}
        </div>
      )}

      <form onSubmit={handleNext} className="space-y-1">
        <Input
          labelEn="Full Name"
          labelMr="पूर्ण नाव"
          placeholder="e.g. Ramesh Patil"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <Input
          labelEn="Mobile Number"
          labelMr="मोबाईल नंबर"
          type="tel"
          maxLength={10}
          placeholder="10-digit mobile"
          value={mobile}
          onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
          required
        />

        <Input
          labelEn="Create Password"
          labelMr="पासवर्ड तयार करा"
          type="password"
          placeholder="Min 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            labelEn="Age"
            labelMr="वय"
            type="number"
            min={1}
            max={120}
            placeholder="Years"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />

          <div className="flex flex-col mb-4">
            <label className="mb-1.5 text-base font-bold text-content-primary">
              Gender / लिंग
            </label>
            <select
              className="h-[52px] w-full px-3 bg-white rounded-[6px] text-base font-medium text-content-primary border-2 border-surface-border focus:border-brand"
              value={gender}
              onChange={(e) => setGender(e.target.value as any)}
            >
              <option value="M">Male / पुरुष</option>
              <option value="F">Female / महिला</option>
              <option value="Other">Other / इतर</option>
            </select>
          </div>
        </div>

        <div className="pt-3">
          <Button variant="primary" enText="Next: Village Selection" mrText="पुढे: गाव निवडा" />
        </div>
      </form>

      <div className="mt-4 text-center">
        <Link to="/auth/patient-signin" className="text-xs font-semibold text-brand hover:underline">
          Already registered? Sign in / आधीच खाते आहे? साइन इन करा
        </Link>
      </div>
    </div>
  );
};
