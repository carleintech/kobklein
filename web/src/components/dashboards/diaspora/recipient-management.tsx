import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Edit3, MapPin, Phone, Plus, Star, Users } from "lucide-react";

interface Recipient {
  id: string;
  name: string;
  phone: string;
  location: string;
  relationship: string;
  totalReceived: number;
  lastTransfer: string;
  preferredMethod: "cash" | "mobile" | "bank";
  isVerified: boolean;
  isFavorite: boolean;
}

interface RecipientManagementProps {
  recipients: Recipient[];
}

export function RecipientManagement({ recipients }: RecipientManagementProps) {
  const totalRecipients = recipients.length;
  const verifiedRecipients = recipients.filter((r) => r.isVerified).length;
  const favoriteRecipients = recipients.filter((r) => r.isFavorite);

  const getMethodColor = (method: string) => {
    switch (method) {
      case "cash":
        return "bg-green-100 text-green-800";
      case "mobile":
        return "bg-blue-100 text-blue-800";
      case "bank":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "cash":
        return "💵";
      case "mobile":
        return "📱";
      case "bank":
        return "🏦";
      default:
        return "💳";
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Recipients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRecipients}</div>
            <p className="text-xs text-muted-foreground">Family & friends</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <Badge className="h-4 w-4 bg-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedRecipients}</div>
            <p className="text-xs text-muted-foreground">Identity confirmed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {favoriteRecipients.length}
            </div>
            <p className="text-xs text-muted-foreground">Quick access</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Add New</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-kobklein-primary hover:bg-kobklein-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Recipient
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Favorite Recipients */}
      {favoriteRecipients.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Star className="h-5 w-5 mr-2 text-yellow-500" />
              Favorite Recipients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoriteRecipients.slice(0, 6).map((recipient) => (
                <div
                  key={recipient.id}
                  className="p-4 border rounded-lg bg-yellow-50 border-yellow-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{recipient.name}</div>
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {recipient.phone}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {recipient.location}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {recipient.relationship}
                    </Badge>
                    <Button size="sm" variant="outline">
                      Send Money
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Recipients */}
      <Card>
        <CardHeader>
          <CardTitle>All Recipients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recipients.map((recipient) => (
              <div
                key={recipient.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-kobklein-primary rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <div className="font-medium">{recipient.name}</div>
                      {recipient.isFavorite && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                      {recipient.isVerified && (
                        <Badge className="h-4 w-4 bg-green-600 text-white text-xs px-1">
                          ✓
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center space-x-3">
                      <span className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {recipient.phone}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {recipient.location}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {recipient.relationship} • Last transfer:{" "}
                      {recipient.lastTransfer}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      ${recipient.totalReceived.toLocaleString()} received
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span className="mr-1">
                        {getMethodIcon(recipient.preferredMethod)}
                      </span>
                      <Badge
                        className={getMethodColor(recipient.preferredMethod)}
                      >
                        {recipient.preferredMethod.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      className="bg-kobklein-primary hover:bg-kobklein-primary/90"
                    >
                      Send Money
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

