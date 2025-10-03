"use client";

import { createClient } from '@supabase/supabase-js';

// Offline AI Assistant Interfaces
export interface OfflineCapability {
  id: string;
  name: string;
  description: string;
  model_type: 'local_llm' | 'decision_tree' | 'ml_classifier' | 'rule_based';
  model_size: number; // in MB
  accuracy_score: number; // 0-1
  offline_priority: number; // 1-10, higher = more important offline
  requires_sync: boolean;
  last_updated: Date;
}

export interface UserFinancialProfile {
  user_id: string;
  spending_patterns: {
    categories: Record<string, number>; // category -> average monthly spend
    monthly_income: number;
    monthly_expenses: number;
    savings_rate: number;
    transaction_frequency: Record<string, number>; // day of week -> count
  };
  financial_goals: {
    savings_target: number;
    target_date?: Date;
    goal_type: 'emergency_fund' | 'investment' | 'education' | 'business' | 'remittance';
    progress: number; // 0-1
  }[];
  risk_profile: {
    risk_tolerance: 'conservative' | 'moderate' | 'aggressive';
    investment_experience: 'beginner' | 'intermediate' | 'advanced';
    financial_stability_score: number; // 0-100
  };
  preferences: {
    language: string;
    currency: string;
    notification_frequency: 'real_time' | 'daily' | 'weekly';
    advice_style: 'concise' | 'detailed' | 'conversational';
  };
  created_at: Date;
  updated_at: Date;
}

export interface FinancialAdvice {
  id: string;
  user_id: string;
  advice_type: 'spending' | 'saving' | 'budgeting' | 'investment' | 'debt' | 'remittance' | 'emergency';
  title: string;
  content: string;
  action_items: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  confidence_score: number; // 0-1
  personalization_factors: string[];
  estimated_impact: {
    financial: number; // estimated financial impact in local currency
    timeline: string; // "immediate", "1 month", "3 months", etc.
  };
  created_at: Date;
  expires_at?: Date;
  is_read: boolean;
  user_feedback?: {
    rating: number; // 1-5
    helpful: boolean;
    implemented: boolean;
  };
}

export interface OfflineTransaction {
  id: string;
  user_id: string;
  type: 'payment' | 'transfer' | 'top_up' | 'cash_out' | 'remittance';
  amount: number;
  currency: string;
  recipient?: {
    name: string;
    phone?: string;
    account?: string;
  };
  merchant?: {
    id: string;
    name: string;
    category: string;
  };
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  status: 'pending' | 'queued' | 'failed' | 'cancelled';
  created_at: Date;
  sync_attempts: number;
  last_sync_attempt?: Date;
  error_message?: string;
  ai_validation: {
    fraud_score: number;
    validation_passed: boolean;
    offline_checks_performed: string[];
  };
}

export interface ConversationContext {
  id: string;
  user_id: string;
  conversation_history: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    metadata?: Record<string, any>;
  }[];
  current_topic: string;
  intent_history: string[];
  user_preferences: Record<string, any>;
  session_start: Date;
  last_interaction: Date;
  is_active: boolean;
}

export interface LocalMLModel {
  id: string;
  name: string;
  version: string;
  model_type: string;
  capabilities: string[];
  model_data: ArrayBuffer | null;
  metadata: {
    size_mb: number;
    accuracy: number;
    training_date: Date;
    feature_count: number;
    supported_languages: string[];
  };
  is_loaded: boolean;
  load_priority: number;
}

class OfflineAIAssistant {
  private supabase: any;
  private localModels: Map<string, LocalMLModel> = new Map();
  private conversationContext: ConversationContext | null = null;
  private userProfile: UserFinancialProfile | null = null;
  private offlineStorage: any = null;
  private syncQueue: OfflineTransaction[] = [];
  private isOnline: boolean = true;
  private workerInstance: Worker | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );
      this.initializeOfflineCapabilities();
      this.setupNetworkMonitoring();
      this.initializeLocalStorage();
      this.startBackgroundWorker();
    }
  }

  private async initializeOfflineCapabilities() {
    // Initialize local storage for offline data
    if ('indexedDB' in window) {
      this.offlineStorage = await this.setupIndexedDB();
    }

    // Load essential ML models for offline operation
    await this.loadEssentialModels();

    // Setup service worker for background processing
    if ('serviceWorker' in navigator) {
      await this.registerServiceWorker();
    }

    // Initialize conversation context
    await this.initializeConversationContext();
  }

  private async setupIndexedDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('KobKleinOfflineDB', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        if (!db.objectStoreNames.contains('transactions')) {
          const txStore = db.createObjectStore('transactions', { keyPath: 'id' });
          txStore.createIndex('user_id', 'user_id', { unique: false });
          txStore.createIndex('status', 'status', { unique: false });
        }

        if (!db.objectStoreNames.contains('advice')) {
          const adviceStore = db.createObjectStore('advice', { keyPath: 'id' });
          adviceStore.createIndex('user_id', 'user_id', { unique: false });
          adviceStore.createIndex('priority', 'priority', { unique: false });
        }

        if (!db.objectStoreNames.contains('conversations')) {
          const convStore = db.createObjectStore('conversations', { keyPath: 'id' });
          convStore.createIndex('user_id', 'user_id', { unique: false });
        }

        if (!db.objectStoreNames.contains('user_profiles')) {
          db.createObjectStore('user_profiles', { keyPath: 'user_id' });
        }

        if (!db.objectStoreNames.contains('ml_models')) {
          db.createObjectStore('ml_models', { keyPath: 'id' });
        }
      };
    });
  }

  private async loadEssentialModels() {
    // Load lightweight ML models for offline operation
    const essentialModels = [
      {
        id: 'spending_classifier',
        name: 'Spending Category Classifier',
        type: 'ml_classifier',
        priority: 1,
        capabilities: ['categorize_spending', 'detect_anomalies']
      },
      {
        id: 'budget_advisor',
        name: 'Budget Advisory Model',
        type: 'decision_tree',
        priority: 2,
        capabilities: ['budget_recommendations', 'spending_alerts']
      },
      {
        id: 'fraud_detector_lite',
        name: 'Lightweight Fraud Detector',
        type: 'ml_classifier',
        priority: 1,
        capabilities: ['transaction_validation', 'risk_scoring']
      },
      {
        id: 'conversation_nlp',
        name: 'Conversational NLP Model',
        type: 'local_llm',
        priority: 3,
        capabilities: ['intent_recognition', 'response_generation', 'context_understanding']
      }
    ];

    for (const modelConfig of essentialModels) {
      await this.loadModel(modelConfig);
    }
  }

  private async loadModel(modelConfig: any): Promise<void> {
    try {
      // In production, models would be loaded from CDN or local storage
      // For now, we'll simulate model loading
      const model: LocalMLModel = {
        id: modelConfig.id,
        name: modelConfig.name,
        version: '1.0.0',
        model_type: modelConfig.type,
        capabilities: modelConfig.capabilities,
        model_data: null, // Would contain actual model weights
        metadata: {
          size_mb: this.estimateModelSize(modelConfig.type),
          accuracy: this.getModelAccuracy(modelConfig.type),
          training_date: new Date(),
          feature_count: this.getFeatureCount(modelConfig.type),
          supported_languages: ['en', 'fr', 'ht']
        },
        is_loaded: true,
        load_priority: modelConfig.priority
      };

      this.localModels.set(modelConfig.id, model);

      // Store in IndexedDB for persistence
      if (this.offlineStorage) {
        await this.storeModelInDB(model);
      }

      console.log(`Loaded offline model: ${model.name}`);
    } catch (error) {
      console.error(`Failed to load model ${modelConfig.id}:`, error);
    }
  }

  private estimateModelSize(modelType: string): number {
    const sizes = {
      'ml_classifier': 5.2,
      'decision_tree': 0.8,
      'rule_based': 0.1,
      'local_llm': 25.6
    };
    return sizes[modelType] || 1.0;
  }

  private getModelAccuracy(modelType: string): number {
    const accuracies = {
      'ml_classifier': 0.87,
      'decision_tree': 0.92,
      'rule_based': 0.95,
      'local_llm': 0.78
    };
    return accuracies[modelType] || 0.80;
  }

  private getFeatureCount(modelType: string): number {
    const features = {
      'ml_classifier': 45,
      'decision_tree': 12,
      'rule_based': 8,
      'local_llm': 128
    };
    return features[modelType] || 20;
  }

  private async storeModelInDB(model: LocalMLModel): Promise<void> {
    if (!this.offlineStorage) return;

    const transaction = this.offlineStorage.transaction(['ml_models'], 'readwrite');
    const store = transaction.objectStore('ml_models');
    await store.put(model);
  }

  private setupNetworkMonitoring() {
    if (typeof window === 'undefined') return;

    // Monitor online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.handleOnlineStateChange();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.handleOfflineStateChange();
    });

    this.isOnline = navigator.onLine;
  }

  private handleOnlineStateChange() {
    console.log('Device is online - starting sync process');
    this.syncOfflineData();
  }

  private handleOfflineStateChange() {
    console.log('Device is offline - activating offline mode');
    this.activateOfflineMode();
  }

  private async registerServiceWorker(): Promise<void> {
    try {
      const registration = await navigator.serviceWorker.register('/offline-ai-worker.js');
      console.log('Offline AI Service Worker registered:', registration);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  private startBackgroundWorker() {
    if (typeof Worker !== 'undefined') {
      this.workerInstance = new Worker(new URL('/ai-background-worker.js', window.location.origin));

      this.workerInstance.onmessage = (event) => {
        this.handleWorkerMessage(event.data);
      };

      // Send initial configuration to worker
      this.workerInstance.postMessage({
        type: 'INIT',
        config: {
          models: Array.from(this.localModels.values()),
          userProfile: this.userProfile
        }
      });
    }
  }

  private handleWorkerMessage(message: any) {
    switch (message.type) {
      case 'ADVICE_GENERATED':
        this.handleGeneratedAdvice(message.advice);
        break;
      case 'ANOMALY_DETECTED':
        this.handleAnomalyDetection(message.anomaly);
        break;
      case 'MODEL_UPDATE_AVAILABLE':
        this.handleModelUpdate(message.modelInfo);
        break;
    }
  }

  // Core AI Assistant Functions

  public async processUserQuery(query: string, context?: Record<string, any>): Promise<{
    response: string;
    advice?: FinancialAdvice[];
    actions?: string[];
    confidence: number;
  }> {

    // Update conversation context
    if (this.conversationContext) {
      this.conversationContext.conversation_history.push({
        role: 'user',
        content: query,
        timestamp: new Date(),
        metadata: context
      });
    }

    // Analyze user intent
    const intent = await this.analyzeUserIntent(query, context);

    // Generate response based on intent and available models
    const response = await this.generateResponse(intent, query, context);

    // Generate relevant financial advice
    const advice = await this.generateContextualAdvice(intent, context);

    // Update conversation context with response
    if (this.conversationContext) {
      this.conversationContext.conversation_history.push({
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        metadata: { intent, advice_count: advice.length }
      });

      this.conversationContext.current_topic = intent.primary_topic;
      this.conversationContext.last_interaction = new Date();
    }

    return {
      ...response,
      advice
    };
  }

  private async analyzeUserIntent(query: string, context?: Record<string, any>): Promise<{
    primary_intent: string;
    secondary_intents: string[];
    primary_topic: string;
    entities: Record<string, any>;
    confidence: number;
  }> {

    const nlpModel = this.localModels.get('conversation_nlp');

    if (nlpModel && nlpModel.is_loaded) {
      // Use local NLP model for intent recognition
      return this.processWithLocalNLP(query, context);
    } else {
      // Fallback to rule-based intent recognition
      return this.processWithRuleBasedNLP(query, context);
    }
  }

  private async processWithLocalNLP(query: string, context?: Record<string, any>): Promise<any> {
    // Simulate local NLP processing
    // In production, this would use the actual loaded model

    const intentKeywords = {
      'spending_inquiry': ['spend', 'spent', 'spending', 'expense', 'cost', 'money'],
      'budget_help': ['budget', 'budgeting', 'plan', 'allocate', 'distribute'],
      'saving_advice': ['save', 'saving', 'savings', 'put aside', 'emergency fund'],
      'investment_guidance': ['invest', 'investment', 'portfolio', 'returns', 'growth'],
      'transaction_help': ['send', 'transfer', 'pay', 'payment', 'transaction'],
      'remittance_inquiry': ['remittance', 'send money', 'family', 'abroad', 'transfer overseas'],
      'account_balance': ['balance', 'how much', 'available', 'account'],
      'financial_goal': ['goal', 'target', 'achieve', 'reach', 'plan for']
    };

    let primaryIntent = 'general_inquiry';
    let confidence = 0.5;
    const secondaryIntents = [];
    const entities = {};

    const queryLower = query.toLowerCase();

    // Find matching intents
    for (const [intent, keywords] of Object.entries(intentKeywords)) {
      const matches = keywords.filter(keyword => queryLower.includes(keyword));
      if (matches.length > 0) {
        const intentConfidence = matches.length / keywords.length;
        if (intentConfidence > confidence) {
          if (primaryIntent !== 'general_inquiry') {
            secondaryIntents.push(primaryIntent);
          }
          primaryIntent = intent;
          confidence = intentConfidence;
        } else {
          secondaryIntents.push(intent);
        }
      }
    }

    // Extract entities (amounts, dates, etc.)
    const amountMatch = queryLower.match(/\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/);
    if (amountMatch) {
      entities.amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    }

    const dateMatch = queryLower.match(/(today|tomorrow|yesterday|this week|next week|this month|next month)/);
    if (dateMatch) {
      entities.timeframe = dateMatch[1];
    }

    return {
      primary_intent: primaryIntent,
      secondary_intents: secondaryIntents,
      primary_topic: this.mapIntentToTopic(primaryIntent),
      entities,
      confidence: Math.min(1, confidence + 0.2) // Boost confidence slightly for local processing
    };
  }

  private async processWithRuleBasedNLP(query: string, context?: Record<string, any>): Promise<any> {
    // Simplified rule-based approach for offline operation
    const queryLower = query.toLowerCase();

    if (queryLower.includes('spend') || queryLower.includes('expense')) {
      return {
        primary_intent: 'spending_inquiry',
        secondary_intents: [],
        primary_topic: 'spending',
        entities: {},
        confidence: 0.8
      };
    }

    if (queryLower.includes('budget') || queryLower.includes('plan')) {
      return {
        primary_intent: 'budget_help',
        secondary_intents: [],
        primary_topic: 'budgeting',
        entities: {},
        confidence: 0.8
      };
    }

    if (queryLower.includes('save') || queryLower.includes('saving')) {
      return {
        primary_intent: 'saving_advice',
        secondary_intents: [],
        primary_topic: 'saving',
        entities: {},
        confidence: 0.8
      };
    }

    return {
      primary_intent: 'general_inquiry',
      secondary_intents: [],
      primary_topic: 'general',
      entities: {},
      confidence: 0.6
    };
  }

  private mapIntentToTopic(intent: string): string {
    const mapping = {
      'spending_inquiry': 'spending',
      'budget_help': 'budgeting',
      'saving_advice': 'saving',
      'investment_guidance': 'investment',
      'transaction_help': 'transactions',
      'remittance_inquiry': 'remittance',
      'account_balance': 'account',
      'financial_goal': 'goals'
    };
    return mapping[intent] || 'general';
  }

  private async generateResponse(intent: any, query: string, context?: Record<string, any>): Promise<{
    response: string;
    actions?: string[];
    confidence: number;
  }> {

    const responseTemplates = {
      'spending_inquiry': [
        "I can help you analyze your spending patterns. Based on your recent transactions, here's what I found:",
        "Let me look at your spending data to provide some insights:",
        "I've analyzed your spending habits and here are some observations:"
      ],
      'budget_help': [
        "I'd be happy to help you create a budget plan. Let me analyze your income and expenses:",
        "Budgeting is a great step towards financial health. Here's what I recommend:",
        "Based on your financial profile, here's a personalized budget suggestion:"
      ],
      'saving_advice': [
        "Saving is crucial for financial security. Here are some personalized recommendations:",
        "I can help you optimize your savings strategy. Based on your profile:",
        "Let me provide some tailored savings advice for your situation:"
      ],
      'general_inquiry': [
        "I'm here to help with your financial questions. Could you be more specific about what you'd like to know?",
        "I can assist with budgeting, spending analysis, savings advice, and transaction help. What would you like to explore?",
        "I'm your personal finance assistant. How can I help you achieve your financial goals today?"
      ]
    };

    const templates = responseTemplates[intent.primary_intent] || responseTemplates['general_inquiry'];
    const baseResponse = templates[Math.floor(Math.random() * templates.length)];

    // Add contextual information based on user profile
    let contextualResponse = baseResponse;

    if (this.userProfile) {
      contextualResponse = await this.personalizeResponse(baseResponse, intent, this.userProfile);
    }

    const actions = this.generateActionItems(intent, context);

    return {
      response: contextualResponse,
      actions,
      confidence: intent.confidence
    };
  }

  private async personalizeResponse(baseResponse: string, intent: any, profile: UserFinancialProfile): Promise<string> {
    let personalizedResponse = baseResponse;

    // Add personalized context based on user profile
    switch (intent.primary_intent) {
      case 'spending_inquiry':
        const topCategory = Object.keys(profile.spending_patterns.categories)
          .reduce((a, b) => profile.spending_patterns.categories[a] > profile.spending_patterns.categories[b] ? a : b);
        personalizedResponse += ` Your highest spending category is ${topCategory} at ${profile.spending_patterns.categories[topCategory]} HTG per month.`;
        break;

      case 'budget_help':
        const savingsRate = profile.spending_patterns.savings_rate * 100;
        personalizedResponse += ` Your current savings rate is ${savingsRate.toFixed(1)}%. `;
        if (savingsRate < 20) {
          personalizedResponse += "I recommend increasing your savings to at least 20% of your income.";
        }
        break;

      case 'saving_advice':
        if (profile.financial_goals.length > 0) {
          const nearestGoal = profile.financial_goals[0];
          personalizedResponse += ` I see you're working towards a ${nearestGoal.goal_type} goal of ${nearestGoal.savings_target} HTG.`;
        }
        break;
    }

    return personalizedResponse;
  }

  private generateActionItems(intent: any, context?: Record<string, any>): string[] {
    const actionMap = {
      'spending_inquiry': [
        'Review your spending categories',
        'Set up spending alerts for high categories',
        'Consider tracking expenses daily'
      ],
      'budget_help': [
        'Set monthly spending limits by category',
        'Track your income and expenses',
        'Review and adjust budget monthly'
      ],
      'saving_advice': [
        'Set up automatic savings transfers',
        'Create an emergency fund goal',
        'Review savings progress weekly'
      ],
      'transaction_help': [
        'Check transaction history',
        'Verify recipient details',
        'Confirm transaction limits'
      ]
    };

    return actionMap[intent.primary_intent] || ['Ask me for more specific help'];
  }

  private async generateContextualAdvice(intent: any, context?: Record<string, any>): Promise<FinancialAdvice[]> {
    if (!this.userProfile) return [];

    const advice: FinancialAdvice[] = [];

    // Generate advice based on user profile and intent
    switch (intent.primary_intent) {
      case 'spending_inquiry':
        advice.push(...await this.generateSpendingAdvice());
        break;
      case 'budget_help':
        advice.push(...await this.generateBudgetAdvice());
        break;
      case 'saving_advice':
        advice.push(...await this.generateSavingAdvice());
        break;
    }

    // Store advice locally for offline access
    for (const adviceItem of advice) {
      await this.storeAdviceLocally(adviceItem);
    }

    return advice;
  }

  private async generateSpendingAdvice(): Promise<FinancialAdvice[]> {
    if (!this.userProfile) return [];

    const advice: FinancialAdvice[] = [];
    const spending = this.userProfile.spending_patterns;

    // Check for overspending categories
    const totalExpenses = Object.values(spending.categories).reduce((sum, amount) => sum + amount, 0);

    if (totalExpenses > spending.monthly_income * 0.8) {
      advice.push({
        id: `advice_${Date.now()}_overspending`,
        user_id: this.userProfile.user_id,
        advice_type: 'spending',
        title: 'High Spending Alert',
        content: 'Your monthly expenses are over 80% of your income. Consider reducing discretionary spending to improve your financial health.',
        action_items: [
          'Identify top 3 spending categories to reduce',
          'Set monthly limits for discretionary expenses',
          'Look for alternatives to reduce costs'
        ],
        priority: 'high',
        confidence_score: 0.9,
        personalization_factors: ['spending_ratio', 'income_level'],
        estimated_impact: {
          financial: spending.monthly_income * 0.1, // 10% savings potential
          timeline: '1 month'
        },
        created_at: new Date(),
        is_read: false
      });
    }

    return advice;
  }

  private async generateBudgetAdvice(): Promise<FinancialAdvice[]> {
    if (!this.userProfile) return [];

    const advice: FinancialAdvice[] = [];
    const profile = this.userProfile;

    // 50/30/20 rule advice
    const idealSavings = profile.spending_patterns.monthly_income * 0.2;
    const actualSavings = profile.spending_patterns.monthly_income -
      Object.values(profile.spending_patterns.categories).reduce((sum, amount) => sum + amount, 0);

    if (actualSavings < idealSavings) {
      advice.push({
        id: `advice_${Date.now()}_budget_rule`,
        user_id: profile.user_id,
        advice_type: 'budgeting',
        title: 'Optimize Your Budget with the 50/30/20 Rule',
        content: `Consider following the 50/30/20 rule: 50% for needs, 30% for wants, 20% for savings. You could increase your savings by ${(idealSavings - actualSavings).toFixed(0)} HTG per month.`,
        action_items: [
          'Categorize expenses into needs vs wants',
          'Reduce wants spending if necessary',
          'Automate 20% savings transfer'
        ],
        priority: 'medium',
        confidence_score: 0.85,
        personalization_factors: ['income_level', 'current_savings_rate'],
        estimated_impact: {
          financial: idealSavings - actualSavings,
          timeline: '1 month'
        },
        created_at: new Date(),
        is_read: false
      });
    }

    return advice;
  }

  private async generateSavingAdvice(): Promise<FinancialAdvice[]> {
    if (!this.userProfile) return [];

    const advice: FinancialAdvice[] = [];
    const profile = this.userProfile;

    // Emergency fund advice
    const monthlyExpenses = Object.values(profile.spending_patterns.categories).reduce((sum, amount) => sum + amount, 0);
    const recommendedEmergencyFund = monthlyExpenses * 6;

    const emergencyGoal = profile.financial_goals.find(goal => goal.goal_type === 'emergency_fund');

    if (!emergencyGoal || emergencyGoal.savings_target < recommendedEmergencyFund) {
      advice.push({
        id: `advice_${Date.now()}_emergency_fund`,
        user_id: profile.user_id,
        advice_type: 'saving',
        title: 'Build Your Emergency Fund',
        content: `I recommend having 6 months of expenses (${recommendedEmergencyFund.toFixed(0)} HTG) as an emergency fund. This provides financial security for unexpected situations.`,
        action_items: [
          'Set up automatic monthly transfers to emergency fund',
          'Keep emergency funds in easily accessible savings account',
          'Avoid using emergency funds for non-emergencies'
        ],
        priority: 'high',
        confidence_score: 0.95,
        personalization_factors: ['monthly_expenses', 'risk_profile'],
        estimated_impact: {
          financial: recommendedEmergencyFund,
          timeline: '12 months'
        },
        created_at: new Date(),
        is_read: false
      });
    }

    return advice;
  }

  // Offline Transaction Processing

  public async processOfflineTransaction(transactionData: {
    type: string;
    amount: number;
    currency: string;
    recipient?: any;
    merchant?: any;
    location?: any;
  }): Promise<OfflineTransaction> {

    const transaction: OfflineTransaction = {
      id: `offline_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: this.userProfile?.user_id || 'anonymous',
      type: transactionData.type as any,
      amount: transactionData.amount,
      currency: transactionData.currency,
      recipient: transactionData.recipient,
      merchant: transactionData.merchant,
      location: transactionData.location,
      status: 'pending',
      created_at: new Date(),
      sync_attempts: 0,
      ai_validation: await this.validateTransactionOffline(transactionData)
    };

    // Store transaction locally
    await this.storeTransactionLocally(transaction);

    // Add to sync queue
    this.syncQueue.push(transaction);

    // If online, attempt immediate sync
    if (this.isOnline) {
      await this.syncTransaction(transaction);
    }

    return transaction;
  }

  private async validateTransactionOffline(transactionData: any): Promise<{
    fraud_score: number;
    validation_passed: boolean;
    offline_checks_performed: string[];
  }> {

    const checks = [];
    let fraudScore = 0;

    // Basic validation checks that can be performed offline

    // Amount validation
    if (transactionData.amount <= 0) {
      fraudScore += 30;
      checks.push('invalid_amount');
    }

    // Amount limits check (using cached user limits)
    if (this.userProfile) {
      const dailyLimit = 50000; // Default daily limit
      if (transactionData.amount > dailyLimit) {
        fraudScore += 40;
        checks.push('exceeds_daily_limit');
      }
    }

    // Frequency check (using local transaction history)
    const recentTransactions = await this.getRecentLocalTransactions(24); // Last 24 hours
    if (recentTransactions.length > 10) {
      fraudScore += 25;
      checks.push('high_frequency');
    }

    // Time-based validation
    const hour = new Date().getHours();
    if (hour < 6 || hour > 22) {
      fraudScore += 15;
      checks.push('unusual_time');
    }

    checks.push('amount_validation', 'frequency_check', 'time_validation');

    return {
      fraud_score: Math.min(100, fraudScore),
      validation_passed: fraudScore < 70,
      offline_checks_performed: checks
    };
  }

  private async getRecentLocalTransactions(hours: number): Promise<OfflineTransaction[]> {
    if (!this.offlineStorage) return [];

    const transaction = this.offlineStorage.transaction(['transactions'], 'readonly');
    const store = transaction.objectStore('transactions');
    const index = store.index('user_id');

    const request = index.getAll(this.userProfile?.user_id);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const transactions = request.result || [];
        const cutoffTime = new Date(Date.now() - (hours * 60 * 60 * 1000));
        const recentTransactions = transactions.filter(tx =>
          new Date(tx.created_at) > cutoffTime
        );
        resolve(recentTransactions);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Data Management and Sync

  private async storeTransactionLocally(transaction: OfflineTransaction): Promise<void> {
    if (!this.offlineStorage) return;

    const tx = this.offlineStorage.transaction(['transactions'], 'readwrite');
    const store = tx.objectStore('transactions');
    await store.put(transaction);
  }

  private async storeAdviceLocally(advice: FinancialAdvice): Promise<void> {
    if (!this.offlineStorage) return;

    const transaction = this.offlineStorage.transaction(['advice'], 'readwrite');
    const store = transaction.objectStore('advice');
    await store.put(advice);
  }

  private async syncOfflineData(): Promise<void> {
    if (!this.isOnline || this.syncQueue.length === 0) return;

    console.log(`Syncing ${this.syncQueue.length} offline transactions...`);

    for (const transaction of this.syncQueue) {
      await this.syncTransaction(transaction);
    }

    // Clear successfully synced transactions
    this.syncQueue = this.syncQueue.filter(tx => tx.status === 'pending' || tx.status === 'queued');
  }

  private async syncTransaction(transaction: OfflineTransaction): Promise<void> {
    try {
      transaction.sync_attempts += 1;
      transaction.last_sync_attempt = new Date();

      // Attempt to sync with server
      const response = await this.supabase
        .from('transactions')
        .insert({
          id: transaction.id,
          user_id: transaction.user_id,
          type: transaction.type,
          amount: transaction.amount,
          currency: transaction.currency,
          recipient_info: transaction.recipient,
          merchant_info: transaction.merchant,
          location: transaction.location,
          status: 'completed',
          created_at: transaction.created_at.toISOString(),
          offline_validation: transaction.ai_validation
        });

      if (response.error) {
        throw new Error(response.error.message);
      }

      // Update local transaction status
      transaction.status = 'pending'; // Will be updated by server
      await this.updateTransactionLocally(transaction);

    } catch (error) {
      transaction.status = 'failed';
      transaction.error_message = error.message;
      await this.updateTransactionLocally(transaction);

      console.error('Transaction sync failed:', error);
    }
  }

  private async updateTransactionLocally(transaction: OfflineTransaction): Promise<void> {
    if (!this.offlineStorage) return;

    const tx = this.offlineStorage.transaction(['transactions'], 'readwrite');
    const store = tx.objectStore('transactions');
    await store.put(transaction);
  }

  private async activateOfflineMode(): Promise<void> {
    console.log('Activating offline mode with enhanced AI capabilities');

    // Ensure critical models are loaded
    const criticalModels = ['spending_classifier', 'fraud_detector_lite', 'budget_advisor'];

    for (const modelId of criticalModels) {
      const model = this.localModels.get(modelId);
      if (!model || !model.is_loaded) {
        await this.loadModel({ id: modelId, type: 'ml_classifier', priority: 1 });
      }
    }

    // Cache essential user data
    await this.cacheEssentialUserData();

    // Generate offline advice proactively
    await this.generateProactiveOfflineAdvice();
  }

  private async cacheEssentialUserData(): Promise<void> {
    if (!this.userProfile || !this.isOnline) return;

    try {
      // Cache recent transactions
      const recentTransactions = await this.supabase
        .from('transactions')
        .select('*')
        .eq('user_id', this.userProfile.user_id)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
        .order('created_at', { ascending: false });

      if (recentTransactions.data) {
        for (const tx of recentTransactions.data) {
          await this.storeTransactionLocally({
            ...tx,
            status: 'completed',
            sync_attempts: 0,
            ai_validation: { fraud_score: 0, validation_passed: true, offline_checks_performed: [] }
          });
        }
      }

      // Cache user financial profile
      if (this.offlineStorage) {
        const transaction = this.offlineStorage.transaction(['user_profiles'], 'readwrite');
        const store = transaction.objectStore('user_profiles');
        await store.put(this.userProfile);
      }

    } catch (error) {
      console.error('Failed to cache user data:', error);
    }
  }

  private async generateProactiveOfflineAdvice(): Promise<void> {
    if (!this.userProfile) return;

    // Generate general financial advice that doesn't require real-time data
    const proactiveAdvice = [
      {
        id: `advice_${Date.now()}_offline_emergency`,
        user_id: this.userProfile.user_id,
        advice_type: 'emergency' as const,
        title: 'Offline Mode: Emergency Preparedness',
        content: 'While offline, ensure you have access to emergency cash and know your account balances. Keep important financial information accessible.',
        action_items: [
          'Note your current account balances',
          'Keep emergency cash on hand',
          'Know important phone numbers'
        ],
        priority: 'medium' as const,
        confidence_score: 1.0,
        personalization_factors: ['offline_mode'],
        estimated_impact: {
          financial: 0,
          timeline: 'immediate'
        },
        created_at: new Date(),
        is_read: false
      }
    ];

    for (const advice of proactiveAdvice) {
      await this.storeAdviceLocally(advice);
    }
  }

  // User Profile Management

  public async loadUserProfile(userId: string): Promise<UserFinancialProfile | null> {
    try {
      // Try to load from local storage first
      if (this.offlineStorage) {
        const transaction = this.offlineStorage.transaction(['user_profiles'], 'readonly');
        const store = transaction.objectStore('user_profiles');
        const request = store.get(userId);

        const localProfile = await new Promise((resolve, reject) => {
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });

        if (localProfile) {
          this.userProfile = localProfile as UserFinancialProfile;
          return this.userProfile;
        }
      }

      // If not found locally and online, fetch from server
      if (this.isOnline) {
        const response = await this.supabase
          .from('user_financial_profiles')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (response.data) {
          this.userProfile = response.data;

          // Cache locally
          if (this.offlineStorage) {
            const transaction = this.offlineStorage.transaction(['user_profiles'], 'readwrite');
            const store = transaction.objectStore('user_profiles');
            await store.put(this.userProfile);
          }

          return this.userProfile;
        }
      }

      return null;
    } catch (error) {
      console.error('Failed to load user profile:', error);
      return null;
    }
  }

  private async initializeConversationContext(): Promise<void> {
    if (!this.userProfile) return;

    this.conversationContext = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: this.userProfile.user_id,
      conversation_history: [],
      current_topic: 'general',
      intent_history: [],
      user_preferences: this.userProfile.preferences,
      session_start: new Date(),
      last_interaction: new Date(),
      is_active: true
    };
  }

  // Background Processing Handlers

  private async handleGeneratedAdvice(advice: FinancialAdvice): Promise<void> {
    await this.storeAdviceLocally(advice);

    // Trigger notification if high priority
    if (advice.priority === 'high' || advice.priority === 'urgent') {
      this.triggerNotification(advice);
    }
  }

  private async handleAnomalyDetection(anomaly: any): Promise<void> {
    // Create urgent advice for detected anomaly
    const anomalyAdvice: FinancialAdvice = {
      id: `advice_${Date.now()}_anomaly`,
      user_id: anomaly.user_id,
      advice_type: 'emergency',
      title: 'Unusual Activity Detected',
      content: `I've detected unusual ${anomaly.type} activity. ${anomaly.description}`,
      action_items: anomaly.recommended_actions || [
        'Review recent transactions',
        'Check account security',
        'Contact support if needed'
      ],
      priority: 'urgent',
      confidence_score: anomaly.confidence,
      personalization_factors: ['anomaly_detection'],
      estimated_impact: {
        financial: anomaly.potential_impact || 0,
        timeline: 'immediate'
      },
      created_at: new Date(),
      is_read: false
    };

    await this.storeAdviceLocally(anomalyAdvice);
    this.triggerNotification(anomalyAdvice);
  }

  private async handleModelUpdate(modelInfo: any): Promise<void> {
    console.log('Model update available:', modelInfo);

    if (this.isOnline) {
      await this.updateModel(modelInfo.id, modelInfo.version);
    }
  }

  private async updateModel(modelId: string, version: string): Promise<void> {
    try {
      const model = this.localModels.get(modelId);
      if (model && model.version !== version) {
        // Download and update model
        await this.loadModel({ id: modelId, type: model.model_type, priority: model.load_priority });
        console.log(`Updated model ${modelId} to version ${version}`);
      }
    } catch (error) {
      console.error(`Failed to update model ${modelId}:`, error);
    }
  }

  private triggerNotification(advice: FinancialAdvice): void {
    // Trigger browser notification for important advice
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(advice.title, {
        body: advice.content.substring(0, 100) + '...',
        icon: '/icons/kobklein-notification.png',
        tag: advice.id
      });
    }
  }

  // Public API Methods

  public async getOfflineAdvice(userId?: string): Promise<FinancialAdvice[]> {
    if (!this.offlineStorage) return [];

    const transaction = this.offlineStorage.transaction(['advice'], 'readonly');
    const store = transaction.objectStore('advice');
    const index = store.index('user_id');

    const targetUserId = userId || this.userProfile?.user_id;
    if (!targetUserId) return [];

    const request = index.getAll(targetUserId);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const advice = request.result || [];
        resolve(advice.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      };
      request.onerror = () => reject(request.error);
    });
  }

  public async getPendingTransactions(): Promise<OfflineTransaction[]> {
    return this.syncQueue.filter(tx => tx.status === 'pending' || tx.status === 'queued');
  }

  public getLoadedModels(): LocalMLModel[] {
    return Array.from(this.localModels.values());
  }

  public isOfflineCapable(): boolean {
    const essentialModels = ['spending_classifier', 'fraud_detector_lite'];
    return essentialModels.every(modelId => {
      const model = this.localModels.get(modelId);
      return model && model.is_loaded;
    });
  }

  public getOfflineStatus(): {
    isOnline: boolean;
    isOfflineCapable: boolean;
    loadedModels: number;
    pendingTransactions: number;
    lastSync?: Date;
  } {
    return {
      isOnline: this.isOnline,
      isOfflineCapable: this.isOfflineCapable(),
      loadedModels: this.localModels.size,
      pendingTransactions: this.syncQueue.length,
      lastSync: this.syncQueue.length > 0 ? this.syncQueue[0].last_sync_attempt : undefined
    };
  }
}

// Singleton instance
export const offlineAI = new OfflineAIAssistant();

// React hook for using offline AI assistant
export function useOfflineAI() {
  const [advice, setAdvice] = React.useState<FinancialAdvice[]>([]);
  const [offlineStatus, setOfflineStatus] = React.useState({
    isOnline: true,
    isOfflineCapable: false,
    loadedModels: 0,
    pendingTransactions: 0
  });
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadData = async () => {
      setLoading(true);
      try {
        const offlineAdvice = await offlineAI.getOfflineAdvice();
        setAdvice(offlineAdvice);

        const status = offlineAI.getOfflineStatus();
        setOfflineStatus(status);
      } catch (error) {
        console.error('Failed to load offline AI data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Set up periodic status updates
    const interval = setInterval(() => {
      const status = offlineAI.getOfflineStatus();
      setOfflineStatus(status);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return {
    advice,
    offlineStatus,
    loading,
    processQuery: offlineAI.processUserQuery.bind(offlineAI),
    processTransaction: offlineAI.processOfflineTransaction.bind(offlineAI),
    loadUserProfile: offlineAI.loadUserProfile.bind(offlineAI),
    getPendingTransactions: offlineAI.getPendingTransactions.bind(offlineAI)
  };
}

// Import React for the hook
import React from 'react';
