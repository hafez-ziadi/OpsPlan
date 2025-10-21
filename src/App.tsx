import React, { useState, useMemo } from 'react';

type ProductCategory = 'muffins' | 'bundles' | 'individual' | '6month' | '9month' | 'adult' | 'vegetables';

interface BaseProduct {
  id: number;
  name: string;
  category: ProductCategory;
  packSize?: number;
  isBundle: boolean;
  bundleContents?: number[];
  unitsPerItem?: number;
}

type EditableField = 'ourStock' | 'sending' | 'making' | 'thplStock' | 'estimatedSales';

interface ProductWeek extends BaseProduct {
  packSending?: number;
  ourStock?: number;
  sending?: number;
  making?: number;
  thplStock?: number;
  estimatedSales?: number;
  // Derived/aux fields (optional)
  ourFinalStock?: number;
  thplFinalStock?: number;
  totalSent?: number;
  received?: number;
  bundleDemand?: number;
  estSalesRaw?: number;
  bundleDeduction?: number;
  totalThplSending?: number;
  daysCover?: number | 999;
  status?: 'critical' | 'caution' | 'good' | string;
}

interface Groups {
  muffins: { title: string; products: ProductWeek[] };
  bundles: { title: string; products: ProductWeek[] };
  individual: { title: string; products: ProductWeek[] };
  '6month': { title: string; products: ProductWeek[] };
  '9month': { title: string; products: ProductWeek[] };
  adult: { title: string; products: ProductWeek[] };
  vegetables: { title: string; products: ProductWeek[] };
}

import { Package, ChevronLeft, ChevronRight, Warehouse, Truck } from 'lucide-react';

export default function UnifiedOperationsPlanner(): JSX.Element {
  const [currentWeek, setCurrentWeek] = useState<number>(0);
  
  const initialProducts: BaseProduct[] = [
    { id: 1, name: "Blueberry & Banana Muffins (x8)", category: "muffins", packSize: 8, isBundle: false },
    { id: 2, name: "Carrot 'Cake' Fingers (x8)", category: "muffins", packSize: 8, isBundle: false },
    { id: 3, name: "Cheesy Leek Muffins (x8)", category: "muffins", packSize: 8, isBundle: false },
    { id: 4, name: "Sweet Potato & Carrot Muffins (x8)", category: "muffins", packSize: 8, isBundle: false },
    { id: 5, name: "Squash & Cheddar Frittata (x8)", category: "muffins", packSize: 8, isBundle: false },
    { id: 6, name: "Cheddar & Red Pepper Muffins (x8)", category: "muffins", packSize: 8, isBundle: false },
    { id: 7, name: "Squash & Rice Tots (x8)", category: "muffins", packSize: 8, isBundle: false },
    
    { id: 8, name: "Classic Dishes: Baby Purées (6 Months+)", category: "bundles", isBundle: true, bundleContents: [26, 27, 17, 46], unitsPerItem: 2 },
    { id: 9, name: "Classic Dishes: Baby Purées (9 Months+)", category: "bundles", isBundle: true, bundleContents: [31, 32, 17, 46], unitsPerItem: 2 },
    { id: 10, name: "World Flavours: Baby Purèes 6 Months+", category: "bundles", isBundle: true, bundleContents: [28, 29, 43, 44], unitsPerItem: 2 },
    { id: 11, name: "World Flavours: Baby Purèes 9 Months+", category: "bundles", isBundle: true, bundleContents: [33, 34, 35, 45], unitsPerItem: 2 },
    { id: 12, name: "Stage 1 Weaning: Single Vegetable Purèes (x8)", category: "bundles", isBundle: true, bundleContents: [49, 50, 51, 52, 53, 54, 55, 56], unitsPerItem: 1 },
    
    { id: 13, name: "5 Vegetable Pasta Sauce (x6)", category: "individual", packSize: 6, isBundle: false },
    { id: 14, name: "Cheesy Sauce with Hidden Veg (x6)", category: "individual", packSize: 6, isBundle: false },
    { id: 15, name: "Beef Bolognese Sauce (x6)", category: "individual", packSize: 6, isBundle: false },
    { id: 16, name: "Pork Ragu Sauce (x6)", category: "individual", packSize: 6, isBundle: false },
    { id: 17, name: "Classic Fish Pie 6 Months+ (x6)", category: "individual", packSize: 6, isBundle: false },
    { id: 18, name: "Shepherd's Pie 6 Months+ (x6)", category: "individual", packSize: 6, isBundle: false },
    { id: 19, name: "Raspberry Rice Pudding (x6)", category: "individual", packSize: 6, isBundle: false },
    { id: 20, name: "Spiced Apple Rice Pudding (x6)", category: "individual", packSize: 6, isBundle: false },
    { id: 21, name: "Coconut, Sweet Potato & Tofu Curry (x6)", category: "individual", packSize: 6, isBundle: false },
    
    { id: 26, name: "Green Orzo 6 Months+ (x6)", category: "6month", packSize: 6, isBundle: false },
    { id: 27, name: "Moussaka (v) 6 Months+ (x6)", category: "6month", packSize: 6, isBundle: false },
    { id: 28, name: "Sweet Potato Tagine 6 Months+ (x6)", category: "6month", packSize: 6, isBundle: false },
    { id: 29, name: "Spinach & Coconut Curry 6 Months+ (x6)", category: "6month", packSize: 6, isBundle: false },
    
    { id: 31, name: "Green Orzo 9 Months+ (x6)", category: "9month", packSize: 6, isBundle: false },
    { id: 32, name: "Moussaka (v) 9 Months+ (x6)", category: "9month", packSize: 6, isBundle: false },
    { id: 33, name: "Butternut Squash Dal (x6) 9 Months+", category: "9month", packSize: 6, isBundle: false },
    { id: 34, name: "Spinach & Coconut Curry 9 Months+ (x6)", category: "9month", packSize: 6, isBundle: false },
    { id: 35, name: "Sweet Potato Tagine 9 Months+ (x6)", category: "9month", packSize: 6, isBundle: false },
    
    { id: 37, name: "Squash Macaroni Cheese", category: "adult", packSize: 1, isBundle: false },
    { id: 38, name: "Creamy Chicken Pie", category: "adult", packSize: 1, isBundle: false },
    { id: 39, name: "Mild Veggie & Coconut Curry", category: "adult", packSize: 1, isBundle: false },
    { id: 40, name: "Mexican Sweet Potato & Bean Chilli", category: "adult", packSize: 1, isBundle: false },
    { id: 41, name: "Lara's Cottage Pie", category: "adult", packSize: 1, isBundle: false },
    
    { id: 43, name: "Butternut Squash Dal (x6) 6 Months+", category: "6month", packSize: 6, isBundle: false },
    { id: 44, name: "Mexican Bean Chilli 6 Month", category: "6month", packSize: 6, isBundle: false },
    { id: 45, name: "Mexican Bean Chilli 9 Month", category: "9month", packSize: 6, isBundle: false },
    { id: 46, name: "Cottage Pie Puree", category: "individual", packSize: 6, isBundle: false },
    
    { id: 49, name: "Carrot", category: "vegetables", packSize: 1, isBundle: false },
    { id: 50, name: "Squash", category: "vegetables", packSize: 1, isBundle: false },
    { id: 51, name: "Peas", category: "vegetables", packSize: 1, isBundle: false },
    { id: 52, name: "Spinach", category: "vegetables", packSize: 1, isBundle: false },
    { id: 53, name: "Cauliflower", category: "vegetables", packSize: 1, isBundle: false },
    { id: 54, name: "Courgette", category: "vegetables", packSize: 1, isBundle: false },
    { id: 55, name: "Broccoli", category: "vegetables", packSize: 1, isBundle: false },
    { id: 56, name: "Leek", category: "vegetables", packSize: 1, isBundle: false }
  ];

  const [weeksData, setWeeksData] = useState<{ weekLabel: string; products: ProductWeek[] }[]>([
    {
      weekLabel: "WC 20/10",
      products: initialProducts.map(p => ({ ...p, ourStock: 0, sending: 0, making: 0, thplStock: 0, estimatedSales: 0 }))
    }
  ]);

  const currentWeekData = weeksData[currentWeek];

  const enrichedProducts: ProductWeek[] = useMemo(() => {
    return currentWeekData.products.map(product => {
      const ourStock = product.ourStock || 0;
      const making = product.making || 0;
      const sending = product.sending || 0;
      const thplStock = product.thplStock || 0;
      const estimatedSales = product.estimatedSales || 0;
      
      // Calculate days cover at 3PL
      const dailySales = estimatedSales / 7;
      const daysCover = dailySales > 0 ? thplStock / dailySales : 999;
      
      // Status based on days cover
      let status = 'good';
      if (daysCover < 10) status = 'critical';
      else if (daysCover <= 21) status = 'caution';
      
      let bundleDeduction = 0;
      currentWeekData.products.forEach(p => {
        if (p.isBundle && p.bundleContents?.includes(product.id)) {
          bundleDeduction += (p.estimatedSales || 0) * (p.unitsPerItem ?? 1);
        }
      });
      
      const packSending = product.isBundle ? sending : (sending * (product.packSize || 1));
      const ourFinalStock = ourStock - packSending + making;
      
      const estSalesRaw = product.isBundle ? estimatedSales : (estimatedSales * (product.packSize || 1));
      const totalThplSending = estSalesRaw + bundleDeduction;
      const thplFinalStock = thplStock + packSending - totalThplSending;
      
      return {
        ...product,
        packSending,
        ourFinalStock,
        bundleDeduction,
        estSalesRaw,
        totalThplSending,
        thplFinalStock,
        daysCover: Math.round(daysCover * 10) / 10,
        status
      };
    });
  }, [currentWeekData]);

  const stats = useMemo(() => {
    const critical = enrichedProducts.filter(p => p.status === 'critical');
    const caution = enrichedProducts.filter(p => p.status === 'caution');
    const good = enrichedProducts.filter(p => p.status === 'good');
    return { critical, caution, good };
  }, [enrichedProducts]);

  const groupedProducts = useMemo((): Groups => {
    const groups: Groups = {
      muffins: { title: "Muffins & Snacks (x8)", products: [] },
      bundles: { title: "Bundles", products: [] },
      individual: { title: "Individual Recipes (x6)", products: [] },
      "6month": { title: "6 Month Recipes (x6)", products: [] },
      "9month": { title: "9 Month Recipes (x6)", products: [] },
      adult: { title: "Adult Meals", products: [] },
      vegetables: { title: "Vegetables (First Taste)", products: [] }
    };

    enrichedProducts.forEach(product => {
      if (groups[product.category]) {
        groups[product.category].products.push(product);
      }
    });

    return groups;
  }, [enrichedProducts]);

  const updateProduct = (id: number, field: EditableField, value: number | string): void => {
    setWeeksData(prev => {
      const newWeeks = [...prev];
      newWeeks[currentWeek] = {
        ...newWeeks[currentWeek],
        products: newWeeks[currentWeek].products.map(p => 
          p.id === id ? { ...p, [field]: typeof value === 'number' ? value : (value === '' ? 0 : (parseFloat(String(value)) || 0)) } : p
        )
      };
      return newWeeks;
    });
  };

  const addNextWeek = () => {
    const newProducts = enrichedProducts.map(p => ({
      ...p,
      ourStock: p.ourFinalStock,
      thplStock: p.thplFinalStock,
      sending: 0,
      making: 0,
      estimatedSales: 0
    }));

    setWeeksData(prev => [...prev, {
      weekLabel: `Week ${prev.length + 1}`,
      products: newProducts
    }]);
    setCurrentWeek(weeksData.length);
  };

  const updateWeekLabel = (newLabel: string): void => {
    setWeeksData(prev => {
      const newWeeks = [...prev];
      newWeeks[currentWeek] = { ...newWeeks[currentWeek], weekLabel: newLabel };
      return newWeeks;
    });
  };

  const getStatusColor = (status?: string): string => {
    if (status === 'critical') return 'bg-red-100 text-red-800';
    if (status === 'caution') return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getRowHighlight = (status?: string): string => {
    if (status === 'critical') return 'bg-red-50';
    if (status === 'caution') return 'bg-yellow-50';
    return '';
  };

  interface ProductRowProps { product: ProductWeek; onUpdate: (id: number, field: EditableField, value: number | string) => void }
  const ProductRow = React.memo(({ product, onUpdate }: ProductRowProps) => {
    return (
      <tr className={`hover:bg-slate-100 ${getRowHighlight(product.status ?? 'good')}`}>
        <td className="px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-900 text-sm">{product.name}</span>
            {product.isBundle && (
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">Bundle</span>
            )}
          </div>
        </td>
        <td className="px-3 py-2 text-center bg-blue-50">
          <input
            type="number"
            key={`our-${product.id}-${product.ourStock}`}
            defaultValue={product.ourStock}
            onBlur={(e) => onUpdate(product.id, 'ourStock', e.target.value)}
            className="w-16 px-1 py-1 text-center text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </td>
        <td className="px-3 py-2 text-center bg-blue-50">
          <input
            type="number"
            key={`make-${product.id}-${product.making}`}
            defaultValue={product.making}
            onBlur={(e) => onUpdate(product.id, 'making', e.target.value)}
            className="w-16 px-1 py-1 text-center text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </td>
        <td className="px-3 py-2 text-center bg-blue-50">
          <input
            type="number"
            key={`send-${product.id}-${product.sending}`}
            defaultValue={product.sending}
            onBlur={(e) => onUpdate(product.id, 'sending', e.target.value)}
            className="w-16 px-1 py-1 text-center text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </td>
        <td className="px-3 py-2 text-center bg-blue-50">
          <span className="text-slate-600 font-medium text-sm">
            {product.isBundle ? '-' : (product.packSending ?? 0)}
          </span>
        </td>
        <td className="px-3 py-2 text-center bg-blue-50">
          <span className={`font-bold text-sm ${(product.ourFinalStock ?? 0) < 0 ? 'text-red-600' : 'text-slate-900'}`}>
            {product.ourFinalStock}
          </span>
        </td>
        <td className="px-3 py-2 text-center bg-green-50">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(product.status ?? 'good')}`}>
            {product.daysCover === 999 ? '∞' : product.daysCover}
          </span>
        </td>
        <td className="px-3 py-2 text-center bg-green-50">
          <input
            type="number"
            key={`3pl-${product.id}-${product.thplStock}`}
            defaultValue={product.thplStock}
            onBlur={(e) => onUpdate(product.id, 'thplStock', e.target.value)}
            className="w-16 px-1 py-1 text-center text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </td>
        <td className="px-3 py-2 text-center bg-green-50">
          <input
            type="number"
            key={`est-${product.id}-${product.estimatedSales}`}
            defaultValue={product.estimatedSales}
            onBlur={(e) => onUpdate(product.id, 'estimatedSales', e.target.value)}
            className="w-16 px-1 py-1 text-center text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </td>
        <td className="px-3 py-2 text-center bg-green-50">
          <span className="text-slate-600 font-medium text-sm">
            {product.isBundle ? product.estimatedSales : product.estSalesRaw}
          </span>
        </td>
        <td className="px-3 py-2 text-center bg-green-50">
          <span className="text-slate-600 font-medium text-sm">
            {(product.bundleDeduction ?? 0) > 0 ? `-${product.bundleDeduction}` : '-'}
          </span>
        </td>
        <td className="px-3 py-2 text-center bg-green-50">
          <span className="font-semibold text-sm text-slate-900">{product.totalThplSending}</span>
        </td>
        <td className="px-3 py-2 text-center bg-green-50">
          <span className={`font-bold text-sm ${(product.thplFinalStock ?? 0) < 0 ? 'text-red-600' : 'text-slate-900'}`}>
            {product.thplFinalStock}
          </span>
        </td>
      </tr>
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-full mx-auto">
        <header className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <Package className="w-8 h-8 text-indigo-600" />
                Operations Planner - Two Location Tracking
              </h1>
              <p className="text-slate-600 mt-2">Your warehouse → 3PL provider</p>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
                disabled={currentWeek === 0}
                className="p-2 rounded-lg bg-slate-200 hover:bg-slate-300 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="text-center">
                <input
                  type="text"
                  value={currentWeekData.weekLabel}
                  onChange={(e) => updateWeekLabel(e.target.value)}
                  className="text-xl font-bold text-indigo-600 text-center border-b-2 border-indigo-300 focus:outline-none focus:border-indigo-600 bg-transparent px-2"
                />
                <p className="text-sm text-slate-600 mt-1">Week {currentWeek + 1} of {weeksData.length}</p>
              </div>
              
              <button
                onClick={() => setCurrentWeek(Math.min(weeksData.length - 1, currentWeek + 1))}
                disabled={currentWeek === weeksData.length - 1}
                className="p-2 rounded-lg bg-slate-200 hover:bg-slate-300 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              
              {currentWeek === weeksData.length - 1 && (
                <button
                  onClick={addNextWeek}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
                >
                  + Add Next Week
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Critical Alerts */}
        {(stats.critical.length > 0 || stats.caution.length > 0) && (
          <div className="space-y-3 mb-6">
            {stats.critical.length > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-red-900 mb-2">
                      Critical Stock Alert ({stats.critical.length} items below 10 days cover)
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {stats.critical.map(p => (
                        <span key={p.id} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                          {p.name}: {p.daysCover === 999 ? '∞' : p.daysCover} days
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {stats.caution.length > 0 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-yellow-900 mb-2">
                      Low Stock Warning ({stats.caution.length} items 10-21 days cover)
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {stats.caution.map(p => (
                        <span key={p.id} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                          {p.name}: {p.daysCover === 999 ? '∞' : p.daysCover} days
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="space-y-6">
          {Object.entries(groupedProducts).map(([category, group]) => (
            group.products.length > 0 && (
              <div key={category} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-indigo-600 px-6 py-3">
                  <h2 className="text-lg font-bold text-white">{group.title}</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-100">
                      <tr>
                        <th rowSpan={2} className="px-3 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Product</th>
                        <th colSpan={5} className="px-3 py-2 text-center text-xs font-semibold text-blue-900 uppercase bg-blue-100 border-l-2 border-blue-300">
                          <div className="flex items-center justify-center gap-2">
                            <Warehouse className="w-4 h-4" />Your Warehouse
                          </div>
                        </th>
                        <th colSpan={7} className="px-3 py-2 text-center text-xs font-semibold text-green-900 uppercase bg-green-100 border-l-2 border-green-300">
                          <div className="flex items-center justify-center gap-2">
                            <Truck className="w-4 h-4" />3PL Provider
                          </div>
                        </th>
                      </tr>
                      <tr>
                        <th className="px-3 py-2 text-center text-xs font-semibold text-slate-700 uppercase bg-blue-50 border-l-2 border-blue-300">Stock</th>
                        <th className="px-3 py-2 text-center text-xs font-semibold text-slate-700 uppercase bg-blue-50">Making</th>
                        <th className="px-3 py-2 text-center text-xs font-semibold text-slate-700 uppercase bg-blue-50">Send</th>
                        <th className="px-3 py-2 text-center text-xs font-semibold text-slate-700 uppercase bg-blue-50">Raw</th>
                        <th className="px-3 py-2 text-center text-xs font-semibold text-slate-700 uppercase bg-blue-50">Final</th>
                        <th className="px-3 py-2 text-center text-xs font-semibold text-slate-700 uppercase bg-green-50 border-l-2 border-green-300">Stock</th>
                        <th className="px-3 py-2 text-center text-xs font-semibold text-slate-700 uppercase bg-green-50">Days Cover</th>
                        <th className="px-3 py-2 text-center text-xs font-semibold text-slate-700 uppercase bg-green-50">Est Sales</th>
                        <th className="px-3 py-2 text-center text-xs font-semibold text-slate-700 uppercase bg-green-50">Raw</th>
                        <th className="px-3 py-2 text-center text-xs font-semibold text-slate-700 uppercase bg-green-50">Bundle</th>
                        <th className="px-3 py-2 text-center text-xs font-semibold text-slate-700 uppercase bg-green-50">Total</th>
                        <th className="px-3 py-2 text-center text-xs font-semibold text-slate-700 uppercase bg-green-50">Final</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {group.products.map((product: ProductWeek) => (
                        <ProductRow key={product.id} product={product} onUpdate={updateProduct} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          ))}
        </div>

        <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <h3 className="font-semibold text-indigo-900 mb-2">How it works:</h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-indigo-800">
            <div>
              <h4 className="font-semibold mb-1">Your Warehouse (Blue):</h4>
              <ul className="space-y-1">
                <li><strong>Send</strong> = Packs you send to 3PL (automatically received by them)</li>
                <li><strong>Final</strong> = Stock - Raw Sent + Making</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-1">3PL Provider (Green):</h4>
              <ul className="space-y-1">
                <li><strong>Est Sales</strong> = Expected packs sold</li>
                <li><strong>Bundle</strong> = Auto deduction from bundle sales</li>
                <li><strong>Final</strong> = Stock + Received - Total Sent</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}