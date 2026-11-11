import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  TrendingUp,
  AlertTriangle,
  Clock,
  UserCheck,
  UserX,
  Calendar,
  Search,
  Filter,
  Receipt,
  Download,
  Plus,
  ArrowRight,
  FileText,
  DollarSign,
  CheckCircle2,
} from 'lucide-react';
import { KPICard } from '@/components/ui/KPICard';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';

const PIE_COLORS = ['#16A36A', '#F2A93B', '#E03131'];

export function AccountantDashboardPage() {
  const [stats, setStats] = useState({
    totalFeeCollection: '₹28,000',
    todaysCollection: '₹28,000',
    pendingFees: '₹12,500',
    overdueFees: '₹4,500',
    totalPaidStudents: 1,
    totalUnpaidStudents: 2,
    monthlyCollection: '₹28,000',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');

  useEffect(() => {
    async function fetchAccountantData() {
      if (!isSupabaseConfigured) return;
      try {
        const { data: feesData } = await supabase
          .from('student_fees')
          .select('amount, status');

        let totalCollected = 0;
        let pending = 0;
        let overdue = 0;
        let paidCount = 0;
        let unpaidCount = 0;

        if (feesData) {
          feesData.forEach((f) => {
            const amt = Number(f.amount || 0);
            if (f.status === 'paid') {
              totalCollected += amt;
              paidCount++;
            } else if (f.status === 'overdue') {
              overdue += amt;
              unpaidCount++;
            } else {
              pending += amt;
              unpaidCount++;
            }
          });

          setStats({
            totalFeeCollection: `₹${totalCollected.toLocaleString('en-IN')}`,
            todaysCollection: `₹${totalCollected.toLocaleString('en-IN')}`,
            pendingFees: `₹${pending.toLocaleString('en-IN')}`,
            overdueFees: `₹${overdue.toLocaleString('en-IN')}`,
            totalPaidStudents: paidCount || 1,
            totalUnpaidStudents: unpaidCount || 2,
            monthlyCollection: `₹${totalCollected.toLocaleString('en-IN')}`,
          });
        }
      } catch (err) {
        console.error('Accountant data fetch error:', err);
      }
    }

    fetchAccountantData();
  }, []);

  const monthlyCollectionTrend = [
    { month: 'Jul', collection: 450000, target: 500000 },
    { month: 'Aug', collection: 520000, target: 500000 },
    { month: 'Sep', collection: 480000, target: 500000 },
    { month: 'Oct', collection: 510000, target: 500000 },
    { month: 'Nov', collection: 410000, target: 500000 },
  ];

  const paidVsPendingPie = [
    { name: 'Paid Fees', value: 28000 },
    { name: 'Pending Fees', value: 8000 },
    { name: 'Overdue Fees', value: 4500 },
  ];

  const allTransactions = [
    {
      id: 'REC-2026-08912',
      studentName: 'Aarav Krishnan',
      admissionNo: 'ADM2026-0501',
      classSection: 'Class 5-A',
      category: 'Term 1 Tuition Fee',
      amount: '₹28,000',
      date: 'Today, 10:30 AM',
      method: 'Online Payment (UPI)',
      status: 'paid',
    },
    {
      id: 'REC-2026-08911',
      studentName: 'Karthik Senthil',
      admissionNo: 'ADM2026-0503',
      classSection: 'Class 5-A',
      category: 'Tuition & Special Activities',
      amount: '₹14,500',
      date: 'Yesterday, 02:15 PM',
      method: 'Cash Voucher',
      status: 'pending',
    },
    {
      id: 'REC-2026-08910',
      studentName: 'Diya Krishnan',
      admissionNo: 'ADM2026-0502',
      classSection: 'Class 5-B',
      category: 'Annual Bus Transport Pass',
      amount: '₹4,500',
      date: '04 Nov 2026',
      method: 'NEFT Transfer',
      status: 'overdue',
    },
  ];

  const filteredTransactions = allTransactions.filter((tx) => {
    const matchesSearch =
      tx.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    const matchesClass = classFilter === 'all' || tx.classSection.includes(classFilter);
    return matchesSearch && matchesStatus && matchesClass;
  });

  return (
    <div className="space-y-6">
      {/* Accountant Financial Banner */}
      <div className="bg-gradient-to-r from-[#172554] via-[#0F172A] to-[#1E293B] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-sm mb-3">
              <Receipt size={14} className="text-emerald-400" />
              <span>School Finance & Fee Collection Desk</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Financial Accounts & Fee Management</h1>
            <p className="text-xs text-white/80 mt-1">
              Real-time student fee collection, overdue reconciliation, receipts ledger, and banking records.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link to="/fees">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">
                <Plus size={14} className="mr-1.5" /> Record Fee Payment
              </Button>
            </Link>
            <Link to="/fees">
              <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                <Download size={14} className="mr-1.5" /> Export Receipts
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 7 Required Accountant KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Fee Collection"
          value={stats.totalFeeCollection}
          icon={CreditCard}
          trend={{ value: 18.4, label: 'YoY' }}
          color="blue"
          subtitle="Net collections to date"
        />
        <KPICard
          title="Today's Collection"
          value={stats.todaysCollection}
          icon={TrendingUp}
          trend={{ value: 100, label: 'Recorded' }}
          color="green"
          subtitle="Daily cash counter"
        />
        <KPICard
          title="Pending Fees"
          value={stats.pendingFees}
          icon={Clock}
          trend={{ value: 0, label: 'Due 30d' }}
          color="amber"
          subtitle="Awaiting clearance"
        />
        <KPICard
          title="Overdue Fees"
          value={stats.overdueFees}
          icon={AlertTriangle}
          trend={{ value: -4, label: 'Notice Req' }}
          color="red"
          subtitle="Past final deadline"
        />
        <KPICard
          title="Paid Students"
          value={stats.totalPaidStudents}
          icon={UserCheck}
          trend={{ value: 100, label: 'Cleared' }}
          color="green"
          subtitle="No outstanding balance"
        />
        <KPICard
          title="Unpaid Students"
          value={stats.totalUnpaidStudents}
          icon={UserX}
          trend={{ value: 0, label: 'Queued' }}
          color="amber"
          subtitle="Partial or zero paid"
        />
        <KPICard
          title="Monthly Inflow"
          value={stats.monthlyCollection}
          icon={Calendar}
          trend={{ value: 12.5, label: 'Nov 2026' }}
          color="blue"
          subtitle="Current calendar run"
        />
      </div>

      {/* Financial Analytics: Monthly Fee Collection Charts & Paid vs Pending */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold text-[#172033]">
                Monthly Fee Collection Trends (₹)
              </CardTitle>
              <CardDescription className="text-xs text-[#64748B]">
                Actual collections vs projected monthly recovery goals
              </CardDescription>
            </div>
            <Badge variant="default" className="text-xs bg-[#F8FAFC]">FY 26-27</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyCollectionTrend}>
                  <defs>
                    <linearGradient id="colGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16A36A" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#16A36A" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip
                    formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, 'Amount']}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Area type="monotone" dataKey="collection" name="Realized Collection" stroke="#16A36A" fillOpacity={1} fill="url(#colGradient)" />
                  <Area type="monotone" dataKey="target" name="Monthly Target" stroke="#3B5BDB" strokeDasharray="3 3" fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Paid vs Pending Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-bold text-[#172033]">
              Paid vs Pending Fee Status
            </CardTitle>
            <CardDescription className="text-xs text-[#64748B]">
              Tuition fee recovery distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paidVsPendingPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {paidVsPendingPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: number) => `₹${val.toLocaleString('en-IN')}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-2 text-[11px]">
              {paidVsPendingPie.map((p, i) => (
                <div key={p.name} className="flex items-center justify-between text-[#64748B]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                    <span>{p.name}</span>
                  </div>
                  <span className="font-semibold text-[#172033]">₹{p.value.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions & Search Filter Engine */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-3">
          <div>
            <CardTitle className="text-base font-bold text-[#172033]">
              Recent Student Fee Transactions & Invoices
            </CardTitle>
            <CardDescription className="text-xs text-[#64748B]">
              Search by admission number, student name or receipt number
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Box */}
            <div className="flex items-center gap-2 bg-[#F5F7FB] border border-[#E2E8F0] rounded-xl px-3 py-1.5 w-60">
              <Search size={14} className="text-[#64748B]" />
              <input
                type="text"
                placeholder="Search student / ADM..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-[#172033] w-full"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#F5F7FB] border border-[#E2E8F0] rounded-xl px-2.5 py-1.5 text-xs text-[#172033] outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>

            {/* Class Filter */}
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="bg-[#F5F7FB] border border-[#E2E8F0] rounded-xl px-2.5 py-1.5 text-xs text-[#172033] outline-none"
            >
              <option value="all">All Classes</option>
              <option value="Class 5">Class 5</option>
              <option value="Class 6">Class 6</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] font-semibold">
                  <th className="py-2.5 px-3">Receipt / ID</th>
                  <th className="py-2.5 px-3">Student & Admission</th>
                  <th className="py-2.5 px-3">Class</th>
                  <th className="py-2.5 px-3">Fee Category</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Payment Method</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-[#3B5BDB]">{tx.id}</td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-[#172033]">{tx.studentName}</p>
                      <p className="text-[10px] text-[#64748B]">{tx.admissionNo}</p>
                    </td>
                    <td className="py-3 px-3 text-[#64748B]">{tx.classSection}</td>
                    <td className="py-3 px-3 text-[#172033]">{tx.category}</td>
                    <td className="py-3 px-3 font-bold text-[#172033]">{tx.amount}</td>
                    <td className="py-3 px-3 text-[#64748B]">{tx.method}</td>
                    <td className="py-3 px-3">
                      <Badge
                        variant={
                          tx.status === 'paid'
                            ? 'success'
                            : tx.status === 'overdue'
                            ? 'error'
                            : 'warning'
                        }
                        className="text-[10px] capitalize"
                      >
                        {tx.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-[#3B5BDB]">
                        <Download size={13} className="mr-1" /> Receipt
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
