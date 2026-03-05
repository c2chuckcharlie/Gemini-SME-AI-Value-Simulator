/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { 
  Globe, ChevronRight, ChevronLeft, Calculator, TrendingUp, 
  Clock, DollarSign, FileText, Bot, ShoppingCart, Megaphone, 
  LineChart as ChartIcon, Download, Info, CheckCircle2
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { translations } from './translations';
import { Language, CompanyData, Industry, CompanySize, AIUseCase, AISimulationConfig, ROIResults } from './types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export default function App() {
  const [lang, setLang] = useState<Language>('zh');
  const [step, setStep] = useState(0);
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Form States
  const [companyData, setCompanyData] = useState<CompanyData>({
    industry: 'retail',
    companySize: '1-10',
    monthlyLaborCost: 35000,
    customerInquiriesPerDay: 200,
    ordersProcessedPerDay: 50,
    avgHandlingTimePerInquiry: 5,
    avgProcessingTimePerOrder: 10,
  });

  const [selectedUseCases, setSelectedUseCases] = useState<string[]>(['csAutomation']);
  
  const [config, setConfig] = useState<AISimulationConfig>({
    automationRate: 70,
    timeReductionRate: 60,
    responseTimeImprovement: 80,
  });

  const t = (key: string) => translations[key]?.[lang] || key;

  // ROI Calculations
  const results = useMemo((): ROIResults => {
    const hourlyWage = companyData.monthlyLaborCost / 160; // Assume 160 hours per month
    
    // Daily time saved in minutes
    const inquiryTimeSaved = companyData.customerInquiriesPerDay * (config.automationRate / 100) * companyData.avgHandlingTimePerInquiry;
    const orderTimeSaved = companyData.ordersProcessedPerDay * (config.timeReductionRate / 100) * companyData.avgProcessingTimePerOrder;
    
    const dailyTimeSavedMinutes = inquiryTimeSaved + orderTimeSaved;
    const dailyTimeSavedHours = dailyTimeSavedMinutes / 60;
    
    const monthlySavings = dailyTimeSavedHours * 22 * hourlyWage; // 22 working days
    const annualSavings = monthlySavings * 12;
    
    // Realistic SME AI Cost (Subscription + Implementation)
    const estimatedCost = 50000 + (selectedUseCases.length * 20000); 
    
    const roi = ((annualSavings - estimatedCost) / estimatedCost) * 100;
    const paybackPeriod = estimatedCost / (annualSavings / 12);

    return {
      dailyTimeSaved: dailyTimeSavedHours,
      monthlySavings,
      annualSavings,
      estimatedCost,
      roi,
      paybackPeriod
    };
  }, [companyData, config, selectedUseCases]);

  const chartData = [
    { name: t('beforeAI'), time: (companyData.customerInquiriesPerDay * companyData.avgHandlingTimePerInquiry + companyData.ordersProcessedPerDay * companyData.avgProcessingTimePerOrder) / 60 },
    { name: t('afterAI'), time: ((companyData.customerInquiriesPerDay * companyData.avgHandlingTimePerInquiry * (1 - config.automationRate/100)) + (companyData.ordersProcessedPerDay * companyData.avgProcessingTimePerOrder * (1 - config.timeReductionRate/100))) / 60 },
  ];

  const costData = [
    { name: t('laborCost'), value: companyData.monthlyLaborCost - results.monthlySavings },
    { name: t('estimatedCost'), value: results.estimatedCost / 12 },
    { name: t('monthlySavings'), value: results.monthlySavings },
  ];

  const roiProjection = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    savings: (results.annualSavings / 12) * (i + 1),
    cost: results.estimatedCost
  }));

  const [summary, setSummary] = useState('');

  useEffect(() => {
    const text = lang === 'en' 
      ? `Based on your business inputs, implementing ${selectedUseCases.map(id => t(id)).join(', ')} could reduce operational labor costs by approximately NT$${results.annualSavings.toLocaleString()} annually and improve customer response time by ${config.responseTimeImprovement}%.`
      : `根據您的營運資料，導入 ${selectedUseCases.map(id => t(id)).join('、')} 每年可節省約 NT$${results.annualSavings.toLocaleString()} 人力成本，並將客戶回覆速度提升 ${config.responseTimeImprovement}%。`;
    setSummary(text);
  }, [lang, selectedUseCases, results, config]);

  const exportPDF = async () => {
    if (!dashboardRef.current) return;
    
    const canvas = await html2canvas(dashboardRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.setFontSize(20);
    pdf.text('Gemini SME AI Value Report', 20, 20);
    pdf.setFontSize(12);
    pdf.text(`Company Industry: ${t(companyData.industry)}`, 20, 30);
    pdf.text(`Annual Savings: NT$${results.annualSavings.toLocaleString()}`, 20, 40);
    pdf.text(`ROI: ${results.roi.toFixed(1)}%`, 20, 50);
    pdf.text(`Payback Period: ${results.paybackPeriod.toFixed(1)} months`, 20, 60);
    
    pdf.addImage(imgData, 'PNG', 0, 70, pdfWidth, pdfHeight);
    pdf.save('AI_Value_Report.pdf');
  };

  const useCases: AIUseCase[] = [
    { id: 'csAutomation', title: { en: 'AI Customer Service Automation', zh: 'AI 客服自動化' }, description: { en: 'AI can automatically answer common customer questions, reducing staff workload.', zh: 'AI 可自動回覆常見客戶問題，大幅減輕人力負擔。' }, icon: 'Bot' },
    { id: 'orderAutomation', title: { en: 'AI Order Processing Automation', zh: '訂單處理自動化' }, description: { en: 'Streamline order entry and validation using AI vision and natural language processing.', zh: '利用 AI 視覺與自然語言處理技術，自動化訂單輸入與驗證。' }, icon: 'ShoppingCart' },
    { id: 'marketingGen', title: { en: 'AI Marketing Content Generation', zh: 'AI 行銷內容生成' }, description: { en: 'Generate high-quality social media posts, ads, and product descriptions in seconds.', zh: '數秒內生成高品質社群貼文、廣告文案與產品描述。' }, icon: 'Megaphone' },
    { id: 'demandForecasting', title: { en: 'AI Demand Forecasting', zh: 'AI 需求預測' }, description: { en: 'Predict future sales trends to optimize inventory and reduce waste.', zh: '預測未來銷售趨勢，優化庫存管理並減少浪費。' }, icon: 'ChartIcon' },
  ];

  const renderIcon = (name: string) => {
    switch(name) {
      case 'Bot': return <Bot className="w-6 h-6" />;
      case 'ShoppingCart': return <ShoppingCart className="w-6 h-6" />;
      case 'Megaphone': return <Megaphone className="w-6 h-6" />;
      case 'ChartIcon': return <ChartIcon className="w-6 h-6" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-bottom border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <TrendingUp className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 hidden sm:block">
              {t('title')}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors text-sm font-medium"
            >
              <Globe className="w-4 h-4" />
              {lang === 'en' ? '繁體中文' : 'English'}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center min-h-[70vh] text-center"
            >
              <div className="mb-8 p-4 bg-blue-50 rounded-3xl">
                <Calculator className="w-16 h-16 text-blue-600" />
              </div>
              <h2 className="text-5xl font-extrabold mb-4 text-slate-900 tracking-tight">
                {t('title')}
              </h2>
              <p className="text-xl text-slate-600 mb-12 max-w-2xl">
                {t('subtitle')}
              </p>
              <button 
                onClick={() => setStep(1)}
                className="group relative px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2"
              >
                {t('startBtn')}
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {step > 0 && (
            <motion.div
              key="workflow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Sidebar Progress */}
              <div className="lg:col-span-3 space-y-4">
                {[1, 2, 3, 4].map((s) => (
                  <button
                    key={s}
                    onClick={() => s < step && setStep(s)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left",
                      step === s ? "bg-white border-blue-200 shadow-md" : "bg-transparent border-transparent opacity-60",
                      s < step && "cursor-pointer hover:bg-white/50"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                      step === s ? "bg-blue-600 text-white" : s < step ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-500"
                    )}>
                      {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Step 0{s}</p>
                      <p className="font-bold text-slate-800">{t(`step${s}`)}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Main Content Area */}
              <div className="lg:col-span-9 bg-white rounded-3xl shadow-sm border border-slate-200 p-8 min-h-[600px] flex flex-col">
                <div className="flex-grow">
                  {step === 1 && (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-slate-800 mb-6">{t('step1')}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">{t('industry')}</label>
                          <select 
                            value={companyData.industry}
                            onChange={(e) => setCompanyData({...companyData, industry: e.target.value as Industry})}
                            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                          >
                            <option value="retail">{t('retail')}</option>
                            <option value="food">{t('food')}</option>
                            <option value="hospitality">{t('hospitality')}</option>
                            <option value="manufacturing">{t('manufacturing')}</option>
                            <option value="other">{t('other')}</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">{t('companySize')}</label>
                          <select 
                            value={companyData.companySize}
                            onChange={(e) => setCompanyData({...companyData, companySize: e.target.value as CompanySize})}
                            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                          >
                            <option value="1-10">1–10 employees</option>
                            <option value="11-50">11–50 employees</option>
                            <option value="51-200">51–200 employees</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">{t('monthlyLaborCost')}</label>
                          <input 
                            type="number"
                            value={companyData.monthlyLaborCost}
                            onChange={(e) => setCompanyData({...companyData, monthlyLaborCost: Number(e.target.value)})}
                            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. 35000"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">{t('inquiriesPerDay')}</label>
                          <input 
                            type="number"
                            value={companyData.customerInquiriesPerDay}
                            onChange={(e) => setCompanyData({...companyData, customerInquiriesPerDay: Number(e.target.value)})}
                            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. 200"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">{t('handlingTimeInquiry')}</label>
                          <input 
                            type="number"
                            value={companyData.avgHandlingTimePerInquiry}
                            onChange={(e) => setCompanyData({...companyData, avgHandlingTimePerInquiry: Number(e.target.value)})}
                            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. 5"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">{t('ordersPerDay')}</label>
                          <input 
                            type="number"
                            value={companyData.ordersProcessedPerDay}
                            onChange={(e) => setCompanyData({...companyData, ordersProcessedPerDay: Number(e.target.value)})}
                            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. 50"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-slate-800 mb-6">{t('useCaseTitle')}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {useCases.map((uc) => (
                          <button
                            key={uc.id}
                            onClick={() => {
                              if (selectedUseCases.includes(uc.id)) {
                                setSelectedUseCases(selectedUseCases.filter(id => id !== uc.id));
                              } else {
                                setSelectedUseCases([...selectedUseCases, uc.id]);
                              }
                            }}
                            className={cn(
                              "p-6 rounded-2xl border-2 text-left transition-all group",
                              selectedUseCases.includes(uc.id) 
                                ? "border-blue-500 bg-blue-50/50 shadow-md" 
                                : "border-slate-100 hover:border-slate-200"
                            )}
                          >
                            <div className="flex items-start gap-4">
                              <div className={cn(
                                "p-3 rounded-xl transition-colors",
                                selectedUseCases.includes(uc.id) ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                              )}>
                                {renderIcon(uc.icon)}
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-800 mb-1">{uc.title[lang]}</h4>
                                <p className="text-sm text-slate-500 leading-relaxed">{uc.description[lang]}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-8">
                      <h3 className="text-2xl font-bold text-slate-800 mb-6">{t('configTitle')}</h3>
                      <div className="space-y-10 max-w-2xl">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <label className="font-bold text-slate-700">{t('automationRateLabel')}</label>
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">{config.automationRate}%</span>
                          </div>
                          <input 
                            type="range" min="0" max="100" step="5"
                            value={config.automationRate}
                            onChange={(e) => setConfig({...config, automationRate: Number(e.target.value)})}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          />
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <label className="font-bold text-slate-700">{t('timeReductionLabel')}</label>
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">{config.timeReductionRate}%</span>
                          </div>
                          <input 
                            type="range" min="0" max="100" step="5"
                            value={config.timeReductionRate}
                            onChange={(e) => setConfig({...config, timeReductionRate: Number(e.target.value)})}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          />
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <label className="font-bold text-slate-700">{t('improvementLabel')}</label>
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">{config.responseTimeImprovement}%</span>
                          </div>
                          <input 
                            type="range" min="0" max="100" step="5"
                            value={config.responseTimeImprovement}
                            onChange={(e) => setConfig({...config, responseTimeImprovement: Number(e.target.value)})}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-8" ref={dashboardRef}>
                      <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-bold text-slate-800">{t('dashboardTitle')}</h3>
                        <button 
                          onClick={exportPDF}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors text-sm font-bold"
                        >
                          <Download className="w-4 h-4" />
                          {t('exportBtn')}
                        </button>
                      </div>

                      {/* Key Metrics */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                          <p className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-1">{t('annualSavings')}</p>
                          <p className="text-3xl font-black text-blue-900">NT$ {results.annualSavings.toLocaleString()}</p>
                        </div>
                        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                          <p className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-1">{t('roi')}</p>
                          <p className="text-3xl font-black text-emerald-900">{results.roi.toFixed(1)}%</p>
                        </div>
                        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                          <p className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-1">{t('paybackPeriod')}</p>
                          <p className="text-3xl font-black text-amber-900">{results.paybackPeriod.toFixed(1)} {t('months')}</p>
                        </div>
                      </div>

                      {/* Charts */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                          <h4 className="font-bold text-slate-700 mb-4">{t('dailyTimeSaved')} ({t('hours')})</h4>
                          <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="time" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                          <h4 className="font-bold text-slate-700 mb-4">{t('laborCost')} Distribution</h4>
                          <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={costData}
                                  innerRadius={60}
                                  outerRadius={80}
                                  paddingAngle={5}
                                  dataKey="value"
                                >
                                  {costData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>

                      {/* Metrics Table */}
                      <div className="overflow-hidden rounded-2xl border border-slate-200">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50">
                              <th className="p-4 font-bold text-slate-600 border-b border-slate-200">{t('metric')}</th>
                              <th className="p-4 font-bold text-slate-600 border-b border-slate-200">{t('beforeAI')}</th>
                              <th className="p-4 font-bold text-slate-600 border-b border-slate-200">{t('afterAI')}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            <tr>
                              <td className="p-4 font-medium text-slate-700">{t('responseTime')}</td>
                              <td className="p-4 text-slate-500">~15-30 min</td>
                              <td className="p-4 text-emerald-600 font-bold">&lt; 1 min</td>
                            </tr>
                            <tr>
                              <td className="p-4 font-medium text-slate-700">{t('processingTime')}</td>
                              <td className="p-4 text-slate-500">{companyData.avgProcessingTimeOrder} min</td>
                              <td className="p-4 text-emerald-600 font-bold">{(companyData.avgProcessingTimeOrder * (1 - config.timeReductionRate/100)).toFixed(1)} min</td>
                            </tr>
                            <tr>
                              <td className="p-4 font-medium text-slate-700">{t('laborCost')}</td>
                              <td className="p-4 text-slate-500">NT$ {companyData.monthlyLaborCost.toLocaleString()}</td>
                              <td className="p-4 text-emerald-600 font-bold">NT$ {(companyData.monthlyLaborCost - results.monthlySavings).toLocaleString()}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Executive Summary */}
                      <div className="bg-slate-900 text-white p-8 rounded-3xl">
                        <div className="flex items-center gap-3 mb-4">
                          <FileText className="text-blue-400 w-6 h-6" />
                          <h4 className="text-xl font-bold">{t('summaryTitle')}</h4>
                        </div>
                        <textarea 
                          value={summary}
                          onChange={(e) => setSummary(e.target.value)}
                          className="w-full bg-slate-800 border-none rounded-xl p-4 text-slate-300 leading-relaxed focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                        />
                      </div>

                      {/* Recommendations */}
                      <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
                        <h4 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                          <Info className="w-5 h-5" />
                          {t('nextSteps')}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[t('chatbot'), t('marketingAuto'), t('salesForecasting')].map((step, i) => (
                            <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-blue-100 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                                {i + 1}
                              </div>
                              <span className="font-bold text-slate-700 text-sm">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="mt-12 flex justify-between items-center pt-8 border-t border-slate-100">
                  <button 
                    onClick={() => setStep(step - 1)}
                    className={cn(
                      "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all",
                      step === 1 ? "invisible" : "text-slate-500 hover:bg-slate-100"
                    )}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    {t('back')}
                  </button>
                  
                  {step < 4 && (
                    <button 
                      onClick={() => setStep(step + 1)}
                      className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
                    >
                      {t('next')}
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Demo Data Badge */}
      <div className="fixed bottom-6 right-6">
        <div className="bg-white/80 backdrop-blur shadow-lg border border-slate-200 px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold text-slate-500">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {t('demoMode')}
        </div>
      </div>
    </div>
  );
}
