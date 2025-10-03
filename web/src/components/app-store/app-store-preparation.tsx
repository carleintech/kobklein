import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import AppStoreManager, {
  type AppMetadata,
  type StoreRequirements,
} from "@/lib/app-store";
import {
  AlertCircle,
  CheckCircle,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Globe,
  Image,
  Monitor,
  RefreshCw,
  Settings,
  Smartphone,
  Store,
} from "lucide-react";
import { useEffect, useState } from "react";

interface AppStorePreparationProps {
  className?: string;
}

export default function AppStorePreparation({
  className,
}: AppStorePreparationProps) {
  const [activeStore, setActiveStore] =
    useState<keyof StoreRequirements>("googlePlay");
  const [metadata, setMetadata] = useState<AppMetadata>(
    AppStoreManager.generateAppMetadata()
  );
  const [readinessCheck, setReadinessCheck] = useState<ReturnType<
    typeof AppStoreManager.validatePWAReadiness
  > | null>(null);
  const [generatedAssets, setGeneratedAssets] = useState<{
    [key: string]: string;
  }>({});
  const [uploadedScreenshots, setUploadedScreenshots] = useState<File[]>([]);

  useEffect(() => {
    // Check PWA readiness on component mount
    const check = AppStoreManager.validatePWAReadiness();
    setReadinessCheck(check);
  }, []);

  const handleMetadataChange = (
    field: keyof AppMetadata,
    value: string | string[]
  ) => {
    setMetadata((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateAssets = async (store: keyof StoreRequirements) => {
    // Simulate asset generation
    const requirements = AppStoreManager.getRequirements(store);
    const assets: { [key: string]: string } = {};

    requirements.icons.forEach((icon) => {
      assets[
        `${icon.name}_${icon.size}`
      ] = `Generated ${icon.name} (${icon.size})`;
    });

    requirements.screenshots.forEach((screenshot) => {
      assets[
        `${screenshot.name}_${screenshot.size}`
      ] = `Generated ${screenshot.name} (${screenshot.size})`;
    });

    setGeneratedAssets((prev) => ({ ...prev, ...assets }));
  };

  const downloadConfig = (configType: string) => {
    let config: any;
    let filename: string;

    switch (configType) {
      case "manifest":
        config = {
          name: metadata.name,
          short_name: metadata.shortName,
          description: metadata.description,
          start_url: "/",
          display: "standalone",
          background_color: "#ffffff",
          theme_color: "#3B82F6",
          icons: [
            {
              src: "/icons/icon-192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/icons/icon-512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        };
        filename = "manifest.json";
        break;
      case "twa":
        config = AppStoreManager.generateTWAConfig(
          "https://kobklein.com/manifest.json",
          "com.techklein.kobklein"
        );
        filename = "twa-config.json";
        break;
      case "assetlinks":
        config = [
          AppStoreManager.generateDigitalAssetLinks(
            "com.techklein.kobklein",
            "YOUR_SHA256_FINGERPRINT"
          ),
        ];
        filename = "assetlinks.json";
        break;
      default:
        return;
    }

    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show toast notification
  };

  const storeRequirements = AppStoreManager.getAllRequirements();
  const currentStoreReqs = storeRequirements[activeStore];
  const storeDescriptions = AppStoreManager.generateStoreDescriptions();
  const optimization = AppStoreManager.generateAppStoreOptimization();

  return (
    <div className={`p-6 max-w-7xl mx-auto space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">App Store Preparation</h2>
          <p className="text-muted-foreground">
            Prepare KobKlein for distribution across app stores
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() =>
              setReadinessCheck(AppStoreManager.validatePWAReadiness())
            }
            aria-label="Refresh PWA readiness check"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Check Readiness
          </Button>
        </div>
      </div>

      {/* PWA Readiness Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {readinessCheck?.passed ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
            PWA Readiness Status
          </CardTitle>
          <CardDescription>
            Current state of Progressive Web App requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {readinessCheck && (
            <div className="space-y-4">
              <div>
                <Badge
                  variant={readinessCheck.passed ? "default" : "destructive"}
                >
                  {readinessCheck.passed
                    ? "Ready for Distribution"
                    : "Issues Found"}
                </Badge>
              </div>

              {readinessCheck.issues.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-600 mb-2">
                    Issues to Fix:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {readinessCheck.issues.map((issue, index) => (
                      <li key={index} className="text-red-600">
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2">Recommendations:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {readinessCheck.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="stores" className="space-y-6">
        <TabsList>
          <TabsTrigger value="stores">Store Requirements</TabsTrigger>
          <TabsTrigger value="metadata">App Metadata</TabsTrigger>
          <TabsTrigger value="assets">Asset Generation</TabsTrigger>
          <TabsTrigger value="config">Configuration Files</TabsTrigger>
          <TabsTrigger value="optimization">SEO & ASO</TabsTrigger>
        </TabsList>

        {/* Store Requirements */}
        <TabsContent value="stores">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Store Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Target Stores</CardTitle>
                <CardDescription>
                  Select stores for distribution
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(storeRequirements).map(([key, store]) => {
                  const Icon =
                    key === "googlePlay"
                      ? Smartphone
                      : key === "microsoftStore"
                      ? Monitor
                      : Globe;
                  return (
                    <Button
                      key={key}
                      variant={activeStore === key ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() =>
                        setActiveStore(key as keyof StoreRequirements)
                      }
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {key === "googlePlay"
                        ? "Google Play Store"
                        : key === "microsoftStore"
                        ? "Microsoft Store"
                        : "Web App Stores"}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Requirements Details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="w-5 h-5" />
                  {activeStore === "googlePlay"
                    ? "Google Play Store"
                    : activeStore === "microsoftStore"
                    ? "Microsoft Store"
                    : "Web App Stores"}{" "}
                  Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Icons */}
                <div>
                  <h4 className="font-medium mb-3">Required Icons</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentStoreReqs.icons.map((icon, index) => (
                      <Card key={index} className="p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium">{icon.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {icon.size}
                            </div>
                            {icon.specifications && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {icon.specifications.format} •{" "}
                                {icon.specifications.maxSize}
                              </div>
                            )}
                          </div>
                          <Badge
                            variant={icon.required ? "default" : "secondary"}
                          >
                            {icon.required ? "Required" : "Optional"}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Screenshots */}
                <div>
                  <h4 className="font-medium mb-3">Screenshots</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentStoreReqs.screenshots.map((screenshot, index) => (
                      <Card key={index} className="p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium">{screenshot.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {screenshot.size}
                            </div>
                            {screenshot.specifications && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {screenshot.specifications.format} •{" "}
                                {screenshot.specifications.maxSize}
                              </div>
                            )}
                          </div>
                          <Badge
                            variant={
                              screenshot.required ? "default" : "secondary"
                            }
                          >
                            {screenshot.required ? "Required" : "Optional"}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Additional Requirements */}
                <div>
                  <h4 className="font-medium mb-3">Additional Requirements</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {currentStoreReqs.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* App Metadata */}
        <TabsContent value="metadata">
          <Card>
            <CardHeader>
              <CardTitle>App Metadata</CardTitle>
              <CardDescription>
                Configure app information for store listings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="app-name">App Name</Label>
                    <Input
                      id="app-name"
                      value={metadata.name}
                      onChange={(e) =>
                        handleMetadataChange("name", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="short-name">Short Name</Label>
                    <Input
                      id="short-name"
                      value={metadata.shortName}
                      onChange={(e) =>
                        handleMetadataChange("shortName", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={metadata.category}
                      onValueChange={(value) =>
                        handleMetadataChange("category", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                        <SelectItem value="Productivity">
                          Productivity
                        </SelectItem>
                        <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="developer">Developer</Label>
                    <Input
                      id="developer"
                      value={metadata.developer}
                      onChange={(e) =>
                        handleMetadataChange("developer", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="version">Version</Label>
                    <Input
                      id="version"
                      value={metadata.version}
                      onChange={(e) =>
                        handleMetadataChange("version", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="website">Website URL</Label>
                    <Input
                      id="website"
                      value={metadata.website}
                      onChange={(e) =>
                        handleMetadataChange("website", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="support-email">Support Email</Label>
                    <Input
                      id="support-email"
                      value={metadata.supportEmail}
                      onChange={(e) =>
                        handleMetadataChange("supportEmail", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="privacy-policy">Privacy Policy URL</Label>
                    <Input
                      id="privacy-policy"
                      value={metadata.privacyPolicy}
                      onChange={(e) =>
                        handleMetadataChange("privacyPolicy", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="terms">Terms of Service URL</Label>
                    <Input
                      id="terms"
                      value={metadata.termsOfService}
                      onChange={(e) =>
                        handleMetadataChange("termsOfService", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                    <Input
                      id="keywords"
                      value={metadata.keywords.join(", ")}
                      onChange={(e) =>
                        handleMetadataChange(
                          "keywords",
                          e.target.value.split(", ")
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="description">App Description</Label>
                <Textarea
                  id="description"
                  value={metadata.description}
                  onChange={(e) =>
                    handleMetadataChange("description", e.target.value)
                  }
                  rows={6}
                  className="mt-2"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {metadata.description.length} characters
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">App Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {metadata.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={`feature-${index}`}
                        checked={true}
                        disabled
                      />
                      <Label htmlFor={`feature-${index}`} className="text-sm">
                        {feature}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Asset Generation */}
        <TabsContent value="assets">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Assets</CardTitle>
                <CardDescription>
                  Create store-specific assets and screenshots
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {Object.entries(storeRequirements).map(([key, store]) => (
                    <Button
                      key={key}
                      variant="outline"
                      className="w-full justify-between"
                      onClick={() =>
                        generateAssets(key as keyof StoreRequirements)
                      }
                    >
                      <div className="flex items-center gap-2">
                        <Image className="w-4 h-4" />
                        Generate{" "}
                        {key === "googlePlay"
                          ? "Google Play"
                          : key === "microsoftStore"
                          ? "Microsoft Store"
                          : "Web"}{" "}
                        Assets
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {store.icons.length + store.screenshots.length} assets
                      </div>
                    </Button>
                  ))}
                </div>

                <Separator />

                <div>
                  <Label htmlFor="screenshot-upload">Upload Screenshots</Label>
                  <Input
                    id="screenshot-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files) {
                        setUploadedScreenshots(Array.from(e.target.files));
                      }
                    }}
                    className="mt-2"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Upload PNG or JPEG screenshots for manual processing
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generated Assets</CardTitle>
                <CardDescription>Assets ready for download</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(generatedAssets).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Image className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No assets generated yet</p>
                    <p className="text-sm">
                      Generate assets for your target stores
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(generatedAssets).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-2 bg-muted rounded"
                      >
                        <span className="text-sm">{value}</span>
                        <Button size="sm" variant="ghost">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {uploadedScreenshots.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-medium mb-2">Uploaded Screenshots</h5>
                    <div className="space-y-2">
                      {uploadedScreenshots.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-muted rounded"
                        >
                          <span className="text-sm">{file.name}</span>
                          <Badge variant="secondary">
                            {(file.size / 1024 / 1024).toFixed(1)}MB
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Configuration Files */}
        <TabsContent value="config">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration Files</CardTitle>
                <CardDescription>
                  Download store-specific configuration files
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => downloadConfig("manifest")}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    PWA Manifest
                  </div>
                  <Download className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => downloadConfig("twa")}
                >
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    TWA Configuration
                  </div>
                  <Download className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => downloadConfig("assetlinks")}
                >
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Digital Asset Links
                  </div>
                  <Download className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Store Descriptions</CardTitle>
                <CardDescription>
                  Copy-ready descriptions for each store
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(storeDescriptions).map(
                  ([store, descriptions]) => (
                    <div key={store} className="space-y-2">
                      <h5 className="font-medium">
                        {store === "googlePlay"
                          ? "Google Play Store"
                          : store === "microsoftStore"
                          ? "Microsoft Store"
                          : "Web App Stores"}
                      </h5>
                      <div className="p-3 bg-muted rounded text-sm">
                        <div className="max-h-32 overflow-y-auto">
                          {descriptions.full}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="mt-2"
                          onClick={() => copyToClipboard(descriptions.full)}
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SEO & ASO */}
        <TabsContent value="optimization">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO Optimization</CardTitle>
                <CardDescription>
                  Search engine optimization settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>SEO Title</Label>
                  <div className="p-3 bg-muted rounded text-sm mt-1">
                    {optimization.seo.title}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-2"
                      onClick={() => copyToClipboard(optimization.seo.title)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>SEO Description</Label>
                  <div className="p-3 bg-muted rounded text-sm mt-1">
                    {optimization.seo.description}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-2"
                      onClick={() =>
                        copyToClipboard(optimization.seo.description)
                      }
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>SEO Keywords</Label>
                  <div className="p-3 bg-muted rounded text-sm mt-1">
                    {optimization.seo.keywords.join(", ")}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-2"
                      onClick={() =>
                        copyToClipboard(optimization.seo.keywords.join(", "))
                      }
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>App Store Optimization</CardTitle>
                <CardDescription>
                  ASO settings for better discoverability
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>App Store Title</Label>
                  <div className="p-3 bg-muted rounded text-sm mt-1">
                    {optimization.appStoreOptimization.title}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-2"
                      onClick={() =>
                        copyToClipboard(optimization.appStoreOptimization.title)
                      }
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Subtitle</Label>
                  <div className="p-3 bg-muted rounded text-sm mt-1">
                    {optimization.appStoreOptimization.subtitle}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-2"
                      onClick={() =>
                        copyToClipboard(
                          optimization.appStoreOptimization.subtitle
                        )
                      }
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>ASO Keywords</Label>
                  <div className="p-3 bg-muted rounded text-sm mt-1">
                    {optimization.appStoreOptimization.keywords}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-2"
                      onClick={() =>
                        copyToClipboard(
                          optimization.appStoreOptimization.keywords
                        )
                      }
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Promotional Text</Label>
                  <div className="p-3 bg-muted rounded text-sm mt-1">
                    {optimization.appStoreOptimization.promotionalText}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-2"
                      onClick={() =>
                        copyToClipboard(
                          optimization.appStoreOptimization.promotionalText
                        )
                      }
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
