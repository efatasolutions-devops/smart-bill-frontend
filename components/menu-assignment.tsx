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

  // State untuk Tax dan Service
  const [editableTax, setEditableTax] = useState<number>(receiptData.tax?.total_tax || 0);
  const [editableService, setEditableService] = useState<number>(receiptData.serviceCharge || 0);

  // Format number ke Rupiah string
  const formatRupiah = (num: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(num)
      .replace("Rp", "Rp ");
  };

  // Parse input string ke number
  const parseRupiah = (value: string): number => {
    const cleaned = value.replace(/[^0-9]/g, "");
    return cleaned ? parseInt(cleaned, 10) : 0;
  };

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

  // Initialize tax & service
  useEffect(() => {
    setEditableTax(receiptData.tax?.total_tax || 0);
    setEditableService(receiptData.serviceCharge || 0);
  }, [receiptData.tax?.total_tax, receiptData.serviceCharge]);

  // Recalculate totals when assignments or values change
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
  }, [assignments, editableItems, people, editableTax, editableService]);

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
              [field]: field === "price" || field === "quantity" ? Number(value) : value,
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
            assignedPeople: assignment.assignedPeople.filter((id) => id !== personId),
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
    return !!assignment?.assignedPeople.includes(personId);
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

  const getItemsSubtotal = (): number => {
    return editableItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getTaxPerPerson = (personTotal: number): number => {
    const itemsSubtotal = getItemsSubtotal();
    if (itemsSubtotal === 0) return 0;
    return (editableTax * personTotal) / itemsSubtotal;
  };

  const getServicePerPerson = (personTotal: number): number => {
    const itemsSubtotal = getItemsSubtotal();
    if (itemsSubtotal === 0) return 0;
    return (editableService * personTotal) / itemsSubtotal;
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

    const modifiedReceiptData = {
      ...receiptData,
      tax: { total_tax: editableTax },
      serviceCharge: editableService,
    };

    const payload = buildSummaryPayload(updatedPeople, modifiedReceiptData);

    try {
      const { data } = await axios(`${process.env.NEXT_PUBLIC_BASE_URL}/splitbill`, {
        method: "POST",
        data: payload,
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

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

  return (
    <div className="space-y-6 w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold">Assign Menu Items</h3>
          <p className="text-gray-600 text-sm">
            Edit items if needed and assign who shares each menu
          </p>
        </div>
        <Badge variant={isAssignmentComplete() ? "default" : "secondary"}>
          {editableItems.filter((item) => getAssignedPeopleCount(item.id) > 0).length} / {editableItems.length} Assigned
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
            <div className="max-w-xs sm:max-w-sm md:max-w-md mx-auto">
              <img
                src={receiptImage}
                alt="Receipt"
                className="w-full h-auto rounded-lg border shadow-sm"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Receipt Summary */}
      <Card className="bg-slate-50 border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 text-base">
            <Calculator className="w-5 h-5" />
            Receipt Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs sm:text-sm">
            <div className="text-center">
              <p className="text-slate-600">Items Subtotal</p>
              <p className="font-semibold">{formatRupiah(getItemsSubtotal() || 0)}</p>
            </div>

            <div className="text-center">
              <p className="text-slate-600">Tax</p>
              <Input
                type="text"
                value={formatRupiah(editableTax)}
                onChange={(e) => setEditableTax(parseRupiah(e.target.value))}
                className="w-full text-right font-semibold text-sm bg-white border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Rp 0"
              />
            </div>

            <div className="text-center">
              <p className="text-slate-600">Service</p>
              <Input
                type="text"
                value={formatRupiah(editableService)}
                onChange={(e) => setEditableService(parseRupiah(e.target.value))}
                className="w-full text-right font-semibold text-sm bg-white border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Rp 0"
              />
            </div>

            <div className="text-center">
              <p className="text-slate-600">Grand Total</p>
              <p className="font-semibold text-blue-600">
                {formatRupiah(getItemsSubtotal() + editableTax + editableService)}
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
              className="w-full h-12 text-gray-600 hover:text-gray-900 text-sm"
              onClick={() => setIsAddingNewItem(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Manual Item (e.g., Parking, Tip)
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <Input
                  placeholder="Item name (e.g., Parking)"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="text-sm"
                />
                <div className="grid grid-cols-2 gap-3">
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
                    className="text-sm"
                  />
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={newItem.quantity}
                    onChange={(e) =>
                      setNewItem((prev) => ({
                        ...prev,
                        quantity: Number(e.target.value),
                      }))
                    }
                    className="text-sm"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={addNewItem} size="sm" className="flex-1">
                  Add Item
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsAddingNewItem(false)}
                  size="sm"
                  className="flex-1"
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
                isAssigned ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <div className="space-y-2">
                        <Input
                          value={item.name}
                          onChange={(e) =>
                            updateItem(item.id, "name", e.target.value)
                          }
                          className="font-medium text-sm"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            type="number"
                            value={item.price}
                            onChange={(e) =>
                              updateItem(item.id, "price", e.target.value)
                            }
                            placeholder="Price"
                            className="text-sm"
                          />
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(item.id, "quantity", e.target.value)
                            }
                            placeholder="Qty"
                            className="text-sm"
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
                        <CardTitle className="text-sm sm:text-base flex items-center gap-2 truncate">
                          <Utensils className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{item.name}</span>
                          {item.isManual && (
                            <Badge variant="secondary" className="text-xs">
                              Manual
                            </Badge>
                          )}
                        </CardTitle>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                          Rp {item.price.toLocaleString("id-ID")} × {item.quantity} = Rp{" "}
                          {totalItemCost.toLocaleString("id-ID")}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row items-end gap-2 sm:items-center">
                    {!isEditing && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingItemId(item.id)}
                          aria-label="Edit item"
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        {item.isManual && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteItem(item.id)}
                            aria-label="Delete item"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    )}
                    <div className="text-right text-xs sm:text-sm">
                      <Badge
                        variant={isAssigned ? "default" : "destructive"}
                        className="flex items-center gap-1 px-2 py-0.5"
                      >
                        <Users className="w-3 h-3" />
                        {assignedCount}
                      </Badge>
                      {assignedCount > 1 && (
                        <p className="text-xs text-gray-600 mt-1">
                          Rp {Math.round(totalItemCost / assignedCount).toLocaleString("id-ID")} per
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => assignToAllPeople(item.id)}
                    className="text-xs"
                  >
                    Assign to All
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => clearItemAssignments(item.id)}
                    className="text-xs"
                  >
                    Clear
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {people.map((person) => {
                    const isPersonAssignedToItem = isPersonAssigned(item.id, person.id);
                    const personCost = isPersonAssignedToItem && assignedCount > 0
                      ? totalItemCost / assignedCount
                      : 0;

                    return (
                      <div
                        key={person.id}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => togglePersonAssignment(item.id, person.id)}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-medium text-blue-600">
                              {person.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm truncate">{person.name}</p>
                            {isPersonAssignedToItem && (
                              <p className="text-xs text-gray-600 truncate">
                                Rp {Math.round(personCost).toLocaleString("id-ID")}
                                {assignedCount > 1 && ` (shared with ${assignedCount - 1} others)`}
                              </p>
                            )}
                          </div>
                        </div>
                        <Checkbox
                          checked={isPersonAssignedToItem}
                          onCheckedChange={() => {
                            togglePersonAssignment(item.id, person.id);
                          }}
                          className="cursor-pointer"
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
          <CardTitle className="flex items-center gap-2 text-blue-900 text-base">
            <Calculator className="w-5 h-5" />
            Live Calculation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {updatedPeople.map((person) => {
              const tax = getTaxPerPerson(person.total);
              const service = getServicePerPerson(person.total);
              const finalTotal = person.total + tax + service;

              return (
                <div key={person.id} className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-blue-600">
                        {person.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h4 className="font-medium text-sm truncate">{person.name}</h4>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Items ({person.items.length})</span>
                      <span>{formatRupiah(person.total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>{formatRupiah(tax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service</span>
                      <span>{formatRupiah(service)}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t pt-1">
                      <span>Total</span>
                      <span>{formatRupiah(finalTotal)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="w-full sm:w-auto justify-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Names
        </Button>
        <Button
          onClick={proceedToSummary}
          disabled={!isAssignmentComplete()}
          className="w-full sm:w-auto justify-center"
        >
          Continue to Summary
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}