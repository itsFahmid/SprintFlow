"use client";

import React, { useRef } from "react";

export interface ReceiptData {
  transactionId: string;
  planName: string;
  amount: number;
  currency?: string;
  method: string;
  accountNumber?: string;
  date: string;
  customerName?: string;
  customerEmail?: string;
  endDateFormatted?: string;
}

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: ReceiptData | null;
}

export default function ReceiptModal({ isOpen, onClose, receipt }: ReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !receipt) return null;

  const currency = receipt.currency || "BDT";
  const formattedAmount = `${receipt.amount.toFixed(2)} ${currency}`;
  const invoiceNumber = `SF-INV-${receipt.transactionId.replace("SF-", "") || "2026-9A1"}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto print:p-0 print:bg-white print:static">
      <div 
        className="relative w-full max-w-[650px] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 print:shadow-none print:border-none print:max-w-none print:w-full print:m-0 print:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Controls (Hidden in Print) */}
        <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
            <span>📄</span>
            <span>Official Tax Invoice & Receipt</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-200/70 hover:bg-slate-300 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer text-lg font-bold"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>

        {/* --- INVOICE PRINTABLE CONTAINER --- */}
        <div ref={receiptRef} className="p-8 md:p-10 space-y-8 print:p-8 bg-white font-sans text-slate-800">
          
          {/* Header row: Brand & Invoice Meta */}
          <div className="flex items-start justify-between border-b border-slate-100 pb-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="30" width="20" height="6" rx="3" fill="#818cf8"/>
                  <rect x="15" y="46" width="25" height="6" rx="3" fill="#6366f1"/>
                  <rect x="10" y="62" width="20" height="6" rx="3" fill="#4f46e5"/>
                  <path d="M45 25C45 22.2386 47.2386 20 50 20H75C77.7614 20 80 22.2386 80 25C80 27.7614 77.7614 30 75 30H55C52.2386 30 50 32.2386 50 35V45C50 47.7614 52.2386 50 55 50H70C78.2843 50 85 56.7157 85 65C85 73.2843 78.2843 80 70 80H45C42.2386 80 40 77.7614 40 75C40 72.2386 42.2386 70 45 70H70C72.7614 70 75 67.7614 75 65C75 62.2386 72.7614 60 70 60H55C46.7157 60 40 53.2843 40 45V35C40 29.4772 42.2386 25 45 25Z" fill="url(#logoGradReceipt)" />
                  <defs>
                    <linearGradient id="logoGradReceipt" x1="40" y1="20" x2="85" y2="80" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#a78bfa"/>
                      <stop offset="0.5" stopColor="#7c3aed"/>
                      <stop offset="1" stopColor="#4f46e5"/>
                    </linearGradient>
                  </defs>
                </svg>
                <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900">SprintFlow</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">SprintFlow Technologies Ltd. · Focus Operating System</p>
              <p className="text-[10px] text-slate-400">VAT Reg: BIN-004829104-0101 · Dhaka, Bangladesh</p>
            </div>

            <div className="text-right space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-[10px] font-extrabold tracking-wider uppercase mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                PAID & ACTIVE
              </div>
              <h4 className="font-mono font-bold text-xs text-slate-800">{invoiceNumber}</h4>
              <p className="text-[11px] text-slate-400">Date: {receipt.date}</p>
            </div>
          </div>

          {/* Billing Parties Row */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            <div className="space-y-1.5">
              <span className="font-extrabold text-[10px] uppercase tracking-wider text-slate-400">Billed To</span>
              <h5 className="font-bold text-slate-900 text-sm leading-tight">
                {receipt.customerName || "Fahim Siddique"}
              </h5>
              <p className="text-slate-500">{receipt.customerEmail || "fahim@sprintflow.io"}</p>
              <p className="text-slate-500 font-medium">{receipt.method}</p>
            </div>

            <div className="space-y-1.5 text-right">
              <span className="font-extrabold text-[10px] uppercase tracking-wider text-slate-400">Payment Reference</span>
              <p className="font-mono text-slate-900 font-bold">{receipt.transactionId}</p>
              <p className="text-slate-500">Gateway: Verified Mobile Clearance</p>
              {receipt.endDateFormatted && (
                <p className="text-emerald-700 font-semibold text-[11px]">Valid until: {receipt.endDateFormatted}</p>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4">Item & Description</th>
                  <th className="py-3 px-4 text-center">Period</th>
                  <th className="py-3 px-4 text-right">Unit Price</th>
                  <th className="py-3 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900">{receipt.planName}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      Unlimited focus sprints, AI deep task breakdown & analytics
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center text-slate-600">
                    {receipt.planName.includes("3-Month") ? "3 Months" : "1 Month"}
                  </td>
                  <td className="py-4 px-4 text-right text-slate-600">{formattedAmount}</td>
                  <td className="py-4 px-4 text-right font-bold text-slate-900">{formattedAmount}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Calculations & Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">{formattedAmount}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tax / VAT (0%)</span>
                <span className="font-medium text-slate-900">0.00 {currency}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Discount</span>
                <span className="font-medium text-slate-900">−0.00 {currency}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold">
                <span className="text-slate-900">Total Paid</span>
                <span className="font-heading font-extrabold text-base text-[#7c3aed]">{formattedAmount}</span>
              </div>
            </div>
          </div>

          {/* Footer Security Stamp & Guarantee */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-[10px]">
                ✓
              </div>
              <span className="font-medium text-slate-600">Verified Electronic Payment</span>
            </div>
            <p className="text-right">SprintFlow Inc. · support@sprintflow.io</p>
          </div>

        </div>

      </div>
    </div>
  );
}
