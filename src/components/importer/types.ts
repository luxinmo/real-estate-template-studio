export interface ImportSource {
  id: string;
  name: string;
  feedUrl: string;
  format: "kyero" | "xml_generic" | "xml_custom";
  frequency: "manual" | "1h" | "6h" | "12h" | "24h" | "custom";
  cronExpression?: string;
  active: boolean;
  testMode: boolean;
  lastRun?: string;
  lastRunStatus?: "ok" | "error";
  nextRun?: string;
}

export interface ImportBatch {
  id: string;
  sourceId: string;
  sourceName: string;
  startedAt: string;
  duration?: string;
  status: "completed" | "failed" | "running" | "pending";
  newRecords: number;
  updatedRecords: number;
  unchangedRecords: number;
  errors: number;
}

export interface BatchRecord {
  id: string;
  externalRef: string;
  action: "created" | "updated" | "unchanged" | "error";
  changes?: string;
  error?: string;
}

export interface FieldMapping {
  xmlField: string;
  xmlType: "text" | "number" | "boolean";
  sampleValue: string;
  targetField?: string;
}

export interface ValueMapping {
  id: string;
  xmlValue: string;
  omniValue: string;
  fieldType: string;
}

export interface PendingValue {
  id: string;
  sourceId: string;
  sourceName: string;
  entityType: "tipo" | "caracteristica";
  xmlValue: string;
  detectedAt: string;
  occurrences: number;
  status: "pending" | "assigned" | "ignored";
  assignedTo?: string;
}

export interface SchedulerJob {
  id: string;
  sourceId: string;
  sourceName: string;
  frequency: string;
  active: boolean;
  lastRun?: string;
  lastRunOk?: boolean;
  nextRun?: string;
  running: boolean;
  progress?: number;
}
