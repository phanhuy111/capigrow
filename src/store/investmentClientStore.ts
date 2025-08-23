import { create } from 'zustand';

interface InvestmentClientState {
  // UI state
  selectedInvestment: string | null;
  investmentAmount: string;
  selectedRiskLevel: 'low' | 'medium' | 'high' | null;
  isInvesting: boolean;
  showInvestmentModal: boolean;
  
  // Filter and sort state
  sortBy: 'name' | 'return' | 'risk' | 'minimum';
  sortOrder: 'asc' | 'desc';
  riskFilter: string[];
  categoryFilter: string[];
  searchQuery: string;
  
  // Portfolio view state
  portfolioView: 'overview' | 'performance' | 'holdings';
  timeRange: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL';
  
  // Actions
  setSelectedInvestment: (id: string | null) => void;
  setInvestmentAmount: (amount: string) => void;
  setSelectedRiskLevel: (level: 'low' | 'medium' | 'high' | null) => void;
  setIsInvesting: (investing: boolean) => void;
  setShowInvestmentModal: (show: boolean) => void;
  setSortBy: (sortBy: 'name' | 'return' | 'risk' | 'minimum') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  setRiskFilter: (risks: string[]) => void;
  setCategoryFilter: (categories: string[]) => void;
  setSearchQuery: (query: string) => void;
  setPortfolioView: (view: 'overview' | 'performance' | 'holdings') => void;
  setTimeRange: (range: '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL') => void;
  clearFilters: () => void;
  reset: () => void;
}

export const useInvestmentClientStore = create<InvestmentClientState>((set) => ({
  // Initial state
  selectedInvestment: null,
  investmentAmount: '',
  selectedRiskLevel: null,
  isInvesting: false,
  showInvestmentModal: false,
  sortBy: 'name',
  sortOrder: 'asc',
  riskFilter: [],
  categoryFilter: [],
  searchQuery: '',
  portfolioView: 'overview',
  timeRange: '1M',

  // Actions
  setSelectedInvestment: (id) => set({ selectedInvestment: id }),
  setInvestmentAmount: (amount) => set({ investmentAmount: amount }),
  setSelectedRiskLevel: (level) => set({ selectedRiskLevel: level }),
  setIsInvesting: (investing) => set({ isInvesting: investing }),
  setShowInvestmentModal: (show) => set({ showInvestmentModal: show }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (order) => set({ sortOrder: order }),
  setRiskFilter: (risks) => set({ riskFilter: risks }),
  setCategoryFilter: (categories) => set({ categoryFilter: categories }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setPortfolioView: (view) => set({ portfolioView: view }),
  setTimeRange: (range) => set({ timeRange: range }),
  
  clearFilters: () => set({
    riskFilter: [],
    categoryFilter: [],
    searchQuery: '',
    sortBy: 'name',
    sortOrder: 'asc',
  }),
  
  reset: () => set({
    selectedInvestment: null,
    investmentAmount: '',
    selectedRiskLevel: null,
    isInvesting: false,
    showInvestmentModal: false,
    sortBy: 'name',
    sortOrder: 'asc',
    riskFilter: [],
    categoryFilter: [],
    searchQuery: '',
    portfolioView: 'overview',
    timeRange: '1M',
  }),
}));