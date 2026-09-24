import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { MOCK_PHCS, INITIAL_INVENTORY, MOCK_PATIENTS, MOCK_APPOINTMENTS } from '../../data/mockData';

// Stitch: Patient Home screen b7b0c2d8a6a046bfb0d53d6c0167d01f
// 5 cards max on dashboard: My PHC, My Appointment, Check Symptoms, Medicine Stock, My Health

const patient = MOCK_PATIENTS[0]; // Ramesh Patil, MF-P-0001, Shivapur
const phc = MOCK_PHCS[0]; // PHC Shivapur
const appointment = MOCK_APPOINTMENTS.find(a => a.patientId === patient.id);

export const PatientHome: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const lang = (en: string, mr: string) => language === 'mr' ? mr : en;

  return (
    <div className="flex flex-col gap-3 pb-4">

      {/* Greeting & Patient Identifier */}
      <section className="bg-white border-l-4 border-brand p-3 rounded border border-surface-border">
        <div className="flex items-start justify-between">
          <div>
            {language === 'mr' ? (
              <>
                <h1 className="text-[18px] font-bold text-content-primary">नमस्ते, रमेश पाटील</h1>
                <p className="text-sm text-content-secondary">Namaste, Ramesh Patil</p>
              </>
            ) : (
              <>
                <h1 className="text-[18px] font-bold text-content-primary">Namaste, Ramesh Patil</h1>
                <p className="text-sm text-content-secondary">नमस्ते, रमेश पाटील</p>
              </>
            )}
          </div>
          <span className="inline-flex items-center px-2 py-1 bg-surface-well text-brand text-xs font-bold rounded border border-surface-border">
            MF-P-0001
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-surface-border flex items-center gap-1.5 text-content-secondary text-sm">
          <span className="material-symbols-outlined text-brand text-[16px]">location_on</span>
          <span>{lang('Your village: Shivapur', 'तुमचे गाव: शिवापूर')}</span>
        </div>
      </section>

      {/* CARD 1: My PHC */}
      <section className="bg-white border border-surface-border rounded p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="text-xs text-brand font-semibold uppercase tracking-wide">PHC Center</span>
            <h2 className="text-[17px] font-bold text-content-primary">
              {lang('My PHC', 'माझे प्रा.आ.केंद्र')}
            </h2>
            <p className="text-[15px] font-semibold text-content-primary">
              {lang(phc.name, phc.nameMr)}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-status-available-bg border border-green-200 px-2.5 py-1 rounded text-status-available min-h-[32px]">
            <span className="w-2 h-2 rounded-full bg-status-available animate-ping"></span>
            <span className="text-xs font-semibold">{lang('Consulting Now', 'तपासणी सुरू')}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 bg-surface-well p-2 rounded border border-surface-border mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-brand text-[20px]">groups</span>
            <div>
              <p className="text-[15px] font-bold text-content-primary">9 waiting</p>
              <p className="text-xs text-content-muted">९ प्रतीक्षेत</p>
            </div>
          </div>
          <div className="flex items-center gap-2 border-l border-surface-border pl-2">
            <span className="material-symbols-outlined text-status-available text-[20px]">event_seat</span>
            <div>
              <p className="text-[15px] font-bold text-content-primary">6 slots left</p>
              <p className="text-xs text-content-muted">६ स्लॉट शिल्लक</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {/* PHC phone shown as plain text — no call button per spec */}
          <div className="min-h-[48px] px-2 bg-surface-well border border-surface-border text-content-secondary text-sm font-medium rounded flex items-center justify-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">call</span>
            <span>108</span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/patient/nearby-phcs')}
            className="min-h-[48px] px-2 bg-white border-2 border-brand text-brand text-sm font-semibold rounded flex items-center justify-center gap-1.5 active:bg-surface-well"
          >
            <span className="material-symbols-outlined text-[18px]">directions</span>
            <span>{lang('Directions', 'दिशा')}</span>
          </button>
        </div>
      </section>

      {/* CARD 2: My Appointment */}
      <section className="bg-white border border-surface-border rounded p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className="text-[17px] font-bold text-content-primary">
              {lang('My Appointment', 'माझी भेट')}
            </h2>
            <p className="text-sm text-content-secondary">
              {lang('Today 10:30 AM with Dr. Anita Deshmukh', 'आज सकाळी १०:३० डॉ. अनिता देशमुख')}
            </p>
          </div>
          <div className="bg-brand text-white px-2.5 py-1.5 rounded text-right">
            <span className="text-[11px] block font-medium leading-tight">
              {lang('Token', 'टोकन')}
            </span>
            <span className="text-[17px] font-bold">#08</span>
          </div>
        </div>

        {/* 4-step appointment progress tracker */}
        <div className="py-2 my-1 border-y border-surface-border">
          <div className="relative flex items-center justify-between">
            {/* connector line */}
            <div className="absolute left-0 top-4 w-full h-1 bg-surface-border z-0"></div>
            <div className="absolute left-0 top-4 w-1/3 h-1 bg-status-available z-0"></div>

            {/* Step 1: Booked — Done */}
            <div className="relative z-10 flex flex-col items-center bg-white px-1">
              <div className="w-8 h-8 rounded-full bg-status-available text-white flex items-center justify-center border-2 border-status-available">
                <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>check</span>
              </div>
              <span className="text-[11px] text-content-muted mt-1">{lang('Booked', 'बुकिंग')}</span>
            </div>

            {/* Step 2: Checked In — Current */}
            <div className="relative z-10 flex flex-col items-center bg-white px-1">
              <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center border-2 border-brand ring-2 ring-brand/30">
                <span className="material-symbols-outlined text-[16px]">how_to_reg</span>
              </div>
              <span className="text-[11px] text-brand font-bold mt-1">{lang('Checked In', 'आलात')}</span>
            </div>

            {/* Step 3: Consultation — Pending */}
            <div className="relative z-10 flex flex-col items-center bg-white px-1">
              <div className="w-8 h-8 rounded-full bg-surface-well text-content-muted flex items-center justify-center border-2 border-surface-border">
                <span className="material-symbols-outlined text-[16px]">stethoscope</span>
              </div>
              <span className="text-[11px] text-content-muted mt-1">{lang('Consult', 'सल्ला')}</span>
            </div>

            {/* Step 4: Done — Pending */}
            <div className="relative z-10 flex flex-col items-center bg-white px-1">
              <div className="w-8 h-8 rounded-full bg-surface-well text-content-muted flex items-center justify-center border-2 border-surface-border">
                <span className="material-symbols-outlined text-[16px]">task_alt</span>
              </div>
              <span className="text-[11px] text-content-muted mt-1">{lang('Done', 'पूर्ण')}</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-content-secondary mt-2 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-status-available text-[18px]">info</span>
          {lang('Please wait in Waiting Hall 1.', 'प्रतिक्षा कक्ष १ मध्ये थांबा.')}
        </p>
      </section>

      {/* CARD 3: Check Symptoms */}
      <section className="bg-white border-2 border-brand rounded p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded bg-surface-well flex items-center justify-center flex-shrink-0 text-brand">
            <span className="material-symbols-outlined text-[28px]">health_and_safety</span>
          </div>
          <div>
            <h2 className="text-[17px] font-bold text-content-primary">
              {lang('Check Symptoms', 'लक्षणे तपासा')}
            </h2>
            <p className="text-sm text-content-secondary mt-0.5">
              {lang('Feeling unwell? Check symptoms for PHC care guidance.', 'बरे वाटत नाही का? प्राथमिक तपासणी करा.')}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate('/patient/symptom-check')}
          className="w-full min-h-[52px] bg-brand text-white text-base font-semibold rounded flex items-center justify-center gap-2 active:opacity-90"
        >
          <span>{lang('Start Symptom Check →', 'लक्षणे नोंदवा →')}</span>
        </button>
      </section>

      {/* CARD 4: Medicine Stock */}
      <section className="bg-white border border-surface-border rounded p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="text-xs text-content-muted uppercase tracking-wider font-semibold">Pharmacy Alert</span>
            <h2 className="text-[17px] font-bold text-content-primary">
              {lang('Medicine Stock', 'औषध साठा')}
            </h2>
          </div>
          <div className="flex items-center gap-1 bg-status-low-bg border border-yellow-200 text-status-low px-2.5 py-1 rounded min-h-[32px]">
            <span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 1"}}>warning</span>
            <span className="text-xs font-bold">{lang('LOW STOCK', 'कमी साठा')}</span>
          </div>
        </div>
        <div
          onClick={() => navigate('/patient/medicines')}
          className="bg-surface-well p-3 rounded border border-surface-border flex items-center justify-between cursor-pointer hover:bg-surface-ground"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-white border border-surface-border flex items-center justify-center text-brand">
              <span className="material-symbols-outlined text-[22px]">medication</span>
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-content-primary">Metformin 500mg</h3>
              <p className="text-xs text-content-muted">{lang('Daily chronic dose', 'रोजची मात्रा')}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[17px] font-bold text-status-low">84 units</span>
            <p className="text-xs text-content-muted">at PHC Shivapur</p>
          </div>
        </div>
      </section>

      {/* CARD 5: My Health */}
      <section className="bg-white border border-surface-border rounded p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className="text-[17px] font-bold text-content-primary">
              {lang('My Health', 'माझे आरोग्य')}
            </h2>
            <p className="text-xs text-content-muted">{lang('Latest recorded vitals', 'ताजी तपासणी')}</p>
          </div>
          <span className="material-symbols-outlined text-brand text-[24px]">favorite</span>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* Blood Pressure */}
          <div className="p-2 bg-surface-well rounded border border-surface-border">
            <span className="text-xs text-content-muted block">{lang('Blood Pressure', 'रक्तदाब')}</span>
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-[17px] font-bold text-content-primary">122/80</span>
              <span className="text-xs text-content-muted">mmHg</span>
            </div>
            <span className="inline-block px-1.5 py-0.5 bg-green-100 text-green-800 text-[11px] font-bold rounded">Normal</span>
          </div>
          {/* Fasting Sugar */}
          <div className="p-2 bg-surface-well rounded border border-surface-border">
            <span className="text-xs text-content-muted block">{lang('Fasting Sugar', 'साखर')}</span>
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-[17px] font-bold text-content-primary">110</span>
              <span className="text-xs text-content-muted">mg/dL</span>
            </div>
            <span className="inline-block px-1.5 py-0.5 bg-green-100 text-green-800 text-[11px] font-bold rounded">Normal</span>
          </div>
        </div>
        <div className="pt-2 border-t border-surface-border flex items-center justify-between text-xs text-content-muted">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">verified_user</span>
            {lang('Checked 3 days ago', '३ दिवसांपूर्वी तपासले')}
          </span>
          <span className="font-semibold text-content-secondary">ASHA: Sunita Gaikwad</span>
        </div>
        <button
          type="button"
          onClick={() => navigate('/patient/my-health')}
          className="w-full mt-3 min-h-[44px] bg-surface-well border border-surface-border text-brand text-sm font-semibold rounded flex items-center justify-center gap-1.5 hover:bg-brand/5 active:bg-brand/10"
        >
          <span>{lang('View Full Health Record →', 'संपूर्ण आरोग्य नोंद →')}</span>
        </button>
      </section>
    </div>
  );
};
