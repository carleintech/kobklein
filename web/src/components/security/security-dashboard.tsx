/**
 * Security Dashboard Component
 * Comprehensive security monitoring and management interface
 */

"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAntiTamper,
  useDeviceFingerprint,
  useEncryption,
  useFraudDetection,
  useSecureStorage,
  useSecurityConfig,
  useSecurityEvents,
  useSecuritySession,
} from "@/hooks/use-security";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Fingerprint,
  Key,
  Lock,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useState } from "react";

interface SecurityMetric {
  name: string;
  value: string | number;
  status: "secure" | "warning" | "danger";
  description: string;
}

export function SecurityDashboard() {
  const { config, updateConfig } = useSecurityConfig();
  const { events, criticalEvents, clearEvents } = useSecurityEvents();
  const { sessionActive, timeRemaining, failedAttempts, maxFailedAttempts } =
    useSecuritySession();
  const { isSecure, lastCheck } = useAntiTamper();
  const { fingerprint } = useDeviceFingerprint();
  const [selectedTab, setSelectedTab] = useState("overview");

  const securityMetrics: SecurityMetric[] = [
    {
      name: "Device Integrity",
      value: isSecure ? "Secure" : "Compromised",
      status: isSecure ? "secure" : "danger",
      description: "Device tampering and debugging detection",
    },
    {
      name: "Session Status",
      value: sessionActive ? "Active" : "Inactive",
      status: sessionActive ? "secure" : "warning",
      description: "Current security session state",
    },
    {
      name: "Failed Attempts",
      value: `${failedAttempts}/${maxFailedAttempts}`,
      status:
        failedAttempts === 0
          ? "secure"
          : failedAttempts >= maxFailedAttempts
          ? "danger"
          : "warning",
      description: "Authentication failure tracking",
    },
    {
      name: "Critical Events",
      value: criticalEvents.length,
      status: criticalEvents.length === 0 ? "secure" : "danger",
      description: "High-severity security incidents",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "secure":
        return <ShieldCheck className="h-4 w-4 text-green-500" />;
      case "warning":
        return <ShieldAlert className="h-4 w-4 text-yellow-500" />;
      case "danger":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "secure":
        return "bg-green-100 text-green-800 border-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "danger":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Security Dashboard
          </h1>
          <p className="text-gray-600">
            Monitor and manage KobKlein security features
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {isSecure ? (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <ShieldCheck className="h-3 w-3 mr-1" />
              Secure
            </Badge>
          ) : (
            <Badge className="bg-red-100 text-red-800 border-red-200">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Alert
            </Badge>
          )}
        </div>
      </div>

      {/* Security Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {securityMetrics.map((metric) => (
          <Card key={metric.name}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{metric.name}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                {getStatusIcon(metric.status)}
              </div>
              <p className="text-xs text-gray-500 mt-2">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Critical Alerts */}
      {criticalEvents.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>
              {criticalEvents.length} critical security event(s) detected!
            </strong>
            <br />
            Latest: {criticalEvents[criticalEvents.length - 1]?.description}
          </AlertDescription>
        </Alert>
      )}

      {/* Security Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="encryption">Encryption</TabsTrigger>
          <TabsTrigger value="fraud">Fraud Detection</TabsTrigger>
          <TabsTrigger value="device">Device</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <SecurityOverview />
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <SecurityEvents events={events} onClearEvents={clearEvents} />
        </TabsContent>

        <TabsContent value="encryption" className="space-y-6">
          <EncryptionManager />
        </TabsContent>

        <TabsContent value="fraud" className="space-y-6">
          <FraudDetectionPanel />
        </TabsContent>

        <TabsContent value="device" className="space-y-6">
          <DeviceSecurityPanel fingerprint={fingerprint} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <SecuritySettings config={config} onUpdateConfig={updateConfig} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SecurityOverview() {
  const { sessionActive, timeRemaining } = useSecuritySession();
  const { isSecure, lastCheck } = useAntiTamper();
  const { getStorageInfo } = useSecureStorage();

  const storageInfo = getStorageInfo();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Session Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Status</span>
            <Badge variant={sessionActive ? "default" : "secondary"}>
              {sessionActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          {sessionActive && (
            <div className="flex items-center justify-between">
              <span>Time Remaining</span>
              <span className="font-mono">
                {Math.floor(timeRemaining / 60)}:
                {(timeRemaining % 60).toString().padStart(2, "0")}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Device Security</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Integrity</span>
            <Badge variant={isSecure ? "default" : "destructive"}>
              {isSecure ? "Secure" : "Compromised"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Last Check</span>
            <span className="text-sm text-gray-500">
              {lastCheck ? lastCheck.toLocaleTimeString() : "Never"}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>Secure Storage</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Encrypted Items</span>
            <span>{storageInfo.totalItems}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Storage Used</span>
            <span>{(storageInfo.totalSize / 1024).toFixed(1)} KB</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Security Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Encryption enabled</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Certificate pinning active</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Fraud detection enabled</span>
            </div>
            <div className="flex items-center space-x-2">
              {isSecure ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm">Anti-tamper protection</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SecurityEvents({
  events,
  onClearEvents,
}: {
  events: any[];
  onClearEvents: () => void;
}) {
  const [filter, setFilter] = useState<string>("all");

  const filteredEvents = events.filter((event) => {
    if (filter === "all") return true;
    return event.severity === filter || event.type === filter;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Security Events</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1 border rounded text-sm"
              aria-label="Filter security events"
            >
              <option value="all">All Events</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="authentication">Auth</option>
              <option value="fraud_detection">Fraud</option>
              <option value="tampering">Tampering</option>
            </select>
            <Button onClick={onClearEvents} variant="outline" size="sm">
              Clear Events
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredEvents.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No security events found
            </p>
          ) : (
            filteredEvents
              .slice(-20)
              .reverse()
              .map((event, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 border rounded-lg"
                >
                  <Badge className={getSeverityColor(event.severity)}>
                    {event.severity}
                  </Badge>
                  <div className="flex-grow">
                    <p className="text-sm font-medium">{event.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.timestamp).toLocaleString()} •{" "}
                      {event.type}
                    </p>
                    {event.metadata && (
                      <pre className="text-xs text-gray-400 mt-1 overflow-x-auto">
                        {JSON.stringify(event.metadata, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function EncryptionManager() {
  const { encrypt, decrypt } = useEncryption();
  const [testData, setTestData] = useState("Hello, KobKlein!");
  const [password, setPassword] = useState("");
  const [encryptedResult, setEncryptedResult] = useState<any>(null);
  const [decryptedResult, setDecryptedResult] = useState<string>("");

  const handleEncrypt = async () => {
    const result = await encrypt(testData, password || undefined);
    setEncryptedResult(result);
    setDecryptedResult("");
  };

  const handleDecrypt = async () => {
    if (!encryptedResult) return;
    const result = await decrypt(
      encryptedResult.encryptedData,
      encryptedResult.iv,
      encryptedResult.salt,
      password || undefined
    );
    setDecryptedResult(
      result.success ? result.decryptedData : "Decryption failed"
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="h-5 w-5" />
          <span>Encryption Testing</span>
        </CardTitle>
        <CardDescription>
          Test AES-GCM encryption and decryption with optional password
          protection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Test Data</label>
          <input
            type="text"
            value={testData}
            onChange={(e) => setTestData(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Enter data to encrypt"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Password (optional)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Optional encryption password"
          />
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleEncrypt}>Encrypt</Button>
          <Button
            onClick={handleDecrypt}
            disabled={!encryptedResult}
            variant="outline"
          >
            Decrypt
          </Button>
        </div>

        {encryptedResult && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Encrypted Result</label>
            <div className="p-3 bg-gray-100 rounded font-mono text-xs overflow-x-auto">
              <div>
                <strong>Data:</strong>{" "}
                {encryptedResult.encryptedData.substring(0, 50)}...
              </div>
              <div>
                <strong>IV:</strong> {encryptedResult.iv}
              </div>
              <div>
                <strong>Salt:</strong> {encryptedResult.salt}
              </div>
            </div>
          </div>
        )}

        {decryptedResult && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Decrypted Result</label>
            <div className="p-3 bg-green-100 rounded">{decryptedResult}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function FraudDetectionPanel() {
  const { analyzeTransaction, checkDeviceIntegrity } = useFraudDetection();
  const [testTransaction, setTestTransaction] = useState({
    amount: 1000,
    recipient: "test@example.com",
    timestamp: Date.now(),
  });
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [integrityResult, setIntegrityResult] = useState<boolean | null>(null);

  const handleAnalyzeTransaction = async () => {
    const result = await analyzeTransaction(testTransaction);
    setAnalysisResult(result);
  };

  const handleCheckIntegrity = async () => {
    const result = await checkDeviceIntegrity();
    setIntegrityResult(result);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Transaction Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount (HTG)</label>
              <input
                type="number"
                value={testTransaction.amount}
                onChange={(e) =>
                  setTestTransaction((prev) => ({
                    ...prev,
                    amount: Number(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 border rounded"
                aria-label="Transaction amount"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Recipient</label>
              <input
                type="text"
                value={testTransaction.recipient}
                onChange={(e) =>
                  setTestTransaction((prev) => ({
                    ...prev,
                    recipient: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded"
                aria-label="Transaction recipient"
              />
            </div>
          </div>

          <Button onClick={handleAnalyzeTransaction}>
            Analyze Transaction
          </Button>

          {analysisResult && (
            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span>Fraud Risk</span>
                <Badge
                  className={
                    analysisResult.isFraudulent
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }
                >
                  {analysisResult.riskLevel.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Confidence</span>
                <span>{(analysisResult.confidence * 100).toFixed(1)}%</span>
              </div>
              {analysisResult.reasons.length > 0 && (
                <div>
                  <span className="text-sm font-medium">Risk Factors:</span>
                  <ul className="text-sm text-gray-600 ml-4">
                    {analysisResult.reasons.map(
                      (reason: string, index: number) => (
                        <li key={index}>• {reason}</li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Device Integrity</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleCheckIntegrity}>Check Device Integrity</Button>

          {integrityResult !== null && (
            <Alert variant={integrityResult ? "default" : "destructive"}>
              {integrityResult ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
              <AlertDescription>
                Device integrity check {integrityResult ? "passed" : "failed"}
                {!integrityResult &&
                  " - Potential tampering or debugging detected"}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DeviceSecurityPanel({ fingerprint }: { fingerprint: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Fingerprint className="h-5 w-5" />
          <span>Device Fingerprint</span>
        </CardTitle>
        <CardDescription>
          Unique device identification for security tracking
        </CardDescription>
      </CardHeader>
      <CardContent>
        {fingerprint ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium">Platform</span>
                <p className="text-sm text-gray-600">{fingerprint.platform}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Language</span>
                <p className="text-sm text-gray-600">{fingerprint.language}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Screen Resolution</span>
                <p className="text-sm text-gray-600">
                  {fingerprint.screenResolution}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium">
                  Hardware Concurrency
                </span>
                <p className="text-sm text-gray-600">
                  {fingerprint.hardwareConcurrency}
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <span className="text-sm font-medium">Device Hash</span>
              <p className="text-xs font-mono bg-gray-100 p-2 rounded break-all">
                {fingerprint.hash}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            Generating device fingerprint...
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function SecuritySettings({
  config,
  onUpdateConfig,
}: {
  config: any;
  onUpdateConfig: any;
}) {
  if (!config) return <div>Loading security configuration...</div>;

  const handleConfigChange = (key: string, value: any) => {
    onUpdateConfig({ [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <span>Security Configuration</span>
        </CardTitle>
        <CardDescription>Manage security features and policies</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Encryption</h4>
              <p className="text-sm text-gray-500">
                Enable AES-GCM encryption for sensitive data
              </p>
            </div>
            <button
              onClick={() =>
                handleConfigChange(
                  "encryptionEnabled",
                  !config.encryptionEnabled
                )
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config.encryptionEnabled ? "bg-blue-600" : "bg-gray-200"
              }`}
              aria-label={`Toggle encryption ${
                config.encryptionEnabled ? "off" : "on"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.encryptionEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Certificate Pinning</h4>
              <p className="text-sm text-gray-500">
                Validate server certificates to prevent MITM attacks
              </p>
            </div>
            <button
              onClick={() =>
                handleConfigChange(
                  "certificatePinningEnabled",
                  !config.certificatePinningEnabled
                )
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config.certificatePinningEnabled ? "bg-blue-600" : "bg-gray-200"
              }`}
              aria-label={`Toggle certificate pinning ${
                config.certificatePinningEnabled ? "off" : "on"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.certificatePinningEnabled
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Anti-Tamper Protection</h4>
              <p className="text-sm text-gray-500">
                Detect debugging and application tampering
              </p>
            </div>
            <button
              onClick={() =>
                handleConfigChange(
                  "antiTamperEnabled",
                  !config.antiTamperEnabled
                )
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config.antiTamperEnabled ? "bg-blue-600" : "bg-gray-200"
              }`}
              aria-label={`Toggle anti-tamper protection ${
                config.antiTamperEnabled ? "off" : "on"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.antiTamperEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Fraud Detection</h4>
              <p className="text-sm text-gray-500">
                Analyze transactions for suspicious patterns
              </p>
            </div>
            <button
              onClick={() =>
                handleConfigChange(
                  "fraudDetectionEnabled",
                  !config.fraudDetectionEnabled
                )
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config.fraudDetectionEnabled ? "bg-blue-600" : "bg-gray-200"
              }`}
              aria-label={`Toggle fraud detection ${
                config.fraudDetectionEnabled ? "off" : "on"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.fraudDetectionEnabled
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              value={config.sessionTimeout}
              onChange={(e) =>
                handleConfigChange("sessionTimeout", Number(e.target.value))
              }
              min="5"
              max="120"
              className="w-full px-3 py-2 border rounded"
              aria-label="Session timeout in minutes"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Max Failed Attempts</label>
            <input
              type="number"
              value={config.maxFailedAttempts}
              onChange={(e) =>
                handleConfigChange("maxFailedAttempts", Number(e.target.value))
              }
              min="1"
              max="10"
              className="w-full px-3 py-2 border rounded"
              aria-label="Maximum failed attempts"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

