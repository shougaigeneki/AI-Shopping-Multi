import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white/5 p-6 rounded-2xl backdrop-blur-xl border border-white/10 hover:border-purple-500/50 transition-all flex flex-col h-full group">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-white tracking-tight">{product.name}</h3>
        <span className="px-3 py-1 bg-blue-500/10 rounded-full text-blue-400 text-sm font-semibold">
          ★ {product.rating}
        </span>
      </div>

      <div className="mb-4">
        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${
          product.judgment === '採用' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {product.judgment}
        </span>
      </div>

      <div className="space-y-4 flex-grow text-sm text-gray-400">
        <div>
          <p className="font-bold text-white mb-1 opacity-80">判定理由:</p>
          <p className="leading-relaxed">{product.reason}</p>
        </div>
        
        <div>
          <p className="font-bold text-green-400 mb-1 opacity-80">メリット:</p>
          <p>{product.pros}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-bold text-red-400 mb-1 opacity-80 border-b border-red-400/20 pb-1">致命的欠陥</p>
            <p className="text-xs pt-1">{product.fatal_flaws}</p>
          </div>
          <div>
            <p className="font-bold text-orange-400 mb-1 opacity-80 border-b border-orange-400/20 pb-1">サクラ度</p>
            <p className="text-xs pt-1">{product.fake_review_risk}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-2">
        <a
          href={product.amazon_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-3 bg-gradient-to-r from-orange-500 to-yellow-600 text-white font-bold rounded-xl hover:shadow-[0_0_15px_rgba(234,179,8,0.4)] transition-all"
        >
          Amazon
        </a>
        <div className="grid grid-cols-2 gap-2">
          {product.rakuten_url && (
            <a
              href={product.rakuten_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-2 bg-[#bf0000] text-white text-xs font-bold rounded-xl hover:opacity-80 transition-all shadow-lg"
            >
              楽天市場
            </a>
          )}
          {product.yahoo_url && (
            <a
              href={product.yahoo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-2 bg-[#ff0033] text-white text-xs font-bold rounded-xl hover:opacity-80 transition-all shadow-lg"
            >
              Yahoo!
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
