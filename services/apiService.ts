import { IntegrationType, ConnectionStatus, KPIData, ProvisioningStep, HealthData } from '../types';

// --- Mock Backend Service (BFF Simulation) ---

export const apiService = {
  
  // EPIC D: Validate Integration Credentials
  validateIntegration: async (type: IntegrationType, secrets: Record<string, string>): Promise<boolean> => {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock validation logic
    // In reality, this calls /integrations/validate on the backend
    if (secrets['apiKey'] && secrets['apiKey'].length > 5) {
      return true;
    }
    return false;
  },

  // EPIC E: Provisioning Stream
  provisionClient: async function* (companyName: string) {
    const steps: ProvisioningStep[] = [
      { id: 'init', label: 'Initializing Client Environment (Terraform)', status: 'pending' },
      { id: 'datasets', label: 'Creating BigQuery Datasets (Raw/Analytics/Curated)', status: 'pending' },
      { id: 'iam', label: 'Configuring Service Accounts & IAM', status: 'pending' },
      { id: 'etl', label: 'Deploying ETL Connectors', status: 'pending' },
      { id: 'contracts', label: 'Registering Data Contracts', status: 'pending' },
      { id: 'ai', label: 'Training Baseline AI Models', status: 'pending' },
      { id: 'reports', label: 'Generating White-label Reports', status: 'pending' }
    ];

    // Yield initial state
    yield steps;

    for (let i = 0; i < steps.length; i++) {
      // Mark current as running
      steps[i].status = 'running';
      yield [...steps];
      
      // Simulate work
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1000));
      
      // Mark current as completed
      steps[i].status = 'completed';
      yield [...steps];
    }
  },

  // EPIC F: Fetch Dashboard KPIs
  getDashboardMetrics: async (clientId: string): Promise<KPIData> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate fetch

    // Generate "Real" data based on client ID seed
    return {
      revenue: { 
        value: 142500, 
        trend: 15.4, 
        history: [12000, 13500, 11000, 15600, 14200, 16800, 18200] 
      },
      sessions: { 
        value: 48900, 
        trend: 4.2, 
        history: [4000, 4200, 4100, 4800, 5200, 5100, 5300] 
      },
      orders: { 
        value: 1560, 
        trend: 9.1, 
        history: [120, 140, 135, 180, 200, 190, 210] 
      },
      etlPerformance: {
        avgDuration: 118,
        history: [
          { time: '00:00', dur: 110 }, { time: '04:00', dur: 115 }, 
          { time: '08:00', dur: 125 }, { time: '12:00', dur: 118 }, 
          { time: '16:00', dur: 120 }, { time: '20:00', dur: 112 }
        ]
      },
      dataQuality: {
        healthyPct: 99.8,
        history: [
           { day: 'Mon', success: 4500, failed: 10 },
           { day: 'Tue', success: 4600, failed: 12 },
           { day: 'Wed', success: 4550, failed: 8 },
           { day: 'Thu', success: 4800, failed: 15 },
           { day: 'Fri', success: 5000, failed: 5 }
        ]
      }
    };
  },

  // EPIC H: Data Health Endpoint
  getDataHealth: async (clientId: string): Promise<HealthData> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      overallScore: 98,
      freshness: '12 min ago',
      pipelineStatus: 'Active',
      metrics: [
        { name: 'Schema Validation', status: 'OK', value: '100% Pass', slaThreshold: '>99%' },
        { name: 'Data Latency', status: 'OK', value: '12min', slaThreshold: '<30min' },
        { name: 'Volume Anomaly', status: 'WARNING', value: '+15% Spike', slaThreshold: '+/- 20%' }
      ],
      recentJobs: [
        { id: 'job-101', name: 'Shopify Sync', status: 'SUCCESS', timestamp: '10:00 AM', duration: '45s' },
        { id: 'job-102', name: 'Ads Aggregation', status: 'SUCCESS', timestamp: '10:05 AM', duration: '120s' },
        { id: 'job-103', name: 'Analytics Build', status: 'WARNING', timestamp: '10:10 AM', duration: '310s' }, // Slow
        { id: 'job-104', name: 'Contract Tests', status: 'SUCCESS', timestamp: '10:12 AM', duration: '15s' },
      ],
      aiRecommendations: [
        "Analytics Build job (job-103) is running 40% slower than average. Consider optimizing the 'sessions_daily' view.",
        "Unusual volume spike in 'Orders' table detected. Verify marketing campaign activity."
      ]
    };
  }
};