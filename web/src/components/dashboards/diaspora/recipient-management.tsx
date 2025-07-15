// File: kobklein/web/src/components/dashboards/diaspora/recipient-management.tsx

"use client";

import { useState } from "react";
import { 
  Users, 
  Plus, 
  Edit3, 
  Trash2,
  Send,
  Phone,
  MapPin,
  Calendar,
  Heart
} from "lucide-react";

import { KobKleinCard } from "@/components/ui/kobklein-card";
import { Button } from "@/components/ui/enhanced-button";
import { KobKleinInput, FormField } from "@/components/ui/form-field";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Recipient {
  id: string;
  name: string;
  phone: string;
  walletId: string;
  relation: string;
  location: string;
  avatar?: string;
  addedDate: string;
  totalSent: number;
  lastTransfer?: {
    amount: number;
    date: string;
  };
  isActive: boolean;
}

interface RecipientManagementProps {
  recipients: Recipient[];
}

export function RecipientManagement({ recipients }: RecipientManagementProps) {
  const [isAddingRecipient, setIsAddingRecipient] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecipients = recipients.filter(recipient =>
    recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipient.relation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipient.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRelationIcon = (relation: string) => {
    switch (relation.toLowerCase()) {
      case 'mother':
      case 'father':
      case 'parent':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'brother':
      case 'sister':
      case 'sibling':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'friend':
        return <Users className="h-4 w-4 text-green-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRelationColor = (relation: string) => {
    switch (relation.toLowerCase()) {
      case 'mother':
      case 'father':
      case 'parent':
        return 'bg-red-100 text-red-700';
      case 'brother':
      case 'sister':
      case 'sibling':
        return 'bg-blue-100 text-blue-700';
      case 'friend':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (isAddingRecipient) {
    return (
      <KobKleinCard className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Add New Recipient</h3>
            <Button
              variant="ghost"
              onClick={() => setIsAddingRecipient(false)}
            >
              Cancel
            </Button>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Full Name" required>
                <KobKleinInput
                  placeholder="Enter recipient's name"
                />
              </FormField>

              <FormField label="Relationship" required>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="">Select relationship</option>
                  <option value="mother">Mother</option>
                  <option value="father">Father</option>
                  <option value="brother">Brother</option>
                  <option value="sister">Sister</option>
                  <option value="child">Child</option>
                  <option value="spouse">Spouse</option>
                  <option value="friend">Friend</option>
                  <option value="other">Other</option>
                </select>
              </FormField>
            </div>

            <FormField label="Phone Number" required>
              <KobKleinInput
                type="tel"
                placeholder="+509 1234 5678"
                leftIcon={<Phone className="h-4 w-4" />}
              />
            </FormField>

            <FormField label="Location in Haiti" required>
              <KobKleinInput
                placeholder="e.g., Port-au-Prince, Pétion-Ville"
                leftIcon={<MapPin className="h-4 w-4" />}
              />
            </FormField>

            <FormField label="KobKlein Wallet ID (Optional)">
              <KobKleinInput
                placeholder="If they already have a KobKlein account"
              />
            </FormField>

            <div className="flex space-x-3">
              <Button variant="kobklein" className="flex-1">
                Add Recipient
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setIsAddingRecipient(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </KobKleinCard>
    );
  }

  return (
    <KobKleinCard className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">My Recipients</h3>
          <Button
            variant="kobklein"
            onClick={() => setIsAddingRecipient(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Recipient
          </Button>
        </div>

        {/* Search */}
        <div className="space-y-3">
          <KobKleinInput
            placeholder="Search recipients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Recipients List */}
        <div className="space-y-4">
          {filteredRecipients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'No recipients found' : 'No recipients added yet'}
            </div>
          ) : (
            filteredRecipients.map((recipient) => (
              <div
                key={recipient.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-kobklein-accent rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {recipient.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{recipient.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs ${getRelationColor(recipient.relation)}`}>
                          {recipient.relation}
                        </span>
                        {!recipient.isActive && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            Inactive
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>{recipient.phone}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{recipient.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                        <span>Total sent: {formatCurrency(recipient.totalSent, 'USD')}</span>
                        {recipient.lastTransfer && (
                          <span>
                            Last: {formatCurrency(recipient.lastTransfer.amount, 'USD')} • 
                            {formatDate(recipient.lastTransfer.date, { relative: true })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setEditingRecipient(recipient.id)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Stats */}
        {recipients.length > 0 && (
          <div className="border-t pt-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{recipients.length}</p>
                <p className="text-sm text-muted-foreground">Total Recipients</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {recipients.filter(r => r.isActive).length}
                </p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {formatCurrency(recipients.reduce((sum, r) => sum + r.totalSent, 0), 'USD')}
                </p>
                <p className="text-sm text-muted-foreground">Total Sent</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </KobKleinCard>
  );
}