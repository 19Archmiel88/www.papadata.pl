import React from 'react';
import { MoreHorizontal, ArrowUpRight } from 'lucide-react';
import { ProductData } from '../types';

interface Props {
  products: ProductData[];
  title: string;
  subtitle: string;
}

const currencyFormatter = new Intl.NumberFormat('pl-PL');

const SalesTable: React.FC<Props> = ({ products, title, subtitle }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
        <button className="text-indigo-600 hover:text-indigo-500 text-sm font-medium flex items-center gap-1">
          View All <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-6 py-4 font-semibold">Product Name</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold text-right">Sales</th>
              <th className="px-6 py-4 font-semibold text-right">Revenue</th>
              <th className="px-6 py-4 font-semibold text-center">Status</th>
              <th className="px-6 py-4 font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900 dark:text-white">{product.name}</div>
                  <div className="text-xs text-slate-500">ID: {product.id}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm text-slate-600 dark:text-slate-300">
                  {product.sales.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right font-medium text-slate-900 dark:text-white">
                  {currencyFormatter.format(product.revenue)} zł
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                      product.status === 'In Stock'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                        : product.status === 'Low Stock'
                          ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                          : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesTable;
