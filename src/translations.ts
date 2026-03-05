import { Language } from './types';

export const translations: Record<string, Record<Language, string>> = {
  title: {
    en: 'Gemini SME AI Value Simulator',
    zh: 'Gemini AI 導入價值模擬器（中小企業版）',
  },
  subtitle: {
    en: 'Discover how AI can transform your business operations.',
    zh: '探索 AI 如何提升企業效率並創造商業價值',
  },
  startBtn: {
    en: 'Start Simulation',
    zh: '開始模擬',
  },
  // Tabs/Steps
  step1: { en: 'Company Profile', zh: '企業概況' },
  step2: { en: 'AI Solutions', zh: 'AI 解決方案' },
  step3: { en: 'Impact Config', zh: '影響設定' },
  step4: { en: 'ROI Dashboard', zh: 'ROI 儀表板' },
  
  // Module 1: Company Profile
  industry: { en: 'Industry', zh: '產業類別' },
  companySize: { en: 'Company Size', zh: '企業規模' },
  monthlyLaborCost: { en: 'Monthly Labor Cost (NTD)', zh: '每月人力成本 (NTD)' },
  inquiriesPerDay: { en: 'Customer Inquiries per Day', zh: '每日客戶諮詢量' },
  ordersPerDay: { en: 'Orders Processed per Day', zh: '每日訂單處理量' },
  handlingTimeInquiry: { en: 'Avg. Handling Time per Inquiry (min)', zh: '平均諮詢處理時間 (分鐘)' },
  handlingTimeOrder: { en: 'Avg. Processing Time per Order (min)', zh: '平均訂單處理時間 (分鐘)' },
  
  // Industries
  retail: { en: 'Retail', zh: '零售業' },
  food: { en: 'Food Processing', zh: '食品加工' },
  hospitality: { en: 'Hospitality', zh: '旅宿業' },
  manufacturing: { en: 'Manufacturing', zh: '製造業' },
  other: { en: 'Other', zh: '其他' },
  
  // Module 2: AI Use Cases
  useCaseTitle: { en: 'Select AI Use Cases', zh: '選擇 AI 應用場景' },
  csAutomation: { en: 'AI Customer Service Automation', zh: 'AI 客服自動化' },
  csDesc: { 
    en: 'AI can automatically answer common customer questions, reducing staff workload.',
    zh: 'AI 可自動回覆常見客戶問題，大幅減輕人力負擔。'
  },
  orderAutomation: { en: 'AI Order Processing Automation', zh: '訂單處理自動化' },
  orderDesc: {
    en: 'Streamline order entry and validation using AI vision and natural language processing.',
    zh: '利用 AI 視覺與自然語言處理技術，自動化訂單輸入與驗證。'
  },
  marketingGen: { en: 'AI Marketing Content Generation', zh: 'AI 行銷內容生成' },
  marketingDesc: {
    en: 'Generate high-quality social media posts, ads, and product descriptions in seconds.',
    zh: '數秒內生成高品質社群貼文、廣告文案與產品描述。'
  },
  demandForecasting: { en: 'AI Demand Forecasting', zh: 'AI 需求預測' },
  demandDesc: {
    en: 'Predict future sales trends to optimize inventory and reduce waste.',
    zh: '預測未來銷售趨勢，優化庫存管理並減少浪費。'
  },

  // Module 3: Impact Config
  configTitle: { en: 'AI Impact Assumptions', zh: 'AI 影響假設設定' },
  automationRateLabel: { en: 'Inquiries automated by AI', zh: 'AI 自動化諮詢比例' },
  timeReductionLabel: { en: 'Order processing time reduction', zh: '訂單處理時間縮減' },
  improvementLabel: { en: 'Response time improvement', zh: '客戶回覆速度提升' },

  // Module 4 & 5: ROI & Dashboard
  dashboardTitle: { en: 'Executive ROI Dashboard', zh: '高階主管 ROI 儀表板' },
  dailyTimeSaved: { en: 'Daily Time Saved', zh: '每日節省時間' },
  monthlySavings: { en: 'Monthly Labor Savings', zh: '每月人力成本節省' },
  annualSavings: { en: 'Annual Labor Savings', zh: '每年人力成本節省' },
  estimatedCost: { en: 'Estimated AI Cost', zh: '預估 AI 導入成本' },
  roi: { en: 'ROI Percentage', zh: '投資報酬率 (ROI)' },
  paybackPeriod: { en: 'Payback Period', zh: '回收期' },
  months: { en: 'months', zh: '個月' },
  hours: { en: 'hours', zh: '小時' },
  beforeAI: { en: 'Before AI', zh: '導入前' },
  afterAI: { en: 'After AI', zh: '導入後' },
  metric: { en: 'Metric', zh: '指標' },
  responseTime: { en: 'Response Time', zh: '回覆時間' },
  processingTime: { en: 'Processing Time', zh: '處理時間' },
  laborCost: { en: 'Monthly Labor Cost', zh: '每月人力成本' },
  
  // Module 6: Summary
  summaryTitle: { en: 'Executive Summary', zh: '執行摘要' },
  exportBtn: { en: 'Export AI Value Report', zh: '匯出 AI 價值報告' },
  nextSteps: { en: 'Recommended Next Steps', zh: '建議後續步驟' },
  chatbot: { en: 'AI Chatbot Deployment', zh: '部署 AI 聊天機器人' },
  marketingAuto: { en: 'AI Marketing Automation', zh: 'AI 行銷自動化' },
  salesForecasting: { en: 'AI Sales Forecasting', zh: 'AI 銷售預測' },
  
  // General
  next: { en: 'Next', zh: '下一步' },
  back: { en: 'Back', zh: '上一步' },
  demoMode: { en: 'Demo Data Loaded', zh: '已載入示範數據' },
};
