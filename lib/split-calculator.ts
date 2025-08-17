import type { MenuItem, Person, ReceiptData } from "@/app/(app)/splitbill/page";

export interface SplitCalculation {
  subtotal: number;
  tax: number;
  total: number;
  perPersonBreakdown: PersonBreakdown[];
}

export interface PersonBreakdown {
  person: Person;
  subtotal: number;
  taxAmount: number;
  total: number;
  items: MenuItem[];
}

export class SplitCalculator {
  private receiptData: ReceiptData;
  private people: Person[];

  constructor(receiptData: ReceiptData, people: Person[]) {
    this.receiptData = receiptData;
    this.people = people;
  }

  /**
   * Calculate the complete split breakdown
   */
  calculateSplit(): SplitCalculation {
    const perPersonBreakdown = this.people.map((person) =>
      this.calculatePersonBreakdown(person)
    );

    const subtotal = perPersonBreakdown.reduce(
      (sum, breakdown) => sum + breakdown.subtotal,
      0
    );
    const tax = perPersonBreakdown.reduce(
      (sum, breakdown) => sum + breakdown.taxAmount,
      0
    );
    const total = subtotal + tax;

    return {
      subtotal,
      tax,
      total,
      perPersonBreakdown,
    };
  }

  /**
   * Calculate breakdown for a specific person
   */
  private calculatePersonBreakdown(person: Person): PersonBreakdown {
    const subtotal = person.total;
    const taxAmount = this.calculateTaxForPerson(subtotal);
    const total = subtotal + taxAmount;

    return {
      person,
      subtotal,
      taxAmount,
      total,
      items: person.items,
    };
  }

  /**
   * Calculate proportional tax for a person based on their subtotal
   */
  private calculateTaxForPerson(personSubtotal: number): number {
    const totalSubtotal = this.people.reduce(
      (sum, person) => sum + person.total,
      0
    );

    if (totalSubtotal === 0) return 0;

    return (this.receiptData.tax?.total_tax * personSubtotal) / totalSubtotal;
  }

  /**
   * Validate that all items are properly assigned
   */
  validateAssignments(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check if all items are fully assigned
    for (const item of this.receiptData.items) {
      const totalAssigned = this.people.reduce((sum, person) => {
        const assignedItem = person.items.find((pItem) => pItem.id === item.id);
        return sum + (assignedItem?.quantity || 0);
      }, 0);

      if (totalAssigned !== item.quantity) {
        errors.push(`${item.name}: ${totalAssigned}/${item.quantity} assigned`);
      }
    }

    // Check if totals match
    const calculatedSubtotal = this.people.reduce(
      (sum, person) => sum + person.total,
      0
    );
    const expectedSubtotal = this.receiptData.subtotal;

    if (Math.abs(calculatedSubtotal - expectedSubtotal) > 0.01) {
      errors.push(
        `Subtotal mismatch: calculated ${calculatedSubtotal}, expected ${expectedSubtotal}`
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get summary statistics
   */
  getSummaryStats() {
    const split = this.calculateSplit();

    return {
      totalPeople: this.people.length,
      totalItems: this.receiptData.items.length,
      averagePerPerson: split.total / this.people.length,
      highestBill: Math.max(...split.perPersonBreakdown.map((p) => p.total)),
      lowestBill: Math.min(...split.perPersonBreakdown.map((p) => p.total)),
    };
  }

  /**
   * Generate payment instructions
   */
  generatePaymentInstructions(): string[] {
    const split = this.calculateSplit();

    return split.perPersonBreakdown.map((breakdown) => {
      const itemsList = breakdown.items
        .map((item) => `${item.name} (${item.quantity}x)`)
        .join(", ");

      return `${breakdown.person.name}: Rp ${Math.round(
        breakdown.total
      ).toLocaleString("id-ID")} - ${itemsList}`;
    });
  }

  /**
   * Export data for sharing
   */
  exportSplitData() {
    const split = this.calculateSplit();
    const stats = this.getSummaryStats();

    return {
      restaurant: this.receiptData.restaurant,
      date: new Date().toISOString(),
      summary: {
        totalBill: split.total,
        totalPeople: stats.totalPeople,
        averagePerPerson: stats.averagePerPerson,
      },
      breakdown: split.perPersonBreakdown.map((p) => ({
        name: p.person.name,
        items: p.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: p.subtotal,
        tax: p.taxAmount,
        total: p.total,
      })),
      paymentInstructions: this.generatePaymentInstructions(),
    };
  }
}

/**
 * Utility functions for common calculations
 */
export const SplitUtils = {
  /**
   * Format currency for Indonesian Rupiah
   */
  formatCurrency: (amount: number): string => {
    return `Rp ${Math.round(amount).toLocaleString("id-ID")}`;
  },

  /**
   * Calculate percentage of total
   */
  calculatePercentage: (amount: number, total: number): number => {
    return total === 0 ? 0 : (amount / total) * 100;
  },

  /**
   * Round to nearest currency unit
   */
  roundCurrency: (amount: number): number => {
    return Math.round(amount);
  },

  /**
   * Split amount equally among people
   */
  splitEqually: (amount: number, peopleCount: number): number[] => {
    const baseAmount = Math.floor(amount / peopleCount);
    const remainder = amount % peopleCount;

    return Array.from(
      { length: peopleCount },
      (_, index) => baseAmount + (index < remainder ? 1 : 0)
    );
  },

  /**
   * Validate receipt data
   */
  validateReceiptData: (
    receiptData: ReceiptData
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!receiptData.restaurant?.trim()) {
      errors.push("Restaurant name is required");
    }

    if (!receiptData.items || receiptData.items.length === 0) {
      errors.push("At least one item is required");
    }

    if (receiptData.subtotal <= 0) {
      errors.push("Subtotal must be greater than 0");
    }

    if (receiptData.tax?.total_tax < 0) {
      errors.push("Tax cannot be negative");
    }

    if (
      receiptData.total !==
      receiptData.subtotal + receiptData.tax?.total_tax
    ) {
      errors.push("Total must equal subtotal + tax");
    }

    // Validate individual items
    receiptData.items?.forEach((item, index) => {
      if (!item.name?.trim()) {
        errors.push(`Item ${index + 1}: Name is required`);
      }
      if (item.price <= 0) {
        errors.push(`Item ${index + 1}: Price must be greater than 0`);
      }
      if (item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};
