import React, { useState } from 'react';
import { GlassPressCard } from './GlassPressCard';
import { 
  FileText, 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  Download, 
  MoreVertical, 
  Calendar, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Eye, 
  CheckCircle2, 
  AlertTriangle,
  FolderLock,
  Layers,
  Sparkles,
  X
} from 'lucide-react';

export interface VaultReportItem {
  id: string;
  reportNumber: string;
  cameraName: string;
  cameraId: string;
  building: string;
  prediction: 'Tampering Detected' | 'Nominal / Clean' | 'Investigating';
  generatedDate: string;
  generatedSubDate: string;
  fileSize: string;
  imageUrl: string;
  confidenceScore: number;
  integrityScore: number;
  extractedFeatures: { name: string; status: 'High' | 'Normal' | 'Abnormal' | 'Degraded'; value: string }[];
}

const INITIAL_REPORTS: VaultReportItem[] = [
  {
    id: 'REP-0145',
    reportNumber: 'REP-2026-0145',
    cameraName: 'Warehouse Gate',
    cameraId: 'Camera 03',
    building: 'West Facility',
    prediction: 'Tampering Detected',
    generatedDate: 'Today, 02:14 PM',
    generatedSubDate: '24 Jul 2026',
    fileSize: '2.8 MB',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
    confidenceScore: 98.6,
    integrityScore: 32,
    extractedFeatures: [
      { name: 'Spectral Entropy', status: 'High', value: '0.842' },
      { name: 'Dominant Frequency', status: 'Normal', value: '320 Hz' },
      { name: 'Energy Distribution', status: 'Abnormal', value: 'Mid-High Concentration' },
      { name: 'Edge Consistency', status: 'Degraded', value: '0.27 (Low)' },
    ]
  },
  {
    id: 'REP-0144',
    reportNumber: 'REP-2026-0144',
    cameraName: 'Parking Lot A',
    cameraId: 'Camera 07',
    building: 'South Yard',
    prediction: 'Nominal / Clean',
    generatedDate: 'Today, 11:37 AM',
    generatedSubDate: '24 Jul 2026',
    fileSize: '2.3 MB',
    imageUrl: 'https://images.unsplash.com/photo-1506521782020-185d6581813b?auto=format&fit=crop&w=600&q=80',
    confidenceScore: 99.2,
    integrityScore: 98,
    extractedFeatures: [
      { name: 'Spectral Entropy', status: 'Normal', value: '0.120' },
      { name: 'Dominant Frequency', status: 'Normal', value: '120 Hz' },
      { name: 'Energy Distribution', status: 'Normal', value: 'Uniform' },
      { name: 'Edge Consistency', status: 'Normal', value: '0.94 (Optimal)' },
    ]
  },
  {
    id: 'REP-0143',
    reportNumber: 'REP-2026-0143',
    cameraName: 'Main Lobby',
    cameraId: 'Camera 01',
    building: 'HQ Tower',
    prediction: 'Investigating',
    generatedDate: 'Yesterday, 09:21 PM',
    generatedSubDate: '23 Jul 2026',
    fileSize: '2.1 MB',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    confidenceScore: 84.5,
    integrityScore: 74,
    extractedFeatures: [
      { name: 'Spectral Entropy', status: 'Normal', value: '0.310' },
      { name: 'Dominant Frequency', status: 'Normal', value: '180 Hz' },
      { name: 'Energy Distribution', status: 'Abnormal', value: 'Minor Variance' },
      { name: 'Edge Consistency', status: 'Normal', value: '0.81 (Slight Drop)' },
    ]
  },
  {
    id: 'REP-0142',
    reportNumber: 'REP-2026-0142',
    cameraName: 'Outer Perimeter',
    cameraId: 'Camera 09',
    building: 'East Fence',
    prediction: 'Nominal / Clean',
    generatedDate: 'Yesterday, 04:52 PM',
    generatedSubDate: '23 Jul 2026',
    fileSize: '2.9 MB',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=600&q=80',
    confidenceScore: 99.5,
    integrityScore: 99,
    extractedFeatures: [
      { name: 'Spectral Entropy', status: 'Normal', value: '0.095' },
      { name: 'Dominant Frequency', status: 'Normal', value: '110 Hz' },
      { name: 'Energy Distribution', status: 'Normal', value: 'Uniform' },
      { name: 'Edge Consistency', status: 'Normal', value: '0.98' },
    ]
  },
  {
    id: 'REP-0141',
    reportNumber: 'REP-2026-0141',
    cameraName: 'Side Entrance',
    cameraId: 'Camera 04',
    building: 'North Alley',
    prediction: 'Tampering Detected',
    generatedDate: 'Yesterday, 02:10 PM',
    generatedSubDate: '23 Jul 2026',
    fileSize: '2.6 MB',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
    confidenceScore: 97.8,
    integrityScore: 28,
    extractedFeatures: [
      { name: 'Spectral Entropy', status: 'High', value: '0.910' },
      { name: 'Dominant Frequency', status: 'Abnormal', value: '410 Hz' },
      { name: 'Energy Distribution', status: 'Abnormal', value: 'High Band Spikes' },
      { name: 'Edge Consistency', status: 'Degraded', value: '0.19' },
    ]
  },
  {
    id: 'REP-0140',
    reportNumber: 'REP-2026-0140',
    cameraName: 'Rooftop View',
    cameraId: 'Camera 10',
    building: 'HQ Tower',
    prediction: 'Nominal / Clean',
    generatedDate: '22 Jul 2026, 10:08 PM',
    generatedSubDate: '22 Jul 2026',
    fileSize: '2.4 MB',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    confidenceScore: 99.1,
    integrityScore: 97,
    extractedFeatures: [
      { name: 'Spectral Entropy', status: 'Normal', value: '0.140' },
      { name: 'Dominant Frequency', status: 'Normal', value: '130 Hz' },
      { name: 'Energy Distribution', status: 'Normal', value: 'Uniform' },
      { name: 'Edge Consistency', status: 'Normal', value: '0.93' },
    ]
  },
  {
    id: 'REP-0139',
    reportNumber: 'REP-2026-0139',
    cameraName: 'Loading Dock B',
    cameraId: 'Camera 05',
    building: 'South Yard',
    prediction: 'Tampering Detected',
    generatedDate: '22 Jul 2026, 06:15 PM',
    generatedSubDate: '22 Jul 2026',
    fileSize: '3.1 MB',
    imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=600&q=80',
    confidenceScore: 96.4,
    integrityScore: 35,
    extractedFeatures: [
      { name: 'Spectral Entropy', status: 'High', value: '0.790' },
      { name: 'Dominant Frequency', status: 'Abnormal', value: '290 Hz' },
      { name: 'Energy Distribution', status: 'Abnormal', value: 'Mid-High Blur' },
      { name: 'Edge Consistency', status: 'Degraded', value: '0.31' },
    ]
  },
  {
    id: 'REP-0138',
    reportNumber: 'REP-2026-0138',
    cameraName: 'Server Room',
    cameraId: 'Camera 02',
    building: 'IT Section',
    prediction: 'Nominal / Clean',
    generatedDate: '21 Jul 2026, 03:40 PM',
    generatedSubDate: '21 Jul 2026',
    fileSize: '1.9 MB',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    confidenceScore: 99.8,
    integrityScore: 100,
    extractedFeatures: [
      { name: 'Spectral Entropy', status: 'Normal', value: '0.080' },
      { name: 'Dominant Frequency', status: 'Normal', value: '100 Hz' },
      { name: 'Energy Distribution', status: 'Normal', value: 'Pristine' },
      { name: 'Edge Consistency', status: 'Normal', value: '0.99' },
    ]
  }
];

export const VaultView: React.FC = () => {
  const [reportsList] = useState<VaultReportItem[]>(INITIAL_REPORTS);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'All' | 'Tampering' | 'Nominal' | 'Investigating'>('All');
  const [dateRangeFilter, setDateRangeFilter] = useState<'all' | 'week' | 'month'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReportForModal, setSelectedReportForModal] = useState<VaultReportItem | null>(null);

  // Filter logic
  const filteredReports = reportsList.filter((item) => {
    // Category filter
    if (activeCategoryFilter === 'Tampering' && item.prediction !== 'Tampering Detected') return false;
    if (activeCategoryFilter === 'Nominal' && item.prediction !== 'Nominal / Clean') return false;
    if (activeCategoryFilter === 'Investigating' && item.prediction !== 'Investigating') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = item.reportNumber.toLowerCase().includes(q);
      const matchCam = item.cameraName.toLowerCase().includes(q);
      const matchId = item.cameraId.toLowerCase().includes(q);
      const matchBldg = item.building.toLowerCase().includes(q);
      if (!matchNum && !matchCam && !matchId && !matchBldg) return false;
    }

    return true;
  });

  // Category capacity metrics (Max capacity = 50)
  const TOTAL_CATEGORY_CAPACITY = 50;
  const tamperingCount = 24;
  const nominalCount = 38;
  const investigatingCount = 12;

  const tamperingPercent = Math.round((tamperingCount / TOTAL_CATEGORY_CAPACITY) * 100);
  const nominalPercent = Math.round((nominalCount / TOTAL_CATEGORY_CAPACITY) * 100);
  const investigatingPercent = Math.round((investigatingCount / TOTAL_CATEGORY_CAPACITY) * 100);

  // PDF Export Handler for any report item
  const handleExportPdf = (report: VaultReportItem) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const isTampered = report.prediction === 'Tampering Detected';
    const isInvestigating = report.prediction === 'Investigating';
    
    const statusColor = isTampered ? '#e11d48' : isInvestigating ? '#d97706' : '#059669';
    const statusText = isTampered 
      ? 'TAMPERING DETECTED' 
      : isInvestigating 
      ? 'UNDER INVESTIGATION' 
      : 'NOMINAL INTEGRITY FEED';
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>SpectraGuard Forensic Report - ${report.reportNumber}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
              color: #0f172a; 
              padding: 40px; 
              background: #ffffff; 
              max-width: 900px;
              margin: 0 auto;
            }
            .header { 
              display: flex; 
              justify-content: space-between; 
              align-items: flex-start;
              border-bottom: 2px solid #e2e8f0; 
              padding-bottom: 20px; 
              margin-bottom: 30px; 
            }
            .logo-title { 
              font-size: 22px; 
              font-weight: 800; 
              color: #0f172a; 
              letter-spacing: -0.5px; 
            }
            .subtitle {
              color: #64748b;
              font-size: 13px;
              margin-top: 4px;
            }
            .badge { 
              padding: 6px 14px; 
              border-radius: 20px; 
              font-weight: 700; 
              font-size: 11px; 
              text-transform: uppercase; 
              letter-spacing: 0.5px;
              color: #ffffff; 
              background: ${statusColor}; 
              display: inline-block;
            }
            .meta-bar {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 16px;
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 16px;
              margin-bottom: 30px;
            }
            .meta-item label {
              font-size: 11px;
              text-transform: uppercase;
              color: #64748b;
              font-weight: 600;
              display: block;
              margin-bottom: 4px;
            }
            .meta-item span {
              font-size: 13px;
              font-weight: 700;
              color: #0f172a;
            }
            .grid-2 { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 20px; 
              margin-bottom: 30px; 
            }
            .card { 
              border: 1px solid #e2e8f0; 
              padding: 20px; 
              border-radius: 12px; 
              background: #f8fafc; 
            }
            .card h3 { 
              margin: 0 0 10px 0; 
              font-size: 12px; 
              color: #64748b; 
              text-transform: uppercase; 
              letter-spacing: 0.5px; 
              font-weight: 700;
            }
            .card .val { 
              font-size: 32px; 
              font-weight: 800; 
              color: #0f172a; 
            }
            .section-title {
              font-size: 15px;
              font-weight: 700;
              color: #0f172a;
              margin: 30px 0 12px 0;
              padding-bottom: 8px;
              border-bottom: 1px solid #e2e8f0;
            }
            .text-block {
              font-size: 13px;
              line-height: 1.6;
              color: #334155;
            }
            .table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 10px; 
            }
            .table th, .table td { 
              text-align: left; 
              padding: 10px 12px; 
              border-bottom: 1px solid #e2e8f0; 
              font-size: 12px; 
            }
            .table th { 
              background: #f1f5f9; 
              color: #475569; 
              font-weight: 700; 
            }
            .actions-list {
              padding-left: 20px;
              margin: 10px 0;
              font-size: 13px;
              color: #334155;
            }
            .actions-list li {
              margin-bottom: 6px;
            }
            .footer { 
              margin-top: 50px; 
              border-top: 1px solid #e2e8f0; 
              padding-top: 20px; 
              text-align: center; 
              font-size: 11px; 
              color: #94a3b8; 
            }
            @media print { 
              body { padding: 0; } 
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo-title">SpectraGuard AI Evidence Vault</div>
              <div class="subtitle">Official Investigation Report • ${report.reportNumber}</div>
            </div>
            <div style="text-align: right;">
              <div class="badge">${statusText}</div>
              <div class="subtitle" style="margin-top: 6px;">Generated: ${report.generatedDate}</div>
            </div>
          </div>

          <div class="meta-bar">
            <div class="meta-item">
              <label>Report ID</label>
              <span>${report.reportNumber}</span>
            </div>
            <div class="meta-item">
              <label>Camera Source</label>
              <span>${report.cameraName} (${report.cameraId})</span>
            </div>
            <div class="meta-item">
              <label>Facility Zone</label>
              <span>${report.building}</span>
            </div>
            <div class="meta-item">
              <label>File Package Size</label>
              <span>${report.fileSize}</span>
            </div>
          </div>

          <div class="grid-2">
            <div class="card">
              <h3>Inference Certainty</h3>
              <div class="val">${report.confidenceScore}%</div>
              <p style="margin: 6px 0 0; font-size: 12px; color: #64748b;">Random Forest Sub-Pixel Classification</p>
            </div>
            <div class="card">
              <h3>Feed Integrity Rating</h3>
              <div class="val" style="color: ${statusColor}">${report.integrityScore}%</div>
              <p style="margin: 6px 0 0; font-size: 12px; color: #64748b;">Frequency Spectrum Assessment</p>
            </div>
          </div>

          <div class="section-title">Forensic Assessment Summary</div>
          <div class="text-block">
            ${isTampered 
              ? `Media archive ${report.reportNumber} captured at ${report.cameraName} exhibits verified frequency-domain anomalies consistent with lens obstruction or camera defocusing. High-frequency energy drop coupled with elevated spectral entropy confirms partial physical occlusion.`
              : isInvestigating
              ? `Media archive ${report.reportNumber} captured at ${report.cameraName} is currently flagged for secondary human operator review due to minor environmental noise fluctuations. Automated inference confidence remains at ${report.confidenceScore}%.`
              : `Media archive ${report.reportNumber} captured at ${report.cameraName} shows pristine sub-pixel frequency distribution. No signs of optical tampering, defocusing, or digital manipulation detected across analyzed frames.`}
          </div>

          <div class="section-title">Extracted Features Audit</div>
          <table class="table">
            <thead>
              <tr>
                <th>Feature Metric</th>
                <th>Measured Value</th>
                <th>Evaluation Status</th>
              </tr>
            </thead>
            <tbody>
              ${report.extractedFeatures.map(f => `
                <tr>
                  <td>${f.name}</td>
                  <td>${f.value}</td>
                  <td><strong>${f.status}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="section-title">Audit Protocol & Recommendations</div>
          <ul class="actions-list">
            <li>Retain this digital evidence record in the SpectraGuard Vault for compliance audits.</li>
            <li>Cross-reference frequency spectrum signatures with neighboring camera feeds if necessary.</li>
            <li>Verify physical camera housing and lens hygiene if integrity rating is degraded.</li>
          </ul>

          <div class="footer">
            SpectraGuard AI Forensic Intelligence Platform • Evidence Vault Export • Page 1 of 1
          </div>

          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6 animate-fadeIn font-['SF_Pro_Text'] text-white max-w-[1600px] mx-auto pb-12">
      
      {/* SECTION 1: Top Dashboard Header Grid (2 Cards: Investigation Reports + Report Categories) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CARD 1: Investigation Reports Metric (6 cols) */}
        <div className="lg:col-span-6">
          <GlassPressCard className="p-6 space-y-5 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h2 className="text-sm font-bold text-white font-['SF_Pro_Display'] uppercase tracking-wider">
                  Investigation Reports
                </h2>
                <p className="text-xs text-slate-400 font-medium">Overall Forensic Audit Status</p>
              </div>
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <FileText className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-4xl font-extrabold text-white font-['SF_Pro_Display'] tracking-tight">
                128
              </span>
              <p className="text-xs text-slate-400 font-medium">
                Completed Investigation Reports in System
              </p>
            </div>

            {/* Progress Bars */}
            <div className="space-y-3.5 pt-2 border-t border-white/5">
              {/* Verified Reports Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-['SF_Pro_Text']">
                  <span className="text-slate-300">Verified Reports</span>
                  <span className="font-mono font-bold text-white">118 <span className="text-slate-500 font-normal">(92%)</span></span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-[92%] shadow-sm shadow-blue-500/50" />
                </div>
              </div>

              {/* Pending Review Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-['SF_Pro_Text']">
                  <span className="text-slate-300">Pending Review</span>
                  <span className="font-mono font-bold text-amber-400">10 <span className="text-slate-500 font-normal">(8%)</span></span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div className="h-full bg-amber-500 rounded-full w-[8%] shadow-sm shadow-amber-500/50" />
                </div>
              </div>
            </div>

            {/* Footer Timestamp */}
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 pt-2 border-t border-white/5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Last Generated</span>
              <span className="text-slate-200 font-semibold ml-auto">Today, 02:14 PM</span>
            </div>
          </GlassPressCard>
        </div>

        {/* CARD 2: Report Categories (6 cols) */}
        <div className="lg:col-span-6">
          <GlassPressCard className="p-6 space-y-5 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h2 className="text-sm font-bold text-white font-['SF_Pro_Display'] uppercase tracking-wider">
                  Report Categories
                </h2>
                <p className="text-xs text-slate-400 font-medium">Categorized by AI prediction severity</p>
              </div>
              <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-300">
                Category Distribution
              </span>
            </div>

            {/* 3 Internal Category Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-auto">
              
              {/* Tampering Category */}
              <div 
                onClick={() => setActiveCategoryFilter('Tampering')}
                className={`p-4 rounded-2xl bg-black/40 border transition-all cursor-pointer flex flex-col justify-between space-y-3.5 group ${
                  activeCategoryFilter === 'Tampering' 
                    ? 'border-rose-500 bg-rose-950/20 ring-1 ring-rose-500/50' 
                    : 'border-white/10 hover:border-rose-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <ShieldAlert className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-[10px] font-mono text-rose-400/90 font-bold bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-500/30">
                    {tamperingPercent}%
                  </span>
                </div>

                <div>
                  <span className="text-xs font-medium text-slate-400 block">Tampering</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-extrabold text-white font-['SF_Pro_Display']">{tamperingCount}</span>
                  </div>
                </div>

                {/* Dynamic Progress Bar */}
                <div className="space-y-1">
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full transition-all duration-500 shadow-sm shadow-rose-500/50"
                      style={{ width: `${tamperingPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Nominal Category */}
              <div 
                onClick={() => setActiveCategoryFilter('Nominal')}
                className={`p-4 rounded-2xl bg-black/40 border transition-all cursor-pointer flex flex-col justify-between space-y-3.5 group ${
                  activeCategoryFilter === 'Nominal' 
                    ? 'border-emerald-500 bg-emerald-950/20 ring-1 ring-emerald-500/50' 
                    : 'border-white/10 hover:border-emerald-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400/90 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    {nominalPercent}%
                  </span>
                </div>

                <div>
                  <span className="text-xs font-medium text-slate-400 block">Nominal</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-extrabold text-white font-['SF_Pro_Display']">{nominalCount}</span>
                  </div>
                </div>

                {/* Dynamic Progress Bar */}
                <div className="space-y-1">
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-500 shadow-sm shadow-emerald-500/50"
                      style={{ width: `${nominalPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Investigating Category */}
              <div 
                onClick={() => setActiveCategoryFilter('Investigating')}
                className={`p-4 rounded-2xl bg-black/40 border transition-all cursor-pointer flex flex-col justify-between space-y-3.5 group ${
                  activeCategoryFilter === 'Investigating' 
                    ? 'border-amber-500 bg-amber-950/20 ring-1 ring-amber-500/50' 
                    : 'border-white/10 hover:border-amber-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <AlertTriangle className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-[10px] font-mono text-amber-400/90 font-bold bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
                    {investigatingPercent}%
                  </span>
                </div>

                <div>
                  <span className="text-xs font-medium text-slate-400 block">Investigating</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-extrabold text-white font-['SF_Pro_Display']">{investigatingCount}</span>
                  </div>
                </div>

                {/* Dynamic Progress Bar */}
                <div className="space-y-1">
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all duration-500 shadow-sm shadow-amber-500/50"
                      style={{ width: `${investigatingPercent}%` }}
                    />
                  </div>
                </div>
              </div>

            </div>
          </GlassPressCard>
        </div>

      </div>

      {/* SECTION 2: Filter Toolbar (Pill Filters, Date Range, Search & Filter Button) */}
      <div className="p-4 rounded-3xl bg-white/[0.03] border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-['SF_Pro_Text'] shadow-lg backdrop-blur-md">
        
        {/* Left: Category Pill Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveCategoryFilter('All')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeCategoryFilter === 'All'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/40'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            <FolderLock className="w-3.5 h-3.5" />
            <span>All Reports</span>
          </button>

          <button
            onClick={() => setActiveCategoryFilter('Tampering')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCategoryFilter === 'Tampering'
                ? 'bg-rose-950/80 text-rose-300 border border-rose-500/50 shadow-md shadow-rose-950/50'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Tampering</span>
          </button>

          <button
            onClick={() => setActiveCategoryFilter('Nominal')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCategoryFilter === 'Nominal'
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 shadow-md shadow-emerald-950/50'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Nominal</span>
          </button>

          <button
            onClick={() => setActiveCategoryFilter('Investigating')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeCategoryFilter === 'Investigating'
                ? 'bg-amber-950/80 text-amber-300 border border-amber-500/50 shadow-md shadow-amber-950/50'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Investigating</span>
          </button>
        </div>

        {/* Right: Date range buttons & Search Filter Input */}
        <div className="flex items-center gap-3 flex-wrap">
          
          <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-2xl p-1">
            <button
              onClick={() => setDateRangeFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                dateRangeFilter === 'all' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 inline mr-1" />
              <span>All Time</span>
            </button>
            <button
              onClick={() => setDateRangeFilter('week')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                dateRangeFilter === 'week' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>This Week</span>
            </button>
            <button
              onClick={() => setDateRangeFilter('month')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                dateRangeFilter === 'month' ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>This Month</span>
            </button>
          </div>

          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/15 focus:border-purple-500 rounded-2xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none transition-colors"
            />
          </div>

          <button className="px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/15 flex items-center gap-1.5 font-semibold cursor-pointer">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filters</span>
          </button>

        </div>

      </div>

      {/* SECTION 3: Main Investigation Reports Table */}
      <GlassPressCard className="p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-base font-bold text-white font-['SF_Pro_Display']">
            Investigation Reports
          </h2>
          <span className="text-xs font-mono text-slate-400">
            {filteredReports.length} records in view
          </span>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-['SF_Pro_Text'] border-separate border-spacing-y-2">
            <thead>
              <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-['SF_Pro_Display'] border-b border-white/10 pb-2">
                <th className="pb-2 pl-3">REPORT ID</th>
                <th className="pb-2">CAMERA</th>
                <th className="pb-2">PREDICTION</th>
                <th className="pb-2">GENERATED</th>
                <th className="pb-2 pr-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No reports match your selected criteria.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => {
                  const isTampered = report.prediction === 'Tampering Detected';
                  const isInvestigating = report.prediction === 'Investigating';

                  return (
                    <tr
                      key={report.id}
                      className="bg-black/40 hover:bg-white/[0.04] border border-white/5 transition-all group rounded-2xl"
                    >
                      {/* REPORT ID + Thumbnail */}
                      <td className="py-3 pl-3 rounded-l-2xl">
                        <div className="flex items-center gap-3">
                          <div 
                            onClick={() => setSelectedReportForModal(report)}
                            className="w-12 h-9 rounded-lg overflow-hidden bg-slate-900 border border-white/10 relative shrink-0 cursor-pointer group-hover:border-purple-400/50"
                          >
                            <img 
                              src={report.imageUrl} 
                              alt={report.reportNumber}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className={`absolute top-0.5 left-0.5 p-0.5 rounded border ${
                              isTampered
                                ? 'bg-rose-950/90 text-rose-400 border-rose-500/50'
                                : isInvestigating
                                ? 'bg-amber-950/90 text-amber-400 border-amber-500/50'
                                : 'bg-emerald-950/90 text-emerald-400 border-emerald-500/50'
                            }`}>
                              {isTampered ? (
                                <ShieldAlert className="w-2.5 h-2.5" />
                              ) : isInvestigating ? (
                                <AlertTriangle className="w-2.5 h-2.5" />
                              ) : (
                                <ShieldCheck className="w-2.5 h-2.5" />
                              )}
                            </div>
                          </div>

                          <div>
                            <span 
                              onClick={() => setSelectedReportForModal(report)}
                              className="font-bold font-mono text-white group-hover:text-purple-300 transition-colors block cursor-pointer"
                            >
                              {report.reportNumber}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {report.fileSize}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* CAMERA */}
                      <td className="py-3">
                        <span className="font-semibold text-slate-200 block">
                          {report.cameraName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {report.cameraId} • {report.building}
                        </span>
                      </td>

                      {/* PREDICTION */}
                      <td className="py-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                          isTampered
                            ? 'text-rose-400 bg-rose-950/60 border-rose-500/40'
                            : isInvestigating
                            ? 'text-amber-400 bg-amber-950/60 border-amber-500/40'
                            : 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            isTampered ? 'bg-rose-400 animate-ping' : isInvestigating ? 'bg-amber-400' : 'bg-emerald-400'
                          }`} />
                          <span>{report.prediction}</span>
                        </span>
                      </td>

                      {/* GENERATED */}
                      <td className="py-3">
                        <span className="font-semibold text-slate-200 block">
                          {report.generatedDate}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {report.generatedSubDate}
                        </span>
                      </td>

                      {/* ACTION */}
                      <td className="py-3 pr-3 text-right rounded-r-2xl">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleExportPdf(report)}
                            className="px-3 py-1.5 rounded-xl bg-blue-600/80 hover:bg-blue-500 text-white font-bold text-xs font-['SF_Pro_Text'] shadow-md shadow-blue-900/30 transition-all flex items-center gap-1.5 cursor-pointer border border-blue-400/30"
                            title="Download PDF Forensic Report"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download PDF</span>
                          </button>

                          <button
                            onClick={() => setSelectedReportForModal(report)}
                            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title="Inspect Report Details"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-['SF_Pro_Text']">
          <span>Showing 1 to {filteredReports.length} of 128 reports</span>

          <div className="flex items-center gap-2 font-mono">
            <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-lg shadow-purple-600/30">
              1
            </button>
            <button className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer">
              2
            </button>
            <button className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer">
              3
            </button>
            <button className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer">
              4
            </button>
            <button className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer">
              5
            </button>
            <span className="text-slate-500">...</span>
            <button className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs flex items-center justify-center transition-colors cursor-pointer">
              16
            </button>
            <button className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </GlassPressCard>

      {/* REPORT DETAIL PREVIEW MODAL */}
      {selectedReportForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-2xl rounded-3xl bg-[#0b0e1b] border border-white/20 p-6 space-y-6 shadow-2xl relative overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest block">
                  Vault Evidence Record
                </span>
                <h3 className="text-xl font-bold text-white font-['SF_Pro_Display']">
                  {selectedReportForModal.reportNumber}
                </h3>
              </div>

              <button
                onClick={() => setSelectedReportForModal(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Media Thumbnail */}
              <div className="w-full h-48 rounded-2xl overflow-hidden bg-slate-900 relative border border-white/15 shadow-inner">
                <img
                  src={selectedReportForModal.imageUrl}
                  alt={selectedReportForModal.reportNumber}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-3 left-3 text-xs font-mono font-bold text-slate-200 bg-black/80 px-2.5 py-1 rounded-lg border border-white/10">
                  {selectedReportForModal.generatedDate}
                </span>
              </div>

              {/* Status & Scores */}
              <div className="space-y-4 flex flex-col justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-medium block mb-1">
                    Prediction Status
                  </span>
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${
                    selectedReportForModal.prediction === 'Tampering Detected'
                      ? 'text-rose-400 bg-rose-950/80 border-rose-500/40'
                      : selectedReportForModal.prediction === 'Investigating'
                      ? 'text-amber-400 bg-amber-950/80 border-amber-500/40'
                      : 'text-emerald-400 bg-emerald-950/80 border-emerald-500/40'
                  }`}>
                    <span className="w-2 h-2 rounded-full bg-current" />
                    <span>{selectedReportForModal.prediction}</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <span className="text-[10px] text-slate-400 block font-medium">Confidence</span>
                    <span className="text-lg font-bold text-white font-['SF_Pro_Display']">
                      {selectedReportForModal.confidenceScore}%
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <span className="text-[10px] text-slate-400 block font-medium">Integrity</span>
                    <span className="text-lg font-bold text-white font-['SF_Pro_Display']">
                      {selectedReportForModal.integrityScore}%
                    </span>
                  </div>
                </div>

                <div className="text-xs space-y-1 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Camera Source:</span>
                    <span className="font-semibold">{selectedReportForModal.cameraName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Facility Zone:</span>
                    <span className="font-semibold">{selectedReportForModal.building}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Archive Size:</span>
                    <span className="font-semibold font-mono">{selectedReportForModal.fileSize}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Extracted Features List */}
            <div className="space-y-2 border-t border-white/10 pt-4">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-['SF_Pro_Display'] block">
                Extracted Features Audit
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {selectedReportForModal.extractedFeatures.map((feat, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between">
                    <span className="text-slate-300">{feat.name}</span>
                    <span className="font-mono font-bold text-purple-300">{feat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
              <button
                onClick={() => setSelectedReportForModal(null)}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleExportPdf(selectedReportForModal);
                  setSelectedReportForModal(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF Forensic Report</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
