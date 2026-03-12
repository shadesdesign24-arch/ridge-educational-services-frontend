import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_URL, BASE_URL } from '../constants';

const EmployeePanel: React.FC = () => {
  const navigate = useNavigate();
  const [courseName, setCourseName] = useState('');
  const [category, setCategory] = useState('General');
  const [marks, setMarks] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [eligibleColleges, setEligibleColleges] = useState<any[]>([]);
  const [expandedColleges, setExpandedColleges] = useState<number[]>([]);
  
  const [activeTab, setActiveTab] = useState<'eligibility' | 'consultations'>('eligibility');
  const [consultations, setConsultations] = useState<any[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  const token = sessionStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  React.useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      const res = await axios.get(`${API_URL}/employee/consultations`, { headers });
      setConsultations(res.data);
    } catch (err) { console.error(err); }
  };

  const updateConsultationStatus = async (id: number, status: string) => {
    try {
      await axios.put(`${API_URL}/employee/consultations/${id}/status`, { status }, { headers });
      toast.success('Status updated');
      fetchConsultations();
    } catch (err) { toast.error('Error updating status'); }
  };

  const checkEligibility = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/employee/check-eligibility`, {
        courseName,
        category,
        studentCutoffMarks: parseFloat(marks)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEligibleColleges(res.data.eligibleColleges);
      toast.success('Eligibility checked');
    } catch (err) {
      console.error(err);
      toast.error('Error fetching eligibility');
    }
  };

  const handleBook = async (collegeId: number) => {
    if (!studentName) return toast.error('Please enter student name above.');
    try {
      await axios.post(`${API_URL}/employee/book`, {
        collegeId,
        studentName,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Booking Confirmed Successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !studentPhone) return toast.error('Enter student details');
    try {
      await axios.post(`${API_URL}/employee/follow-up`, {
        studentName,
        studentPhone,
        notes: `Interested in ${courseName}. Cutoff marks: ${marks}`,
        status: 'WARM'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Follow-up saved to CRM successfully.');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark font-sans p-10 transition-colors duration-500">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-display font-black text-primary dark:text-white tracking-tighter">
            Employee Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('eligibility')}
              className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                activeTab === 'eligibility' ? 'bg-primary text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              Eligibility & CRM
            </button>
            <button
              onClick={() => setActiveTab('consultations')}
              className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                activeTab === 'consultations' ? 'bg-primary text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              My Leads
            </button>
            <button
              onClick={() => { sessionStorage.clear(); navigate('/login'); }}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white font-black text-xs uppercase tracking-widest transition-all ml-2"
            >
              <span className="material-icons text-lg">logout</span>
              Logout
            </button>
          </div>
        </div>

        {activeTab === 'eligibility' && (

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-10">
            {/* Student Search Config */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 rounded-[2rem] p-10 shadow-2xl border border-slate-100 dark:border-slate-800">
              <h2 className="text-2xl font-bold dark:text-white mb-8">Eligibility Checker</h2>
              <form onSubmit={checkEligibility} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Student Marks</label>
                  <input required type="number" step="0.1" value={marks} onChange={(e) => setMarks(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-3xl py-5 px-6 dark:text-white font-bold" placeholder="195.5" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Course</label>
                    <input required type="text" value={courseName} onChange={(e) => setCourseName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-3xl py-5 px-6 dark:text-white font-bold" placeholder="B.E Computer Science" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-3xl py-5 px-6 dark:text-white font-bold">
                      <option>General</option>
                      <option>OBC</option>
                      <option>SC/ST</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full bg-accent text-primary font-black py-5 rounded-3xl shadow-2xl transition-all text-sm uppercase tracking-[0.2em] mt-8 hover:bg-yellow-400">
                  Find Eligible Colleges
                </button>
              </form>
            </motion.div>

            {/* Student CRM Details */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-900 rounded-[2rem] p-10 shadow-2xl border border-slate-100 dark:border-slate-800">
              <h2 className="text-2xl font-bold dark:text-white mb-8">Student CRM Details</h2>
              <form onSubmit={handleFollowUp} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Full Name</label>
                  <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-3xl py-5 px-6 dark:text-white font-bold" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Phone Number</label>
                  <input type="tel" value={studentPhone} onChange={(e) => setStudentPhone(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-3xl py-5 px-6 dark:text-white font-bold" placeholder="+91 999..." />
                </div>
                <button type="submit" className="w-full bg-primary text-white font-black py-5 rounded-3xl shadow-2xl shadow-primary/30 transition-all text-sm uppercase tracking-[0.2em] mt-8">
                  Save to Follow-Up
                </button>
              </form>
            </motion.div>
          </div>

          {/* Results View */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-10 shadow-2xl border border-slate-100 dark:border-slate-800 relative">
            <h2 className="text-2xl font-bold dark:text-white mb-8">Matching Colleges</h2>
            <div className="space-y-6 max-h-[700px] overflow-auto custom-scrollbar pr-4">
              {eligibleColleges.length === 0 ? (
                <div className="text-center py-20 text-slate-400 font-medium italic">
                  Run a search to see eligible colleges for the student.
                </div>
              ) : (
                eligibleColleges.map((match, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="p-8 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-accent transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-4 items-start">
                        {match.college.logo && (
                          <img 
                            src={`${BASE_URL}${match.college.logo}`} 
                            alt="Logo" 
                            className="w-14 h-14 object-contain rounded-xl bg-white dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800"
                          />
                        )}
                        <div>
                          <h3 className="font-display font-black text-2xl dark:text-white mb-1 group-hover:text-accent transition-colors">{match.college.name}</h3>
                          <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{match.college.location}</p>
                        </div>
                      </div>
                      <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
                        Match
                      </div>
                    </div>
                    <div className="flex gap-4 items-center bg-white dark:bg-slate-900 p-4 rounded-xl mb-4 border border-slate-200 dark:border-slate-700">
                      <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 font-bold text-sm">
                        Req: {match.cutoffDetails.minimumCutoff}
                      </div>
                      <span className="text-slate-400 text-sm">|</span>
                      <div className="text-accent font-black text-sm uppercase tracking-widest">
                        {match.cutoffDetails.courseName}
                      </div>
                    </div>

                    {/* Fee Structure - Always Visible */}
                    <div className="mb-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl w-full">
                      <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                        <span className="material-icons text-accent text-sm">account_balance_wallet</span>
                        Fee Structure
                      </h4>
                      
                      {match.college.yearWiseFees && match.college.yearWiseFees.length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-[9px] uppercase font-black text-accent mb-2">Year Wise Amount</h5>
                          <div className="space-y-2">
                            {match.college.yearWiseFees.map((fee: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                                <span>Year {fee.year}</span>
                                <span className="bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-100 dark:border-slate-700">₹ {fee.amount}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {(match.college.admissionFee || match.college.healthCardFee || match.college.applicationFee) && (
                        <div>
                          <h5 className="text-[9px] uppercase font-black text-accent mb-2">Additional Fees</h5>
                          <div className="space-y-2">
                            {match.college.admissionFee && (
                              <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                                <span>Admission Fee</span>
                                <span className="bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-100 dark:border-slate-700">₹ {match.college.admissionFee}</span>
                              </div>
                            )}
                            {match.college.healthCardFee && (
                              <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                                <span>Health Card Fee</span>
                                <span className="bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-100 dark:border-slate-700">₹ {match.college.healthCardFee}</span>
                              </div>
                            )}
                            {match.college.applicationFee && (
                              <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                                <span>Application Fee</span>
                                <span className="bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-100 dark:border-slate-700">₹ {match.college.applicationFee}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {(!match.college.yearWiseFees || match.college.yearWiseFees.length === 0) && !match.college.admissionFee && !match.college.healthCardFee && !match.college.applicationFee && (
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest py-3 text-center bg-slate-50 dark:bg-slate-800 rounded-xl">No fee details available.</p>
                      )}
                    </div>

                    <button onClick={() => handleBook(match.college.id)} className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white font-black py-4 rounded-xl hover:border-accent hover:text-primary hover:bg-accent transition-all uppercase tracking-widest text-xs">
                      <span className="material-icons text-sm">assignment_turned_in</span> Book Admission
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
        )}

        {/* ═══════════ CONSULTATIONS TAB ═══════════ */}
        {activeTab === 'consultations' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-bold dark:text-white mb-8">My Assigned Leads</h2>

            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-10 shadow-2xl border border-slate-100 dark:border-slate-800">
              <div className="overflow-auto border border-slate-100 dark:border-slate-800 rounded-2xl max-h-[600px] custom-scrollbar">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-xs uppercase tracking-widest font-black text-slate-500 sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Contact</th>
                      <th className="px-6 py-4">Interest & Type</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consultations.length === 0 ? (
                      <tr><td colSpan={5} className="py-10 text-center text-slate-400 font-bold">No leads assigned to you yet.</td></tr>
                    ) : (
                      consultations.map(c => (
                        <tr key={c.id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-5 font-black text-slate-800 dark:text-white">{c.name}</td>
                          <td className="px-6 py-5 space-y-1">
                            <div className="font-bold text-slate-700 dark:text-slate-200">{c.email}</div>
                            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-black flex items-center gap-1"><span className="material-icons text-[12px]">phone</span> {c.phone}</div>
                          </td>
                          <td className="px-6 py-5 space-y-1">
                            <div className="font-bold text-slate-700 dark:text-slate-200">{c.interest}</div>
                            <div className="text-[10px] uppercase tracking-widest font-black text-accent">{c.type} Consultation</div>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`inline-flex px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest ${
                              c.status === 'Completed' ? 'bg-green-50 text-green-600' :
                              c.status === 'Dead Lead' ? 'bg-red-50 text-red-600' :
                              'bg-amber-50 text-amber-600'
                            }`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="relative">
                              <button 
                                onClick={() => setOpenDropdownId(openDropdownId === c.id ? null : c.id)}
                                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 text-xs font-bold dark:text-white flex items-center justify-between min-w-[160px] focus:outline-none hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                              >
                                {c.status === 'Completed' ? 'Complete (Convert)' : c.status} 
                                <span className={`material-icons text-[16px] text-slate-400 transition-transform duration-200 ${openDropdownId === c.id ? 'rotate-180' : ''}`}>expand_more</span>
                              </button>
                              
                              <AnimatePresence>
                                {openDropdownId === c.id && (
                                  <>
                                    <div 
                                      className="fixed inset-0 z-40" 
                                      onClick={() => setOpenDropdownId(null)}
                                    />
                                    <motion.div
                                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                      transition={{ duration: 0.15 }}
                                      className="absolute right-0 mt-2 w-[180px] bg-white dark:bg-slate-800 rounded-2xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.15)] dark:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-slate-700 overflow-hidden z-50 p-2"
                                    >
                                      {[
                                        { val: 'Assigned', label: 'Assigned' },
                                        { val: 'Completed', label: 'Complete (Convert)' },
                                        { val: 'Dead Lead', label: 'Dead Lead' }
                                      ].map(opt => (
                                        <button
                                          key={opt.val}
                                          onClick={() => {
                                            updateConsultationStatus(c.id, opt.val);
                                            setOpenDropdownId(null);
                                          }}
                                          className={`w-full text-left px-4 py-3 text-xs font-bold rounded-xl transition-all ${c.status === opt.val ? 'bg-accent/10 text-accent' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                                        >
                                          {opt.label}
                                        </button>
                                      ))}
                                    </motion.div>
                                  </>
                                )}
                              </AnimatePresence>
                            </div>
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

export default EmployeePanel;
