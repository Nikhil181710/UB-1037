import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { FileText, Upload, Trash2, Download, Plus, Loader2, File, Image as ImageIcon } from 'lucide-react';
import { api } from '../../services/api';

export default function Reports() {
  const [reports, setReports] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await api.get('/reports');
      setReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('report', file);
    formData.append('name', file.name);
    formData.append('type', file.type.includes('pdf') ? 'pdf' : 'image');

    try {
      await api.upload('/reports', formData);
      fetchReports();
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      try {
        await api.delete(`/reports/${id}`);
        fetchReports();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDownload = async (id: number, name: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/reports/${id}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Health Reports</h2>
          <p className="text-slate-500">Securely store and manage your medical documents.</p>
        </div>
        <div className="relative">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleUpload}
            className="hidden"
            accept=".pdf,image/*"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-2xl font-bold hover:bg-amber-600 transition-all shadow-lg shadow-amber-200 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={20} />
                Upload Report
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <motion.div 
            key={report.id}
            layout
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${report.type === 'pdf' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'}`}>
                {report.type === 'pdf' ? <FileText size={28} /> : <ImageIcon size={28} />}
              </div>
              <div className="max-w-[150px] md:max-w-[200px]">
                <h3 className="font-bold text-slate-900 truncate" title={report.name}>{report.name}</h3>
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">
                  {report.type} • {new Date(report.timestamp).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleDownload(report.id, report.name)}
                className="p-3 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                title="Download"
              >
                <Download size={20} />
              </button>
              <button 
                onClick={() => handleDelete(report.id)}
                className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                title="Delete"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </motion.div>
        ))}
        {reports.length === 0 && !loading && (
          <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <File size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-900">No reports uploaded</h3>
            <p className="text-slate-500">Keep your medical history organized in one place.</p>
          </div>
        )}
      </div>
    </div>
  );
}
