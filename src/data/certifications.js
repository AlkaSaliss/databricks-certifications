export const certification = {
  id: 'data-engineer-professional',
  title: 'Data Engineer Professional',
  vendor: 'Databricks',
  version: 'October 9, 2026',
  questionCount: 60,
  durationMinutes: 120,
  guideUrl: 'https://www.databricks.com/sites/default/files/2026-09/databricks-certified-data-engineer-professional-exam-guide-oct-2026.pdf',
  domains: [
    { id: 'code', title: 'Developing Code', fullTitle: 'Developing Code for Data Processing using Python and SQL', weight: 23, icon: 'code', description: 'Python & SQL, pipelines, streaming, and orchestration.' },
    { id: 'ingestion', title: 'Data Ingestion', fullTitle: 'Data Ingestion & Acquisition', weight: 12, icon: 'download', description: 'Auto Loader, CDC, sharing, and federation.' },
    { id: 'manipulation', title: 'Data Manipulation', fullTitle: 'Data Manipulation', weight: 12, icon: 'sliders', description: 'Transformations, VARIANT, AI, and data quality.' },
    { id: 'monitoring', title: 'Monitoring & Alerting', fullTitle: 'Monitoring and Alerting', weight: 10, icon: 'activity', description: 'System tables, event logs, and workload health.' },
    { id: 'performance', title: 'Cost & Performance', fullTitle: 'Cost & Performance Optimization', weight: 15, icon: 'zap', description: 'Liquid clustering, optimization, CDF, and caching.' },
    { id: 'security', title: 'Security & Compliance', fullTitle: 'Ensuring Data Security and Compliance', weight: 8, icon: 'shield', description: 'Least privilege, ABAC, masking, and data retention.' },
    { id: 'governance', title: 'Data Governance', fullTitle: 'Data Governance', weight: 5, icon: 'catalog', description: 'Permissions, inheritance, tags, and discoverability.' },
    { id: 'deployment', title: 'Debugging & Deploying', fullTitle: 'Debugging and Deploying', weight: 10, icon: 'terminal', description: 'Troubleshooting, job repairs, bundles, and CI/CD.' },
    { id: 'modeling', title: 'Data Modeling', fullTitle: 'Data Modeling', weight: 5, icon: 'layers', description: 'Table layouts, dimensional models, and metric views.' },
  ],
};

export const modes = [
  { id: 'practice', title: 'Theme practice', icon: 'book', label: 'BUILD YOUR KNOWLEDGE', description: 'Focus on one topic. Learn with explanations after each answer.', detail: 'Up to 10 questions · Instant feedback' },
  { id: 'exam', title: 'Exam simulation', icon: 'clipboard', label: 'FIND YOUR RHYTHM', description: 'Take a full-length practice exam at your own pace.', detail: '60 questions · No timer' },
  { id: 'timed', title: 'Timed exam', icon: 'clock', label: 'PUT IT TO THE TEST', description: 'Practice under the official time limit and build exam stamina.', detail: '60 questions · 120 minutes' },
];
