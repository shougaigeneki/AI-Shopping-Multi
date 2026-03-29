// src/multi_mall_version/services/gemini.js

export async function callGeminiResearch(apiKey, theme, onProgress) {
    // 判明した正解モデル名「gemini-3-flash-preview」を使用し、3モールを同時にリサーチします。
    const model = 'gemini-3-flash-preview';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=` + apiKey;

    const prompt = `あなたは「物を買わない主義」の買い物図鑑の編集長です。
テーマ「${theme}」に合致する、Amazon.co.jpでの評価が極めて高く、かつ楽天市場やYahoo!ショッピングでも扱われている「一生モノ」の商品を 5〜10件 選定してください。

以下の情報をJSON形式で出力してください。Amazon、楽天、Yahooの検索結果URLをそれぞれ生成してください。

JSON構造：
{
  "products": [
    {
      "name": "商品名",
      "rating": "数",
      "judgment": "採用 または 不採用",
      "reason": "理由",
      "pros": "メリット",
      "fatal_flaws": "欠点",
      "long_term_concerns": "懸念",
      "fake_review_risk": "サクラ度",
      "amazon_url": "AmazonのURL",
      "rakuten_url": "楽天のURL",
      "yahoo_url": "YahooのURL",
      "is_multi_platform": true
    }
  ]
}`;

    onProgress('3大モールを高速リサーチ中...');

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json"
                }
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || 'API Request Failed');
        }

        const data = await response.json();
        let textResponse = data.candidates[0].content.parts[0].text;
        textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        
        return JSON.parse(textResponse).products;

    } catch (e) {
        console.error('Gemini Error:', e);
        throw new Error('分析に失敗しました。1分ほど待ってから再度お試しください。');
    }
}
