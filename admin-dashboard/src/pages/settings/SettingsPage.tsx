import React, { useState } from 'react';
import { Settings, School, ShieldCheck, Save, Globe, Database } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';

export function SettingsPage() {
  const { toast } = useToast();
  const [schoolName, setSchoolName] = useState(
    'Sunrise International Matriculation Higher Secondary School'
  );
  const [affiliationCode, setAffiliationCode] = useState('TN-MATRIC-2014-9912');
  const [phone, setPhone] = useState('+91 44 2852 9000');
  const [email, setEmail] = useState('info@sunriseschool.edu.in');
  const [address, setAddress] = useState('142, Anna Salai, Chennai, Tamil Nadu 600002');
  const [currentYear, setCurrentYear] = useState('2026 - 2027');

  const handleSave = () => {
    toast('success', 'Settings Saved', 'School configuration updated.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#172033] tracking-tight">School Configuration</h1>
        <p className="text-xs text-[#64748B] mt-1 font-medium">
          Manage institutional profile, branding, academic sessions, and security parameters
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Institutional Info */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#F1F5F9]">
              <School size={20} className="text-[#3B5BDB]" />
              <h3 className="text-sm font-bold text-[#172033]">School Profile & Identity</h3>
            </div>

            <Input
              label="School Name"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Affiliation / Board Code"
                value={affiliationCode}
                onChange={(e) => setAffiliationCode(e.target.value)}
              />
              <Input
                label="Official Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Official Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Active Academic Year"
                value={currentYear}
                onChange={(e) => setCurrentYear(e.target.value)}
              />
            </div>

            <Input
              label="Campus Postal Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <div className="flex justify-end pt-2">
              <Button onClick={handleSave}>
                <Save size={14} /> Save Configuration
              </Button>
            </div>
          </div>

          {/* Localization Settings */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#F1F5F9]">
              <Globe size={20} className="text-[#16A36A]" />
              <h3 className="text-sm font-bold text-[#172033]">Localization & Languages</h3>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
              <div>
                <p className="text-xs font-bold text-[#172033]">Supported Parent App Languages</p>
                <p className="text-[11px] text-[#64748B]">English and Tamil (தமிழ்) dual language support enabled</p>
              </div>
              <Badge variant="success">Active (i18n)</Badge>
            </div>
          </div>
        </div>

        {/* Database & Architecture Status Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#16A36A]" />
              <h4 className="text-xs font-bold text-[#172033] uppercase tracking-wider">
                Security Architecture
              </h4>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9]">
                <p className="text-[#64748B]">Row Level Security (RLS)</p>
                <p className="font-bold text-[#16A36A] mt-0.5">Enforced on all 32 Tables</p>
              </div>
              <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9]">
                <p className="text-[#64748B]">Parent Data Isolation</p>
                <p className="font-bold text-[#3B5BDB] mt-0.5">Strict Parent-Ward Boundary</p>
              </div>
              <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#F1F5F9]">
                <p className="text-[#64748B]">Storage Buckets</p>
                <p className="font-bold text-[#172033] mt-0.5">6 Authenticated Buckets</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

