import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_URL, BASE_URL } from '../constants';

const API = `${API_URL}/admin`;

interface CutoffRow {
  courseName: string;
  category: string;
  minimumCutoff: string;
}

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'colleges' | 'employees' | 'bulk' | 'consultations'>('colleges');
  const [colleges, setColleges] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [selectedConsultations, setSelectedConsultations] = useState<number[]>([]);
  const [assignEmployeeId, setAssignEmployeeId] = useState<number | ''>('');

  // Add College form
  const [collegeName, setCollegeName] = useState('');
  const [collegeLocation, setCollegeLocation] = useState('');
  const [collegeDescription, setCollegeDescription] = useState('');
  const [collegeWebsite, setCollegeWebsite] = useState('');
  const [cutoffRows, setCutoffRows] = useState<CutoffRow[]>([{ courseName: '', category: 'General', minimumCutoff: '' }]);
  const [yearWiseFees, setYearWiseFees] = useState<{year: number, amount: string}[]>([{year: 1, amount: ''}]);
  const [admissionFee, setAdmissionFee] = useState('');
  const [healthCardFee, setHealthCardFee] = useState('');
  const [applicationFee, setApplicationFee] = useState('');
  const [collegeLogo, setCollegeLogo] = useState<File | null>(null);
  const [showAddCollegeForm, setShowAddCollegeForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollegeId, setSelectedCollegeId] = useState<number | null>(null);

  // Add cutoff to existing college
  const [addCutoffCollegeId, setAddCutoffCollegeId] = useState<number | null>(null);
  const [newCutoffCourse, setNewCutoffCourse] = useState('');
  const [newCutoffCategory, setNewCutoffCategory] = useState('General');
  const [newCutoffMarks, setNewCutoffMarks] = useState('');

  // Employee form
  const [empEmail, setEmpEmail] = useState('');
  const [empPassword, setEmpPassword] = useState('');

  // Bulk upload
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);

  const token = sessionStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchColleges();
    fetchEmployees();
    fetchConsultations();
  }, []);

  /* ───── Data Fetchers ───── */
  const fetchColleges = async () => {
    try {
      const res = await axios.get(`${API}/colleges`, { headers });
      setColleges(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API}/employees`, { headers });
      setEmployees(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchConsultations = async () => {
    try {
      const res = await axios.get(`${API}/consultations`, { headers });
      setConsultations(res.data);
    } catch (err) { console.error(err); }
  };

  /* ───── College CRUD ───── */
  const handleAddCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', collegeName);
      formData.append('location', collegeLocation);
      formData.append('description', collegeDescription);
      formData.append('website', collegeWebsite);
      formData.append('cutoffs', JSON.stringify(cutoffRows.filter(c => c.courseName && c.minimumCutoff)));
      formData.append('yearWiseFees', JSON.stringify(yearWiseFees.filter(y => y.amount)));
      formData.append('admissionFee', admissionFee);
      formData.append('healthCardFee', healthCardFee);
      formData.append('applicationFee', applicationFee);
      if (collegeLogo) formData.append('logo', collegeLogo);

      await axios.post(`${API}/college`, formData, {
        headers: { 
          ...headers,
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('College added successfully!');
      setCollegeName(''); setCollegeLocation(''); setCollegeDescription(''); setCollegeWebsite('');
      setCutoffRows([{ courseName: '', category: 'General', minimumCutoff: '' }]);
      setYearWiseFees([{year: 1, amount: ''}]);
      setAdmissionFee(''); setHealthCardFee(''); setApplicationFee('');
      setCollegeLogo(null);
      setShowAddCollegeForm(false);
      fetchColleges();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error adding college');
    }
  };

  const handleDeleteCollege = async (id: number) => {
    if (!window.confirm('Are you sure? This will delete the college and all its cutoff marks.')) return;
    try {
      await axios.delete(`${API}/college/${id}`, { headers });
      fetchColleges();
      if (selectedCollegeId === id) setSelectedCollegeId(null);
      toast.success('College deleted successfully');
    } catch (err) { toast.error('Error deleting college'); }
  };

  const handleAddCutoff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addCutoffCollegeId) return;
    try {
      await axios.post(`${API}/cutoff`, {
        collegeId: addCutoffCollegeId,
        courseName: newCutoffCourse,
        category: newCutoffCategory,
        minimumCutoff: newCutoffMarks,
      }, { headers });
      setNewCutoffCourse(''); setNewCutoffCategory('General'); setNewCutoffMarks('');
      setAddCutoffCollegeId(null);
      fetchColleges();
      toast.success('Cutoff added successfully');
    } catch (err) { toast.error('Error adding cutoff'); }
  };

  const handleDeleteCutoff = async (cutoffId: number) => {
    try {
      await axios.delete(`${API}/cutoff/${cutoffId}`, { headers });
      fetchColleges();
      toast.success('Cutoff deleted successfully');
    } catch (err) { toast.error('Error deleting cutoff'); }
  };

  /* ───── Cutoff Row Helpers ───── */
  const addCutoffRow = () => setCutoffRows([...cutoffRows, { courseName: '', category: 'General', minimumCutoff: '' }]);
  const removeCutoffRow = (idx: number) => setCutoffRows(cutoffRows.filter((_, i) => i !== idx));
  const updateCutoffRow = (idx: number, field: keyof CutoffRow, value: string) => {
    const updated = [...cutoffRows];
    updated[idx][field] = value;
    setCutoffRows(updated);
  };

  const addYearFeeRow = () => setYearWiseFees([...yearWiseFees, { year: yearWiseFees.length + 1, amount: '' }]);
  const removeYearFeeRow = (idx: number) => setYearWiseFees(yearWiseFees.filter((_, i) => i !== idx).map((y, i) => ({ ...y, year: i + 1 })));
  const updateYearFeeRow = (idx: number, amount: string) => {
    const updated = [...yearWiseFees];
    updated[idx].amount = amount;
    setYearWiseFees(updated);
  };

  /* ───── Employee CRUD ───── */
  const addEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/employee`, { email: empEmail, password: empPassword }, { headers });
      toast.success('Employee added'); setEmpEmail(''); setEmpPassword('');
      fetchEmployees();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Error adding employee'); }
  };

  const deleteEmployee = async (id: number) => {
    if (!window.confirm('Delete this employee?')) return;
    try {
      await axios.delete(`${API}/employee/${id}`, { headers });
      fetchEmployees();
      toast.success('Employee deleted successfully');
    } catch (err) { toast.error('Error deleting employee'); }
  };

  /* ───── Bulk Upload ───── */
  const submitPreview = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post(`${API}/bulk-upload-preview`, formData, {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' }
      });
      setPreview(res.data.previewData);
      toast.success('Preview loaded successfully');
    } catch (err) { toast.error('Error processing file'); }
  };

  const submitConfirm = async () => {
    try {
      const res = await axios.post(`${API}/bulk-upload-confirm`, { data: preview }, { headers });
      toast.success(res.data.message);
      setPreview([]); setFile(null);
      fetchColleges();
    } catch (err) { toast.error('Error confirming upload'); }
  };

  /* ───── Consultations ───── */
  const toggleConsultationSelection = (id: number) => {
    if (selectedConsultations.includes(id)) {
      setSelectedConsultations(selectedConsultations.filter(c => c !== id));
    } else {
      setSelectedConsultations([...selectedConsultations, id]);
    }
  };

  const assignSelectedConsultations = async () => {
    if (!assignEmployeeId || selectedConsultations.length === 0) return;
    try {
      await axios.post(`${API}/consultations/assign`, {
        consultationIds: selectedConsultations,
        employeeId: assignEmployeeId
      }, { headers });
      toast.success('Leads assigned successfully!');
      setSelectedConsultations([]);
      setAssignEmployeeId('');
      fetchConsultations();
    } catch (error) { toast.error('Error assigning leads'); }
  };

  /* ───── Tab Button ───── */
  const TabBtn: React.FC<{ tab: string; label: string; icon: string }> = ({ tab, label, icon }) => (
    <button
      onClick={() => setActiveTab(tab as any)}
      className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
        activeTab === tab
          ? 'bg-primary text-white shadow-lg shadow-primary/20'
          : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
      }`}
    >
      <span className="material-icons text-lg">{icon}</span>
      {label}
    </button>
  );

      // Manual Add Consultation Form
  const [showAddConsultation, setShowAddConsultation] = useState(false);
  const [newConsultName, setNewConsultName] = useState('');
  const [newConsultEmail, setNewConsultEmail] = useState('');
  const [newConsultPhone, setNewConsultPhone] = useState('');
  const [newConsultInterest, setNewConsultInterest] = useState('Engineering Admissions');
  const [newConsultType, setNewConsultType] = useState('Free');

  const handleManualAddConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/consultation`, {
        name: newConsultName,
        email: newConsultEmail,
        phone: newConsultPhone,
        interest: newConsultInterest,
        type: newConsultType
      });
      toast.success('Consultation added successfully');
      setShowAddConsultation(false);
      setNewConsultName('');
      setNewConsultEmail('');
      setNewConsultPhone('');
      fetchConsultations();
    } catch (err) {
      toast.error('Error adding consultation manually');
    }
  };

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark transition-colors duration-500 font-sans">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-black text-primary dark:text-white tracking-tighter">Admin Dashboard</h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Ridge Educational Services</p>
          </div>
          <div className="flex gap-3 flex-wrap items-center">
            <TabBtn tab="colleges" label="Colleges" icon="school" />
            <TabBtn tab="employees" label="Employees" icon="people" />
            <TabBtn tab="consultations" label="Consultations" icon="contact_mail" />
            <TabBtn tab="bulk" label="Bulk Upload" icon="upload_file" />
            <button
              onClick={() => { sessionStorage.clear(); navigate('/login'); }}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white font-black text-xs uppercase tracking-widest transition-all ml-2"
            >
              <span className="material-icons text-lg">logout</span>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">

        {/* ═══════════ COLLEGES TAB ═══════════ */}
        {activeTab === 'colleges' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold dark:text-white">Colleges & Cutoff Marks</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const toShow = !showAddCollegeForm;
                  setShowAddCollegeForm(toShow);
                  if (toShow) setSelectedCollegeId(null);
                }}
                className="flex items-center gap-2 bg-accent text-primary px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-accent/20"
              >
                <span className="material-icons text-lg">{showAddCollegeForm ? 'close' : 'add'}</span>
                {showAddCollegeForm ? 'Cancel' : 'Add College'}
              </motion.button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* === LEFT PANE: Search & College List === */}
              <div className="lg:col-span-1 space-y-4">
                {/* Search Bar */}
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <span className="material-icons text-slate-400 ml-2">search</span>
                  <input type="text" placeholder="Search Colleges..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-sm font-bold dark:text-white"
                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {/* List of Colleges */}
                <div className="space-y-3 max-h-[700px] overflow-y-auto custom-scrollbar pr-2 pb-4">
                  {colleges.length === 0 ? (
                    <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                      <span className="material-icons text-4xl text-slate-200 dark:text-slate-700 mb-2">school</span>
                      <p className="text-slate-400 font-bold text-xs">No colleges added yet.</p>
                    </div>
                  ) : (
                    colleges.filter(col => col.name.toLowerCase().includes(searchQuery.toLowerCase()) || col.location.toLowerCase().includes(searchQuery.toLowerCase())).map((col) => (
                      <button
                        key={col.id}
                        onClick={() => { setSelectedCollegeId(col.id); setShowAddCollegeForm(false); }}
                        className={`w-full text-left p-6 rounded-[1.5rem] transition-all border ${selectedCollegeId === col.id ? 'bg-primary text-white border-primary shadow-xl shadow-primary/20' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-accent/40'}`}
                      >
                        <h3 className="font-display font-black text-lg leading-tight truncate">{col.name}</h3>
                        <p className={`text-[9px] uppercase tracking-widest font-black mt-2 truncate ${selectedCollegeId === col.id ? 'text-white/70' : 'text-accent'}`}>{col.location}</p>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* === RIGHT PANE: Details or Add Form === */}
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  {showAddCollegeForm ? (
                    <motion.div
                      key="add-form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="mb-10"
                    >
                      <form onSubmit={handleAddCollege} className="bg-white dark:bg-slate-900 rounded-[2rem] p-10 shadow-2xl border border-slate-100 dark:border-slate-800">
                        <h3 className="text-xl font-bold dark:text-white mb-8 flex items-center gap-3">
                          <span className="material-icons text-accent text-2xl">domain_add</span>
                          Add New College
                        </h3>

                        {/* College Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">College Name *</label>
                            <input required value={collegeName} onChange={e => setCollegeName(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 dark:text-white font-bold text-sm" placeholder="Anna University" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Location *</label>
                            <input required value={collegeLocation} onChange={e => setCollegeLocation(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 dark:text-white font-bold text-sm" placeholder="Chennai, Tamil Nadu" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Description</label>
                            <input value={collegeDescription} onChange={e => setCollegeDescription(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 dark:text-white font-bold text-sm" placeholder="One of India's top engineering colleges..." />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Website</label>
                            <input value={collegeWebsite} onChange={e => setCollegeWebsite(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 dark:text-white font-bold text-sm" placeholder="https://www.annauniv.edu" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">College Logo (Image)</label>
                            <input type="file" accept="image/*" onChange={e => setCollegeLogo(e.target.files ? e.target.files[0] : null)}
                              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-6 dark:text-white font-bold text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-primary file:text-white hover:file:bg-primary/90" />
                          </div>
                        </div>

                        {/* Cutoff Marks Section */}
                        <div className="border-t border-slate-100 dark:border-slate-800 pt-8 mb-8">
                          <div className="flex justify-between items-center mb-6">
                            <h4 className="text-sm font-black dark:text-white uppercase tracking-widest flex items-center gap-2">
                              <span className="material-icons text-accent text-lg">trending_up</span>
                              Cutoff Marks
                            </h4>
                            <button type="button" onClick={addCutoffRow} className="flex items-center gap-2 text-accent font-black text-xs uppercase tracking-widest hover:underline">
                              <span className="material-icons text-sm">add_circle</span> Add Row
                            </button>
                          </div>
                          {cutoffRows.map((row, idx) => (
                            <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end">
                              <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Course Name</label>
                                <input value={row.courseName} onChange={e => updateCutoffRow(idx, 'courseName', e.target.value)}
                                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 dark:text-white font-bold text-sm" placeholder="B.E Computer Science" />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Category</label>
                                <select value={row.category} onChange={e => updateCutoffRow(idx, 'category', e.target.value)}
                                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 dark:text-white font-bold text-sm">
                                  <option>General</option>
                                  <option>OBC</option>
                                  <option>SC/ST</option>
                                  <option>EWS</option>
                                </select>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Minimum Cutoff</label>
                                <input type="number" step="0.1" value={row.minimumCutoff} onChange={e => updateCutoffRow(idx, 'minimumCutoff', e.target.value)}
                                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 dark:text-white font-bold text-sm" placeholder="190.5" />
                              </div>
                              <button type="button" onClick={() => removeCutoffRow(idx)}
                                className="h-12 flex items-center justify-center gap-1 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 font-bold text-xs uppercase tracking-widest hover:bg-red-100 transition-colors">
                                <span className="material-icons text-sm">remove_circle</span> Remove
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Fee Details Section */}
                        <div className="border-t border-slate-100 dark:border-slate-800 pt-8 mb-8">
                          <h4 className="text-sm font-black dark:text-white uppercase tracking-widest flex items-center gap-2 mb-6">
                            <span className="material-icons text-accent text-lg">account_balance_wallet</span>
                            Fee Details (Optional)
                          </h4>
                          
                          {/* Year Wise Fees */}
                          <div className="mb-6 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between items-center mb-4">
                              <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Year Wise Amounts</h5>
                              <button type="button" onClick={addYearFeeRow} className="flex items-center gap-1 text-accent font-black text-[10px] uppercase tracking-widest hover:underline">
                                <span className="material-icons text-sm">add</span> Add Year
                              </button>
                            </div>
                            {yearWiseFees.map((row, idx) => (
                              <div key={idx} className="flex items-center gap-4 mb-3">
                                <div className="w-24 shrink-0 font-bold text-sm text-slate-500 dark:text-slate-400">Year {row.year}:</div>
                                <input type="number" value={row.amount} onChange={e => updateYearFeeRow(idx, e.target.value)}
                                  className="flex-1 bg-white dark:bg-slate-800 border-none rounded-xl py-3 px-4 dark:text-white font-bold text-sm" placeholder="Amount (e.g. 50000)" />
                                <button type="button" onClick={() => removeYearFeeRow(idx)} className="text-red-400 hover:text-red-600 transition-colors p-2 shrink-0">
                                  <span className="material-icons">close</span>
                                </button>
                              </div>
                            ))}
                          </div>

                          {/* Specific Fees */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Admission Fee</label>
                              <input type="number" value={admissionFee} onChange={e => setAdmissionFee(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-4 px-5 dark:text-white font-bold text-sm" placeholder="e.g. 5000" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Health Card Fee</label>
                              <input type="number" value={healthCardFee} onChange={e => setHealthCardFee(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-4 px-5 dark:text-white font-bold text-sm" placeholder="e.g. 1500" />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Application Fee</label>
                              <input type="number" value={applicationFee} onChange={e => setApplicationFee(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-4 px-5 dark:text-white font-bold text-sm" placeholder="e.g. 1000" />
                            </div>
                          </div>
                        </div>

                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit"
                          className="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/30">
                          Save College & Cutoffs
                        </motion.button>
                      </form>
                    </motion.div>
                  ) : selectedCollegeId ? (
                    <motion.div
                      key={`details-${selectedCollegeId}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="bg-white dark:bg-slate-900 rounded-[2rem] p-10 shadow-2xl border border-slate-100 dark:border-slate-800"
                    >
                      {(() => {
                        const col = colleges.find(c => c.id === selectedCollegeId);
                        if (!col) return <p className="text-slate-400">College not found.</p>;
                        return (
                          <>
                            {/* College Header */}
                            <div className="flex justify-between items-start mb-10">
                              <div className="flex gap-6 items-start">
                                {col.logo && (
                                  <img 
                                    src={`${BASE_URL}${col.logo}`} 
                                    alt="Logo" 
                                    className="w-24 h-24 object-contain rounded-2xl bg-slate-50 dark:bg-slate-800 p-2 border border-slate-100 dark:border-slate-800 flex-shrink-0"
                                  />
                                )}
                                <div>
                                  <h3 className="font-display font-black text-3xl dark:text-white leading-tight">{col.name}</h3>
                                  <p className="text-xs text-accent uppercase tracking-[0.3em] font-black mt-2">{col.location}</p>
                                  {col.description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 max-w-2xl leading-relaxed">{col.description}</p>}
                                  {col.website && <a href={col.website} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-500 hover:text-blue-600 hover:underline mt-4 inline-flex items-center gap-2"><span className="material-icons text-sm">language</span> {col.website}</a>}
                                </div>
                              </div>
                              <div className="flex gap-2 flex-shrink-0">
                                <button onClick={() => { setAddCutoffCollegeId(addCutoffCollegeId === col.id ? null : col.id); }} 
                                  className="p-4 rounded-2xl bg-accent/10 text-accent hover:bg-accent hover:text-primary transition-all" title="Add Cutoff">
                                  <span className="material-icons">add_chart</span>
                                </button>
                                <button onClick={() => handleDeleteCollege(col.id)} 
                                  className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white transition-all" title="Delete College">
                                  <span className="material-icons">delete</span>
                                </button>
                              </div>
                            </div>

                            {/* Fee Structure Display */}
                            <div className="mb-10 bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 rounded-3xl p-8">
                              <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800/50 pb-4">
                                <span className="material-icons text-sm text-accent">account_balance_wallet</span> 
                                Fee Structure
                              </h4>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Year Wise Amounts */}
                                <div>
                                  <h5 className="text-[9px] uppercase font-black text-accent mb-4">Year Wise Amounts</h5>
                                  {col.yearWiseFees && col.yearWiseFees.length > 0 ? (
                                    <div className="space-y-3">
                                      {col.yearWiseFees.map((fee: any, idx: number) => (
                                        <div key={idx} className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl shadow-sm">
                                          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Year {fee.year}</span>
                                          <span className="text-xs font-black text-slate-800 dark:text-white">₹ {fee.amount}</span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">Not specified</p>
                                  )}
                                </div>

                                {/* Additional Fees */}
                                <div>
                                  <h5 className="text-[9px] uppercase font-black text-accent mb-4">Additional Fees</h5>
                                  {!(col.admissionFee || col.healthCardFee || col.applicationFee) ? (
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">None specified</p>
                                  ) : (
                                    <div className="space-y-3">
                                      {col.admissionFee && (
                                        <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl shadow-sm">
                                          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Admission Fee</span>
                                          <span className="text-xs font-black text-slate-800 dark:text-white">₹ {col.admissionFee}</span>
                                        </div>
                                      )}
                                      {col.healthCardFee && (
                                        <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl shadow-sm">
                                          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Health Card Fee</span>
                                          <span className="text-xs font-black text-slate-800 dark:text-white">₹ {col.healthCardFee}</span>
                                        </div>
                                      )}
                                      {col.applicationFee && (
                                        <div className="flex justify-between items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl shadow-sm">
                                          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Application Fee</span>
                                          <span className="text-xs font-black text-slate-800 dark:text-white">₹ {col.applicationFee}</span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Add Cutoff Inline Form */}
                            <AnimatePresence>
                              {addCutoffCollegeId === col.id && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="pb-8">
                                    <form
                                      onSubmit={handleAddCutoff}
                                      className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-accent/5 dark:bg-accent/10 rounded-2xl border border-accent/20"
                                    >
                                      <input required value={newCutoffCourse} onChange={e => setNewCutoffCourse(e.target.value)}
                                        className="bg-white dark:bg-slate-800 border-none rounded-xl py-4 px-5 text-sm font-bold dark:text-white" placeholder="Course Name" />
                                      <select value={newCutoffCategory} onChange={e => setNewCutoffCategory(e.target.value)}
                                        className="bg-white dark:bg-slate-800 border-none rounded-xl py-4 px-5 text-sm font-bold dark:text-white">
                                        <option>General</option><option>OBC</option><option>SC/ST</option><option>EWS</option>
                                      </select>
                                      <input required type="number" step="0.1" value={newCutoffMarks} onChange={e => setNewCutoffMarks(e.target.value)}
                                        className="bg-white dark:bg-slate-800 border-none rounded-xl py-4 px-5 text-sm font-bold dark:text-white" placeholder="Min Cutoff" />
                                      <button type="submit" className="bg-accent text-primary rounded-xl py-4 px-5 font-black uppercase tracking-widest text-xs">
                                        Add Cutoff
                                      </button>
                                    </form>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Cutoffs Table */}
                            <div>
                              <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2"><span className="material-icons text-accent">view_list</span> Courses & Cutoffs</h4>
                              {col.cutoffs && col.cutoffs.length > 0 ? (
                                <div className="rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
                                  <table className="w-full text-sm">
                                    <thead className="bg-slate-50 dark:bg-slate-800">
                                      <tr>
                                        <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Course</th>
                                        <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                                        <th className="text-left px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Min Cutoff</th>
                                        <th className="text-right px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {col.cutoffs.map((c: any) => (
                                        <tr key={c.id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                          <td className="px-6 py-5 font-bold text-slate-700 dark:text-slate-200">{c.courseName}</td>
                                          <td className="px-6 py-5">
                                            <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest">{c.category}</span>
                                          </td>
                                          <td className="px-6 py-5">
                                            <span className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-3 py-1.5 rounded-lg text-xs font-black">{c.minimumCutoff} Marks</span>
                                          </td>
                                          <td className="px-6 py-5 text-right">
                                            <button onClick={() => handleDeleteCutoff(c.id)} className="text-red-400 hover:text-red-600 transition-colors p-2" title="Delete cutoff">
                                              <span className="material-icons">close</span>
                                            </button>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <p className="text-xs italic text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl">No cutoff marks configured. Click the add button above to get started.</p>
                              )}
                            </div>
                          </>
                        );
                      })()}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty-state"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center p-20 text-center bg-white/50 dark:bg-slate-900/50 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800 h-full min-h-[600px]"
                    >
                      <span className="material-icons text-6xl text-slate-200 dark:text-slate-700 mb-6">touch_app</span>
                      <h3 className="text-xl font-bold dark:text-white mb-2">Select a college</h3>
                      <p className="text-slate-400 text-sm max-w-xs leading-relaxed">Choose a college from the left sidebar to view its details and cutoff marks, or click "Add College" to create a new one.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════ EMPLOYEES TAB ═══════════ */}
        {activeTab === 'employees' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-bold dark:text-white mb-8">Manage Employees</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Add Employee Form */}
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-10 shadow-2xl border border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold dark:text-white mb-6 flex items-center gap-2">
                  <span className="material-icons text-accent">person_add</span> Add Employee
                </h3>
                <form onSubmit={addEmployee} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Email</label>
                    <input required type="email" value={empEmail} onChange={e => setEmpEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-5 text-sm dark:text-white font-bold" placeholder="employee@ridge.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Password</label>
                    <input required type="password" value={empPassword} onChange={e => setEmpPassword(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-5 text-sm dark:text-white font-bold" placeholder="••••••••" />
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} type="submit"
                    className="w-full bg-accent text-primary py-4 rounded-2xl font-black uppercase tracking-widest text-xs mt-4">
                    Add Employee
                  </motion.button>
                </form>
              </div>

              {/* Employee List */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2rem] p-10 shadow-2xl border border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold dark:text-white mb-6 flex items-center gap-2">
                  <span className="material-icons text-accent">group</span> All Employees ({employees.length})
                </h3>
                {employees.length === 0 ? (
                  <p className="text-slate-400 text-sm italic">No employees registered yet.</p>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-auto custom-scrollbar pr-2">
                    {employees.map(emp => (
                      <div key={emp.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-white text-sm">{emp.email}</h4>
                          <p className="text-[9px] text-accent uppercase tracking-[0.3em] font-black mt-1">ID: {emp.id} · Employee</p>
                        </div>
                        <button onClick={() => deleteEmployee(emp.id)}
                          className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                          <span className="material-icons text-lg">delete</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════ BULK UPLOAD TAB ═══════════ */}
        {activeTab === 'bulk' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-bold dark:text-white mb-8">Bulk Upload Colleges</h2>

            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-10 shadow-2xl border border-slate-100 dark:border-slate-800 max-w-3xl">
              <div className="mb-8">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Expected Excel Format</h3>
                <div className="overflow-auto rounded-xl border border-slate-200 dark:border-slate-700">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800"><tr>
                      <th className="px-4 py-2 text-left font-black text-slate-500 uppercase tracking-widest">name</th>
                      <th className="px-4 py-2 text-left font-black text-slate-500 uppercase tracking-widest">location</th>
                      <th className="px-4 py-2 text-left font-black text-slate-500 uppercase tracking-widest">course</th>
                      <th className="px-4 py-2 text-left font-black text-slate-500 uppercase tracking-widest">category</th>
                      <th className="px-4 py-2 text-left font-black text-slate-500 uppercase tracking-widest">cutoff</th>
                    </tr></thead>
                    <tbody className="dark:text-slate-400"><tr className="border-t border-slate-100 dark:border-slate-800">
                      <td className="px-4 py-2">Anna University</td>
                      <td className="px-4 py-2">Chennai</td>
                      <td className="px-4 py-2">B.E CSE</td>
                      <td className="px-4 py-2">General</td>
                      <td className="px-4 py-2">195</td>
                    </tr></tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-4">
                <input type="file" accept=".xlsx,.xls,.csv" onChange={e => e.target.files && setFile(e.target.files[0])}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-accent transition-colors cursor-pointer" />
                <motion.button whileHover={{ scale: 1.02 }} onClick={submitPreview} disabled={!file}
                  className={`px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs ${file ? 'bg-primary text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>
                  Preview Data
                </motion.button>
              </div>

              {preview.length > 0 && (
                <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-8">
                  <h3 className="text-lg font-bold dark:text-white mb-4">Preview ({preview.length} rows)</h3>
                  <div className="overflow-auto max-h-80 mb-6 rounded-xl border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                      <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase font-bold text-slate-700 dark:text-white sticky top-0">
                        <tr>{Object.keys(preview[0]).map(k => <th key={k} className="px-6 py-3">{k}</th>)}</tr>
                      </thead>
                      <tbody>
                        {preview.map((row, i) => (
                          <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                            {Object.values(row).map((val: any, j) => <td key={j} className="px-6 py-4">{val}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} onClick={submitConfirm}
                    className="w-full bg-accent text-primary px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm">
                    ✅ Confirm & Import All
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ═══════════ CONSULTATIONS TAB ═══════════ */}
        {activeTab === 'consultations' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold dark:text-white">Consultation Requests</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddConsultation(!showAddConsultation)}
                className="flex items-center gap-2 bg-accent text-primary px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-accent/20"
              >
                <span className="material-icons text-lg">{showAddConsultation ? 'close' : 'add'}</span>
                {showAddConsultation ? 'Close' : 'Add Consultation'}
              </motion.button>
            </div>

            {showAddConsultation && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-8">
                <form onSubmit={handleManualAddConsultation} className="bg-white dark:bg-slate-900 rounded-[2rem] p-10 shadow-2xl border border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-bold dark:text-white mb-6 flex items-center gap-2">
                    <span className="material-icons text-accent">post_add</span> Manual Lead Entry
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Full Name</label>
                      <input required value={newConsultName} onChange={e => setNewConsultName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-5 text-sm dark:text-white font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Email</label>
                      <input required type="email" value={newConsultEmail} onChange={e => setNewConsultEmail(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-5 text-sm dark:text-white font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Phone</label>
                      <input required type="tel" value={newConsultPhone} onChange={e => setNewConsultPhone(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-5 text-sm dark:text-white font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Interest</label>
                      <select value={newConsultInterest} onChange={e => setNewConsultInterest(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-5 text-sm dark:text-white font-bold">
                        <option>Engineering Admissions</option>
                        <option>Pharmacy & Medical</option>
                        <option>Arts & Science</option>
                        <option>Scholarship Guidance</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Type</label>
                      <select value={newConsultType} onChange={e => setNewConsultType(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 px-5 text-sm dark:text-white font-bold">
                        <option value="Free">Free Consultation</option>
                        <option value="Paid">Paid Consultation</option>
                      </select>
                    </div>
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} type="submit" className="w-full lg:w-auto bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs">
                    Save New Lead
                  </motion.button>
                </form>
              </motion.div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-10 shadow-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
                <h3 className="text-lg font-bold dark:text-white flex items-center gap-2">
                  <span className="material-icons text-accent">email</span> Recent Requests ({consultations.length})
                </h3>
                
                <div className="flex items-center gap-4">
                  <select 
                    value={assignEmployeeId} 
                    onChange={e => setAssignEmployeeId(e.target.value ? Number(e.target.value) : '')}
                    className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl py-3 px-4 text-sm font-bold dark:text-white"
                  >
                    <option value="">Select Employee</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.email}</option>
                    ))}
                  </select>
                  <button 
                    onClick={assignSelectedConsultations}
                    disabled={selectedConsultations.length === 0 || !assignEmployeeId}
                    className="bg-accent text-primary px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-50 transition-all shadow-lg shadow-accent/20"
                  >
                    Assign Selected ({selectedConsultations.length})
                  </button>
                </div>
              </div>

              <div className="overflow-auto border border-slate-100 dark:border-slate-800 rounded-2xl max-h-[600px] custom-scrollbar">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase tracking-widest font-black text-slate-500 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-4">Select</th>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email & Phone</th>
                      <th className="px-6 py-4">Interest & Type</th>
                      <th className="px-6 py-4">Status & Assignment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consultations.length === 0 ? (
                      <tr><td colSpan={5} className="py-10 text-center text-slate-400 font-bold">No leads found.</td></tr>
                    ) : (
                      consultations.map(c => (
                        <tr key={c.id} className={`border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${selectedConsultations.includes(c.id) ? 'bg-accent/5 dark:bg-accent/5' : ''}`}>
                          <td className="px-6 py-5">
                            <input 
                              type="checkbox" 
                              checked={selectedConsultations.includes(c.id)}
                              onChange={() => toggleConsultationSelection(c.id)}
                              className="w-5 h-5 rounded border-slate-300 text-accent focus:ring-accent"
                            />
                          </td>
                          <td className="px-6 py-5 font-black text-slate-800 dark:text-white">{c.name}</td>
                          <td className="px-6 py-5 space-y-1">
                            <div className="font-bold text-slate-700 dark:text-slate-200">{c.email}</div>
                            <div className="text-xs text-slate-400 font-bold">{c.phone}</div>
                          </td>
                          <td className="px-6 py-5 space-y-1">
                            <div className="font-bold text-slate-700 dark:text-slate-200">{c.interest}</div>
                            <div className="text-[10px] uppercase tracking-widest font-black text-accent">{c.type} Consultation</div>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest ${
                              c.status === 'Completed' ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                              c.status === 'Dead Lead' ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                              c.status === 'Assigned' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                              'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                            }`}>
                              {c.status}
                            </span>
                            {c.employee && (
                              <div className="text-[10px] mt-2 font-bold text-slate-400">Assigned to: {c.employee.email}</div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
