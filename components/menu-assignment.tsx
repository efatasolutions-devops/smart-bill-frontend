"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  Utensils,
  Users,
  Plus,
  Edit3,
  Trash2,
  Receipt,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ReceiptData, Person, MenuItem } from "@/app/(app)/splitbill/page";
import { buildSummaryPayload } from "@/app/(app)/splitbill/utils/buildSummaryPayload";
import axios from "axios";
import Cookies from "js-cookie";

interface MenuAssignmentProps {
  receiptData: ReceiptData;
  receiptImage?: string;
  people: Person[];
  onAssignmentComplete: (updatedPeople: Person[]) => void;
  onBack: () => void;
}

interface EditableMenuItem extends MenuItem {
  isManual?: boolean;
}

interface ItemAssignment {
  itemId: string;
  assignedPeople: string[]; // Array of person IDs who share this item
}

export default function MenuAssignment({
  receiptData,
  receiptImage,
  people,
  onAssignmentComplete,
  onBack,
}: MenuAssignmentProps) {
  const [editableItems, setEditableItems] = useState<EditableMenuItem[]>([]);
  const [assignments, setAssignments] = useState<ItemAssignment[]>([]);
  const [updatedPeople, setUpdatedPeople] = useState<Person[]>(people);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", price: 0, quantity: 1 });
  const { toast } = useToast();

  // Initialize editable items and assignments
  useEffect(() => {
    setEditableItems(
      receiptData.items.map((item) => ({ ...item, isManual: false }))
    );
    const initialAssignments = receiptData.items.map((item) => ({
      itemId: item.id,
      assignedPeople: [],
    }));
    setAssignments(initialAssignments);
  }, [receiptData.items]);

  // Calculate totals whenever assignments or items change
  useEffect(() => {
    const newPeople = people.map((person) => ({
      ...person,
      items: [],
      total: 0,
    }));

    assignments.forEach((assignment) => {
      const item = editableItems.find((i) => i.id === assignment.itemId);
      if (!item || assignment.assignedPeople.length === 0) return;

      const totalItemCost = item.price * item.quantity;
      const costPerPerson = totalItemCost / assignment.assignedPeople.length;

      assignment.assignedPeople.forEach((personId) => {
        const person = newPeople.find((p) => p.id === personId);
        if (!person) return;

        const assignedItem: MenuItem = {
          ...item,
          quantity: item.quantity / assignment.assignedPeople.length,
          price: costPerPerson,
        };

        person.items.push(assignedItem);
        person.total += costPerPerson;
      });
    });

    setUpdatedPeople(newPeople);
  }, [assignments, editableItems, people]);

  const updateItem = (
    itemId: string,
    field: keyof EditableMenuItem,
    value: string | number
  ) => {
    setEditableItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              [field]:
                field === "price" || field === "quantity"
                  ? Number(value)
                  : value,
            }
          : item
      )
    );
  };

  const addNewItem = () => {
    if (!newItem.name.trim() || newItem.price <= 0) {
      toast({
        title: "Invalid item",
        description: "Please enter a valid name and price",
        variant: "destructive",
      });
      return;
    }

    const id = `manual-${Date.now()}`;
    const manualItem: EditableMenuItem = {
      id,
      name: newItem.name,
      price: newItem.price,
      quantity: newItem.quantity,
      isManual: true,
    };

    setEditableItems((prev) => [...prev, manualItem]);
    setAssignments((prev) => [...prev, { itemId: id, assignedPeople: [] }]);
    setNewItem({ name: "", price: 0, quantity: 1 });
    setIsAddingNewItem(false);

    toast({
      title: "Item added",
      description: `${newItem.name} has been added to the receipt`,
    });
  };

  const deleteItem = (itemId: string) => {
    setEditableItems((prev) => prev.filter((item) => item.id !== itemId));
    setAssignments((prev) =>
      prev.filter((assignment) => assignment.itemId !== itemId)
    );

    toast({
      title: "Item deleted",
      description: "Item has been removed from the receipt",
    });
  };

  const togglePersonAssignment = (itemId: string, personId: string) => {
    setAssignments((prev) => {
      return prev.map((assignment) => {
        if (assignment.itemId !== itemId) return assignment;

        const isAssigned = assignment.assignedPeople.includes(personId);

        if (isAssigned) {
          return {
            ...assignment,
            assignedPeople: assignment.assignedPeople.filter(
              (id) => id !== personId
            ),
          };
        } else {
          return {
            ...assignment,
            assignedPeople: [...assignment.assignedPeople, personId],
          };
        }
      });
    });
  };

  const isPersonAssigned = (itemId: string, personId: string): boolean => {
    const assignment = assignments.find((a) => a.itemId === itemId);
    return assignment?.assignedPeople.includes(personId) || false;
  };

  const getAssignedPeopleCount = (itemId: string): number => {
    const assignment = assignments.find((a) => a.itemId === itemId);
    return assignment?.assignedPeople.length || 0;
  };

  const assignToAllPeople = (itemId: string) => {
    setAssignments((prev) =>
      prev.map((assignment) =>
        assignment.itemId === itemId
          ? { ...assignment, assignedPeople: people.map((p) => p.id) }
          : assignment
      )
    );
  };

  const clearItemAssignments = (itemId: string) => {
    setAssignments((prev) =>
      prev.map((assignment) =>
        assignment.itemId === itemId
          ? { ...assignment, assignedPeople: [] }
          : assignment
      )
    );
  };

  const isAssignmentComplete = (): boolean => {
    return editableItems.every((item) => getAssignedPeopleCount(item.id) > 0);
  };

  const proceedToSummary = async () => {
    if (!isAssignmentComplete()) {
      toast({
        title: "Assignment incomplete",
        description: "Please assign all items to at least one person",
        variant: "destructive",
      });
      return;
    }

    const payload = buildSummaryPayload(updatedPeople, receiptData);

    console.log("dd;; ", process.env);
    try {
      const { data } = await axios(
        `${process.env.NEXT_PUBLIC_BASE_URL}/splitbill`,
        {
          method: "POST",
          data: payload,
          headers: {
            Authorization: `Bearer ${Cookies?.get("token")}`,
          },
        }
      );

      toast({
        title: "Success",
        description: data?.message,
        variant: "default",
      });

      onAssignmentComplete(updatedPeople);
    } catch (err: any) {
      toast({
        title: "API Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  // const proceedToSummary = () => {
  //   if (!isAssignmentComplete()) {
  //     toast({
  //       title: "Assignment incomplete",
  //       description: "Please assign all items to at least one person",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   onAssignmentComplete(updatedPeople);
  // };

  const getItemsSubtotal = (): number => {
    return editableItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const getTaxPerPerson = (personTotal: number): number => {
    const itemsSubtotal = getItemsSubtotal();
    if (itemsSubtotal === 0) return 0;

    return (receiptData.tax.total_tax * personTotal) / itemsSubtotal;
  };

  const getServicePerPerson = (personTotal: number): number => {
    const itemsSubtotal = getItemsSubtotal();
    if (itemsSubtotal === 0) return 0;
    return (receiptData.serviceCharge * personTotal) / itemsSubtotal;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Assign Menu Items</h3>
          <p className="text-gray-600">
            Edit items if needed and assign who shares each menu
          </p>
        </div>
        <Badge variant={isAssignmentComplete() ? "default" : "secondary"}>
          {
            editableItems.filter((item) => getAssignedPeopleCount(item.id) > 0)
              .length
          }{" "}
          / {editableItems.length} Assigned
        </Badge>
      </div>

      {/* Receipt Image */}
      {receiptImage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Receipt className="w-4 h-4" />
              Receipt Photo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-md mx-auto">
              <img
                src={receiptImage || "/placeholder.svg"}
                alt="Receipt"
                className="w-full h-auto rounded-lg border shadow-sm"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overall Summary */}
      <Card className="bg-slate-50 border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Calculator className="w-5 h-5" />
            Receipt Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <p className="text-slate-600">Items Subtotal</p>
              <p className="font-semibold text-lg">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(Number(getItemsSubtotal() || 0))}
              </p>
            </div>
            <div className="text-center">
              <p className="text-slate-600">Tax</p>
              <p className="font-semibold text-lg">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(Number(receiptData.tax?.total_tax || 0))}
              </p>
            </div>
            <div className="text-center">
              <p className="text-slate-600">Service</p>
              <p className="font-semibold text-lg">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(receiptData.serviceCharge)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-slate-600">Grand Total</p>
              <p className="font-semibold text-lg text-blue-600">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(
                  Number(getItemsSubtotal() || 0) +
                    Number(receiptData.tax?.total_tax || 0) +
                    Number(receiptData.serviceCharge || 0)
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Item */}
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="pt-6">
          {!isAddingNewItem ? (
            <Button
              variant="ghost"
              className="w-full h-16 text-gray-600 hover:text-gray-900"
              onClick={() => setIsAddingNewItem(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Manual Item (e.g., Parking, Tip)
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Item name (e.g., Parking)"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={newItem.price || ""}
                  onChange={(e) =>
                    setNewItem((prev) => ({
                      ...prev,
                      price: Number(e.target.value),
                    }))
                  }
                />
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem((prev) => ({
                      ...prev,
                      quantity: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={addNewItem} size="sm">
                  Add Item
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAddingNewItem(false)}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Menu Items */}
      <div className="space-y-4">
        {editableItems.map((item) => {
          const assignedCount = getAssignedPeopleCount(item.id);
          const isAssigned = assignedCount > 0;
          const totalItemCost = item.price * item.quantity;
          const isEditing = editingItemId === item.id;

          return (
            <Card
              key={item.id}
              className={`${
                isAssigned
                  ? "border-green-200 bg-green-50"
                  : "border-orange-200 bg-orange-50"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="space-y-2">
                        <Input
                          value={item.name}
                          onChange={(e) =>
                            updateItem(item.id, "name", e.target.value)
                          }
                          className="font-medium"
                        />
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={item.price}
                            onChange={(e) =>
                              updateItem(item.id, "price", e.target.value)
                            }
                            placeholder="Price"
                          />
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(item.id, "quantity", e.target.value)
                            }
                            placeholder="Qty"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => setEditingItemId(null)}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingItemId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <CardTitle className="text-base flex items-center gap-2">
                          <Utensils className="w-4 h-4" />
                          {item.name}
                          {item.isManual && (
                            <Badge variant="secondary" className="text-xs">
                              Manual
                            </Badge>
                          )}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          Rp {item.price.toLocaleString("id-ID")} ×{" "}
                          {item.quantity} = Rp{" "}
                          {totalItemCost.toLocaleString("id-ID")}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!isEditing && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingItemId(item.id)}
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        {item.isManual && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteItem(item.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </>
                    )}
                    <div className="text-right">
                      <Badge
                        variant={isAssigned ? "default" : "destructive"}
                        className="flex items-center gap-1"
                      >
                        <Users className="w-3 h-3" />
                        {assignedCount}{" "}
                        {assignedCount === 1 ? "person" : "people"}
                      </Badge>
                      {assignedCount > 1 && (
                        <p className="text-xs text-gray-600 mt-1">
                          Rp{" "}
                          {Math.round(
                            totalItemCost / assignedCount
                          ).toLocaleString("id-ID")}{" "}
                          per person
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => assignToAllPeople(item.id)}
                  >
                    Assign to All
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => clearItemAssignments(item.id)}
                  >
                    Clear
                  </Button>
                </div>

                {/* Person Assignments */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {people.map((person) => {
                    const isPersonAssignedToItem = isPersonAssigned(
                      item.id,
                      person.id
                    );

                    const personCost =
                      isPersonAssignedToItem && assignedCount > 0
                        ? totalItemCost / assignedCount
                        : 0;

                    return (
                      <div
                        key={person.id}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {person.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{person.name}</p>
                            {isPersonAssignedToItem && (
                              <p className="text-xs text-gray-600">
                                Rp{" "}
                                {Math.round(personCost).toLocaleString("id-ID")}
                                {assignedCount > 1 &&
                                  ` (shared with ${assignedCount - 1} others)`}
                              </p>
                            )}
                          </div>
                        </div>
                        <Checkbox
                          checked={isPersonAssignedToItem}
                          onCheckedChange={() => {
                            togglePersonAssignment(item.id, person.id);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Live Totals */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Calculator className="w-5 h-5" />
            Live Calculation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {updatedPeople.map((person) => {
              const tax = getTaxPerPerson(person.total);
              const service = getServicePerPerson(person.total);
              const finalTotal = person.total + tax + service;

              return (
                <div key={person.id} className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600">
                        {person.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h4 className="font-medium">{person.name}</h4>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Items ({person.items.length})
                      </span>
                      <span>
                        Rp {Math.round(person.total).toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>Rp {Math.round(tax).toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service</span>
                      <span>
                        Rp {Math.round(service).toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-1">
                      <span>Total</span>
                      <span>
                        Rp {Math.round(finalTotal).toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Names
        </Button>

        <Button
          onClick={proceedToSummary}
          disabled={!isAssignmentComplete()}
          className="px-6"
        >
          Continue to Summary
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
