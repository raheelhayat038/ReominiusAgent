import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Truck, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  MessageSquare, 
  Plus, 
  ExternalLink, 
  Search, 
  RotateCcw,
  Send,
  Eye,
  Check,
  CreditCard,
  X
} from 'lucide-react';
import { ECommerceProduct, ECommerceOrder, CustomerInquiry } from '../types';
import { sound } from '../utils/audio';

interface ECommerceViewProps {
  products: ECommerceProduct[];
  orders: ECommerceOrder[];
  inquiries: CustomerInquiry[];
  onAddOrder: (order: ECommerceOrder) => void;
  onUpdateOrderStatus: (orderId: string, status: any) => void;
  onUpdateProductStock: (productId: string, newStock: number) => void;
  onResolveInquiry: (inquiryId: string) => void;
}

export const ECommerceView: React.FC<ECommerceViewProps> = ({
  products,
  orders,
  inquiries,
  onAddOrder,
  onUpdateOrderStatus,
  onUpdateProductStock,
  onResolveInquiry,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'orders' | 'support' | 'analytics'>('catalog');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [selectedProductForBuy, setSelectedProductForBuy] = useState<ECommerceProduct | null>(null);
  
  // Checkout form
  const [custName, setCustName] = useState('Alex Mercer');
  const [custEmail, setCustEmail] = useState('alex.m@engineer.io');
  const [custAddress, setCustAddress] = useState('500 Pine St, Suite 400, San Francisco, CA');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cod'>('card');
  const [checkoutSuccessNotice, setCheckoutSuccessNotice] = useState(false);

  // AI customer support reply state
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});

  const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);
  const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'processing').length;
  const lowStockCount = products.filter((p) => p.stock < 10).length;

  const handleOpenBuyModal = (prod: ECommerceProduct) => {
    sound.playClick();
    setSelectedProductForBuy(prod);
    setIsCheckoutModalOpen(true);
  };

  const handleExecuteCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductForBuy) return;
    sound.playSuccess();

    const newOrder: ECommerceOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: custName,
      email: custEmail,
      items: [
        {
          productId: selectedProductForBuy.id,
          name: selectedProductForBuy.name,
          quantity: 1,
          price: selectedProductForBuy.price,
        },
      ],
      total: selectedProductForBuy.price,
      status: 'processing',
      date: 'Just now',
      shippingAddress: custAddress,
    };

    onAddOrder(newOrder);
    onUpdateProductStock(selectedProductForBuy.id, selectedProductForBuy.stock - 1);

    setCheckoutSuccessNotice(true);
    setTimeout(() => {
      setCheckoutSuccessNotice(false);
      setIsCheckoutModalOpen(false);
    }, 2000);
  };

  const handleSendAiSupportReply = (inquiryId: string) => {
    sound.playSuccess();
    onResolveInquiry(inquiryId);
  };

  const handleRestockProduct = (productId: string) => {
    sound.playSuccess();
    onUpdateProductStock(productId, 50);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden">
      {/* Top Banner KPI Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span>Autonomous E-Commerce Company Engine</span>
          </h2>
          <p className="text-xs text-slate-400">
            End-to-end retail operations: storefront catalog, automated fulfillment, customer support & stock replenishment
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => { sound.playClick(); setActiveSubTab('catalog'); }}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeSubTab === 'catalog' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Catalog & Storefront
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveSubTab('orders'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeSubTab === 'orders' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Orders</span>
            {pendingOrders > 0 && (
              <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-1.5 rounded">
                {pendingOrders}
              </span>
            )}
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveSubTab('support'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeSubTab === 'support' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>AI Support Desk</span>
            {inquiries.filter((i) => i.status === 'open').length > 0 && (
              <span className="text-[10px] font-mono bg-indigo-500/20 text-indigo-300 px-1.5 rounded">
                {inquiries.filter((i) => i.status === 'open').length}
              </span>
            )}
          </button>
          <button
            onClick={() => { sound.playClick(); setActiveSubTab('analytics'); }}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeSubTab === 'analytics' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Financials
          </button>
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-slate-900/30 border-b border-slate-800/80 shrink-0">
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-500 font-medium">Total Gross Revenue</div>
          <div className="text-lg font-mono tabular-nums font-bold text-emerald-400 mt-0.5">
            ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-500 font-medium">Total Orders Fulfilled</div>
          <div className="text-lg font-mono tabular-nums font-bold text-slate-200 mt-0.5">
            {orders.length} orders
          </div>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-500 font-medium">Avg Order Value (AOV)</div>
          <div className="text-lg font-mono tabular-nums font-bold text-cyan-400 mt-0.5">
            ${orders.length ? (totalRevenue / orders.length).toFixed(2) : '0.00'}
          </div>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="text-[11px] text-slate-500 font-medium">Inventory Health</div>
          <div className={`text-lg font-mono tabular-nums font-bold mt-0.5 ${lowStockCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {lowStockCount > 0 ? `${lowStockCount} Item Low Stock` : 'Optimal (100%)'}
          </div>
        </div>
      </div>

      {/* Main Tab Panels */}
      <div className="flex-1 overflow-y-auto p-4 max-w-6xl mx-auto w-full space-y-6">
        {/* ================= CATALOG & STOREFRONT ================= */}
        {activeSubTab === 'catalog' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Active Storefront Catalog ({products.length} Products)
              </h3>
              <span className="text-xs text-slate-500">Click "Simulate Checkout" to test live buying pipeline</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-xs flex flex-col group transition-all"
                >
                  {/* Product Image */}
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-950">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {prod.stock < 10 && (
                      <div className="absolute top-2.5 right-2.5 bg-rose-500/90 text-white font-mono text-[10px] px-2 py-0.5 rounded-md font-semibold shadow-xs">
                        Low Stock: {prod.stock} left
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="text-[11px] text-indigo-400 font-mono uppercase tracking-wider">
                        {prod.category} · {prod.sku}
                      </div>
                      <h4 className="text-sm font-semibold text-slate-100 mt-1 leading-snug">
                        {prod.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <div className="flex items-center justify-between">
                        <div className="text-base font-bold text-slate-100 font-mono tabular-nums">
                          ${prod.price.toFixed(2)}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Stock: <span className="text-slate-300 font-semibold">{prod.stock} units</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenBuyModal(prod)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow-xs"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Simulate Checkout</span>
                        </button>
                        {prod.stock < 10 && (
                          <button
                            onClick={() => handleRestockProduct(prod.id)}
                            title="Autonomous Restock PO Trigger"
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-400 border border-slate-700 text-xs transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= ORDERS TAB ================= */}
        {activeSubTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Autonomous Fulfillment Stream ({orders.length} Total Orders)
              </h3>
            </div>

            <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl bg-slate-900/60 overflow-hidden">
              {orders.map((ord) => (
                <div key={ord.id} className="p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-semibold text-slate-200">{ord.id}</span>
                      <span className="text-slate-400 font-medium">· {ord.customerName}</span>
                      <span className="text-[11px] text-slate-500 font-mono">{ord.email}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Items: {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Ship to: {ord.shippingAddress} {ord.trackingNumber ? `· Tracking: ${ord.trackingNumber}` : ''}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-100 text-sm tabular-nums">
                        ${ord.total.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{ord.date}</div>
                    </div>

                    {/* Status Changer */}
                    <div className="flex items-center gap-2">
                      <select
                        value={ord.status}
                        onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value)}
                        className={`text-xs font-mono font-semibold rounded-lg px-2.5 py-1.5 border focus:outline-hidden cursor-pointer ${
                          ord.status === 'delivered'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : ord.status === 'shipped'
                            ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= AI SUPPORT DESK TAB ================= */}
        {activeSubTab === 'support' && (
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Autonomous Customer Support Inquiries
            </h3>

            <div className="space-y-3">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className={`p-4 rounded-xl border bg-slate-900 transition-all space-y-3 ${
                    inq.status === 'resolved' ? 'border-slate-800/60 opacity-60' : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-200 text-xs">{inq.customerName}</span>
                        {inq.orderId && (
                          <span className="text-[10px] text-indigo-400 font-mono bg-indigo-500/10 px-1.5 py-0.5 rounded">
                            {inq.orderId}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500">· {inq.timestamp}</span>
                      </div>
                      <div className="text-xs text-slate-300 font-medium mt-0.5">{inq.subject}</div>
                    </div>

                    <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded ${
                      inq.status === 'resolved' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                    }`}>
                      {inq.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    "{inq.message}"
                  </p>

                  {inq.status === 'open' && inq.aiSuggestedReply && (
                    <div className="p-3 bg-slate-950 border border-indigo-500/30 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-medium text-indigo-300">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                          <span>AI Agent Drafted Resolution</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-sans leading-relaxed">
                        {inq.aiSuggestedReply}
                      </p>
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => handleSendAiSupportReply(inq.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow-xs"
                        >
                          <Send className="w-3 h-3" />
                          <span>Approve & Dispatch to Customer</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= ANALYTICS & REVENUE TAB ================= */}
        {activeSubTab === 'analytics' && (
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Financial Breakdown & Profitability
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <div className="text-xs text-slate-400">Total Hardware Cost of Goods (COGS)</div>
                <div className="text-xl font-bold font-mono text-slate-100 tabular-nums">
                  ${(totalRevenue * 0.38).toFixed(2)}
                </div>
                <div className="text-[11px] text-slate-500">Average hardware margin: 62%</div>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <div className="text-xs text-slate-400">Estimated Net Profit</div>
                <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                  ${(totalRevenue * 0.62).toFixed(2)}
                </div>
                <div className="text-[11px] text-slate-500">After payment processing fees</div>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <div className="text-xs text-slate-400">Monthly Run-Rate</div>
                <div className="text-xl font-bold font-mono text-cyan-400 tabular-nums">
                  ${(totalRevenue * 4.2).toFixed(2)}
                </div>
                <div className="text-[11px] text-slate-500">Projected Q4 trajectory</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Simulation Modal */}
      {isCheckoutModalOpen && selectedProductForBuy && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-400" />
                <span>Simulate Storefront Customer Checkout</span>
              </h3>
              <button onClick={() => setIsCheckoutModalOpen(false)} className="text-slate-500 hover:text-slate-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            {checkoutSuccessNotice ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-semibold text-slate-100">Order Confirmed & Placed!</h4>
                <p className="text-xs text-slate-400">
                  Fulfillment workflow initiated. Inventory deducted and recorded in Supabase database.
                </p>
              </div>
            ) : (
              <form onSubmit={handleExecuteCheckout} className="space-y-3.5">
                {/* Item summary */}
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-3">
                  <img
                    src={selectedProductForBuy.image}
                    alt={selectedProductForBuy.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-slate-200">{selectedProductForBuy.name}</div>
                    <div className="text-xs font-mono text-emerald-400 font-bold">${selectedProductForBuy.price.toFixed(2)}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Customer Name</label>
                    <input
                      type="text"
                      required
                      value={custName}
                      onChange={(e) => setCustName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={custEmail}
                      onChange={(e) => setCustEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Shipping Address</label>
                  <input
                    type="text"
                    required
                    value={custAddress}
                    onChange={(e) => setCustAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Payment Method</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-2 rounded-lg border text-left font-medium transition-colors flex items-center gap-2 ${
                        paymentMethod === 'card' ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Credit Card / Stripe</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-2 rounded-lg border text-left font-medium transition-colors flex items-center gap-2 ${
                        paymentMethod === 'cod' ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Cash On Delivery</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCheckoutModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-medium text-slate-300 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-medium text-white shadow-xs"
                  >
                    Confirm & Complete Checkout
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
