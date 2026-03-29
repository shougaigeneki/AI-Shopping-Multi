import React, { useState } from 'react';
import { callGeminiResearch } from './services/gemini';
import ProductCard from './components/ProductCard';

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [theme, setTheme] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState('');
  const [showSettings, setShowSettings] = useState(!apiKey);

  const handleResearch = async (e) => {
    e.preventDefault();
    if (!apiKey) {
      setError('APIキーを設定してください。');
      setShowSettings(true);
      return;
    }
    if (!theme) {
      setError('テーマを入力してください。');
      return;
    }

    setLoading(true);
    setError(null);
    setProducts([]);
    setProgress('3大モールを調査中...');

    try {
      const results = await callGeminiResearch(apiKey, theme, setProgress);
      setProducts(results);
      setProgress('完了しました！');
    } catch (err) {
      setError(err.message);
      setProgress('エラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  const saveApiKey = (e) => {
    e.preventDefault();
    localStorage.setItem('gemini_api_key', apiKey);
    setShowSettings(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#050510] text-gray-100 font-sans p-4 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <div className="inline-block px-4 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm font-bold border border-purple-500/20 mb-6 tracking-widest uppercase">
            3モール横断リサーチ版
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            購物図鑑
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Amazon・楽天・Yahooから「一生モノ」の逸品を一括調査します。
          </p>
        </header>

        <section className="max-w-3xl mx-auto mb-16">
          <div className="bg-white/5 p-1 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl">
            <form onSubmit={handleResearch} className="flex flex-col md:flex-row gap-2">
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="例: 一生モノのコーヒーメーカー"
                className="flex-grow bg-transparent border-none px-6 py-4 text-lg outline-none placeholder:text-gray-600"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all disabled:opacity-50"
              >
                {loading ? '分析中...' : 'リサーチ開始'}
              </button>
            </form>
          </div>
          <div className="mt-4 flex justify-between items-center text-sm px-2">
            <button onClick={() => setShowSettings(true)} className="text-gray-500 hover:text-purple-400">設定</button>
            <div className="text-purple-400">{progress}</div>
          </div>
        </section>

        {showSettings && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-[#111] p-8 rounded-3xl border border-white/10 max-w-md w-full relative">
              <button onClick={() => setShowSettings(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
              <h2 className="text-2xl font-bold mb-6">APIキー設定</h2>
              <form onSubmit={saveApiKey}>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Gemini API Key"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-6 focus:ring-2 focus:ring-purple-500 outline-none"
                />
                <button type="submit" className="w-full py-4 bg-white text-black font-black rounded-xl hover:bg-gray-200 uppercase tracking-widest text-xs">保存する</button>
              </form>
            </div>
          </div>
        )}

        {error && <div className="max-w-3xl mx-auto mb-12 p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => <ProductCard key={index} product={product} />)}
        </div>
      </div>
    </div>
  );
}

export default App;
