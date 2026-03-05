export type Language = 'en' | 'zh';

export type Industry = 'retail' | 'food' | 'hospitality' | 'manufacturing' | 'other';

export type CompanySize = '1-10' | '11-50' | '51-200';

export interface CompanyData {
  industry: Industry;
  companySize: CompanySize;
  monthlyLaborCost: number;
  customerInquiriesPerDay: number;
  ordersProcessedPerDay: number;
  avgHandlingTimePerInquiry: number;
  avgProcessingTimePerOrder: number;
}

export interface AIUseCase {
  id: string;
  title: { en: string; zh: string };
  description: { en: string; zh: string };
  icon: string;
}

export interface AISimulationConfig {
  automationRate: number; // 0-100
  timeReductionRate: number; // 0-100
  responseTimeImprovement: number; // 0-100
}

export interface ROIResults {
  dailyTimeSaved: number;
  monthlySavings: number;
  annualSavings: number;
  estimatedCost: number;
  roi: number;
  paybackPeriod: number;
}
