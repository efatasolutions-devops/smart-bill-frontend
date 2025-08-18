"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Users, ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ReceiptData, Person } from "@/app/(app)/splitbill/page";

interface NameManagerProps {
  receiptData: ReceiptData;
  onPeopleAdded: (people: Person[]) => void;
  onBack: () => void;
}

export default function NameManager({
  receiptData,
  onPeopleAdded,
  onBack,
}: NameManagerProps) {
  const [newName, setNewName] = useState("");
  const [people, setPeople] = useState<Person[]>([]);
  const { toast } = useToast();

  const addPerson = () => {
    if (!newName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name",
        variant: "destructive",
      });
      return;
    }

    if (
      people.some(
        (person) => person.name.toLowerCase() === newName.toLowerCase()
      )
    ) {
      toast({
        title: "Name already exists",
        description: "This person is already in the list",
        variant: "destructive",
      });
      return;
    }

    const newPerson: Person = {
      id: Date.now().toString(),
      name: newName.trim(),
      items: [],
      total: 0,
    };

    setPeople([...people, newPerson]);
    setNewName("");

    toast({
      title: "Person added",
      description: `${newName} has been added to the split`,
    });
  };

  const removePerson = (id: string) => {
    setPeople(people.filter((person) => person.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addPerson();
    }
  };

  const proceedToAssignment = () => {
    if (people.length === 0) {
      toast({
        title: "Need more people",
        description: "Add at least 1 person to split the bill",
        variant: "destructive",
      });
    } else {
      onPeopleAdded(people);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-md mx-auto">
      {/* Receipt Summary */}
      <Card className="bg-gray-50 border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg font-semibold text-gray-800">
            {receiptData.restaurant.store_name || "Unknown Restaurant"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">
              {receiptData.items.length} item{receiptData.items.length !== 1 ? "s" : ""}
            </span>
            <span className="text-lg sm:text-xl font-bold text-gray-900">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(receiptData.total)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Add People Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Users className="w-5 h-5" />
            Add People to Split
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Input & Button */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Enter person's name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 text-sm sm:text-base"
            />
            <Button
              onClick={addPerson}
              className="px-4 sm:px-6 whitespace-nowrap"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>

          {/* People List */}
          {people.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700 text-sm">
                People ({people.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {people.map((person) => (
                  <Badge
                    key={person.id}
                    variant="outline"
                    className="text-sm py-1 px-3 max-w-full truncate"
                  >
                    <span className="truncate max-w-[120px] sm:max-w-xs">
                      {person.name}
                    </span>
                    <button
                      onClick={() => removePerson(person.id)}
                      className="ml-1 hover:text-red-600"
                      aria-label={`Remove ${person.name}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {people.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No people added yet</p>
              <p className="text-xs text-gray-400">Add at least 1 person to continue</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
        <Button
          variant="outline"
          onClick={onBack}
          className="w-full sm:w-auto justify-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Upload
        </Button>

        <Button
          onClick={proceedToAssignment}
          disabled={people.length === 0}
          className="w-full sm:w-auto justify-center"
        >
          Continue to Assignment
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}