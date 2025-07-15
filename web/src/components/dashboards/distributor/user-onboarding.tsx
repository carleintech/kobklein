// File: kobklein/web/src/components/dashboards/distributor/user-onboarding.tsx

"use client";

import { useState } from "react";
import { 
  UserPlus, 
  Store, 
  User,
  Phone,
  MapPin,
  CreditCard,
  CheckCircle,
  AlertCircle,
  IdCard
} from "lucide-react";

import { KobKleinCard } from "@/components/ui/kobklein-card";
import { Button } from "@/components/ui/enhanced-button";
import { KobKleinInput, FormField } from "@/components/ui/form-field";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/lib/toast";

type UserType = 'client' | 'merchant';
type OnboardingStep = 'type' | 'details' | 'card' | 'confirmation';

export function UserOnboarding() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('type');
  const [userType, setUserType] = useState<UserType>('client');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
    businessName: '',
    businessType: '',
    cardId: '',
  });
  
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (currentStep === 'type') {
      setCurrentStep('details');
    } else if (currentStep === 'details') {
      setCurrentStep('card');
    } else if (currentStep === 'card') {
      handleCreateUser();
    }
  };

  const handleCreateUser = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate user creation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setCurrentStep('confirmation');
      toast.success(`${userType === 'client' ? 'Client' : 'Merchant'} successfully onboarded!`);
      
      // Reset form after success
      setTimeout(() => {
        setCurrentStep('type');
        setFormData({
          firstName: '',
          lastName: '',
          phone: '',
          location: '',
          businessName: '',
          businessType: '',
          cardId: '',
        });
      }, 4000);
      
    } catch (error) {
      toast.error('Failed to create user. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'type':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-center">Select User Type</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  userType === 'client'
                    ? 'border-kobklein-accent bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setUserType('client')}
              >
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold">Individual Client</h4>
                  <p className="text-sm text-muted-foreground">
                    Regular user who will use KobKlein for personal transactions
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Send and receive money</li>
                    <li>• Make payments to merchants</li>
                    <li>• Receive from diaspora</li>
                  </ul>
                </div>
              </div>

              <div
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  userType === 'merchant'
                    ? 'border-kobklein-accent bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setUserType('merchant')}
              >
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Store className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold">Business Merchant</h4>
                  <p className="text-sm text-muted-foreground">
                    Business owner who will accept payments from customers
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Accept NFC and QR payments</li>
                    <li>• Track sales and analytics</li>
                    <li>• Request wallet refills</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              variant="kobklein"
              className="w-full"
              onClick={handleNextStep}
            >
              Continue with {userType === 'client' ? 'Client' : 'Merchant'} Setup
            </Button>
          </div>
        );

      case 'details':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {userType === 'client' ? 'Client' : 'Merchant'} Information
              </h3>
              <Badge variant="outline" className="bg-blue-100 text-blue-700">
                {userType === 'client' ? 'Individual' : 'Business'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="First Name" required>
                <KobKleinInput
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                />
              </FormField>

              <FormField label="Last Name" required>
                <KobKleinInput
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                />
              </FormField>
            </div>

            <FormField label="Phone Number" required>
              <KobKleinInput
                type="tel"
                placeholder="+509 1234 5678"
                leftIcon={<Phone className="h-4 w-4" />}
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </FormField>

            <FormField label="Location" required>
              <KobKleinInput
                placeholder="Enter address or neighborhood"
                leftIcon={<MapPin className="h-4 w-4" />}
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </FormField>

            {userType === 'merchant' && (
              <>
                <FormField label="Business Name" required>
                  <KobKleinInput
                    placeholder="Enter business name"
                    leftIcon={<Store className="h-4 w-4" />}
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                  />
                </FormField>

                <FormField label="Business Type" required>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={formData.businessType}
                    onChange={(e) => handleInputChange('businessType', e.target.value)}
                  >
                    <option value="">Select business type</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="shop">Shop/Store</option>
                    <option value="services">Services</option>
                    <option value="transportation">Transportation</option>
                    <option value="other">Other</option>
                  </select>
                </FormField>
              </>
            )}

            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setCurrentStep('type')}
              >
                Back
              </Button>
              <Button
                variant="kobklein"
                className="flex-1"
                onClick={handleNextStep}
                disabled={!formData.firstName || !formData.lastName || !formData.phone || !formData.location}
              >
                Continue
              </Button>
            </div>
          </div>
        );

      case 'card':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Activate KobKlein Card</h3>
            
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-700">
                    Card Activation Instructions
                  </p>
                  <ol className="text-sm text-amber-600 mt-2 space-y-1">
                    <li>1. Give the client a new KobKlein card</li>
                    <li>2. Scan or enter the card ID from the back</li>
                    <li>3. The card will be linked to their account</li>
                    <li>4. Client can start using it immediately</li>
                  </ol>
                </div>
              </div>
            </div>

            <FormField label="Card ID" required>
              <KobKleinInput
                placeholder="Scan or enter card ID (e.g., KK001234)"
                leftIcon={<IdCard className="h-4 w-4" />}
                value={formData.cardId}
                onChange={(e) => handleInputChange('cardId', e.target.value.toUpperCase())}
              />
            </FormField>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-700 mb-2">User Summary</h4>
              <div className="text-sm text-blue-600 space-y-1">
                <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                <p><strong>Phone:</strong> {formData.phone}</p>
                <p><strong>Type:</strong> {userType === 'client' ? 'Individual Client' : 'Business Merchant'}</p>
                {userType === 'merchant' && formData.businessName && (
                  <p><strong>Business:</strong> {formData.businessName}</p>
                )}
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setCurrentStep('details')}
              >
                Back
              </Button>
              <Button
                variant="kobklein"
                className="flex-1"
                onClick={handleNextStep}
                disabled={!formData.cardId}
                loading={isProcessing}
                loadingText="Creating Account..."
              >
                Create Account
              </Button>
            </div>
          </div>
        );

      case 'confirmation':
        return (
          <div className="text-center space-y-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            
            <div>
              <h3 className="text-xl font-bold text-green-600">Account Created Successfully!</h3>
              <p className="text-muted-foreground mt-2">
                {formData.firstName} {formData.lastName} has been onboarded as a {userType}
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-green-700 space-y-1">
                <p><strong>Card ID:</strong> {formData.cardId}</p>
                <p><strong>Phone:</strong> {formData.phone}</p>
                <p><strong>Status:</strong> Active and ready to use</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                The user can now start using their KobKlein card for transactions.
                You'll receive your onboarding commission within 24 hours.
              </p>
              
              <Button
                variant="kobklein"
                className="w-full"
                onClick={() => {
                  setCurrentStep('type');
                  setFormData({
                    firstName: '',
                    lastName: '',
                    phone: '',
                    location: '',
                    businessName: '',
                    businessType: '',
                    cardId: '',
                  });
                }}
              >
                Onboard Another User
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <KobKleinCard className="p-6">
      <div className="space-y-6">
        {/* Progress Indicator */}
        {currentStep !== 'confirmation' && (
          <div className="flex items-center space-x-2">
            {['type', 'details', 'card'].map((step, index) => (
              <div key={step} className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === step 
                    ? 'bg-kobklein-accent text-white' 
                    : index < ['type', 'details', 'card'].indexOf(currentStep)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                }`}>
                  {index < ['type', 'details', 'card'].indexOf(currentStep) ? '✓' : index + 1}
                </div>
                {index < 2 && <div className="w-8 h-1 bg-gray-200 rounded-full" />}
              </div>
            ))}
          </div>
        )}

        {renderStepContent()}
      </div>
    </KobKleinCard>
  );
}