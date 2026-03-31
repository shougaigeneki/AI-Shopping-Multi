// src/services/gemini.js

export async function callGeminiResearch(apiKey, theme, onProgress) {
    // 最新安定モデルのリサーチ用リスト (2026/04)
    const models = [
        'gemini-2.0-flash', 
        'gemini-1.5-flash', 
        'gemini-2.0-flash-exp', 
        'gemini-1.5-pro', 
        'gemini-3-flash-preview', 
        'gemini-3-flash'
    ];

    const prompt = `あなたは「物を買わない主義」の買い物図鑑の編集長です。
テーマ「${theme}」に合致する、Amazon.co.jpでの評価が極めて高く、かつ楽天市場やYahoo!ショッピングでも扱われている「一生モノ」の商品を 5〜10件 選定してください。`;

    // 実際のプロンプト本体（中略せずに記述）
    const fullPrompt = `あなたは「物を買わない主義」の買い物図鑑の編集長です。
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
      "amazon_url": "Amazon의 URL",
      "rakuten_url": "楽天のURL",
      "yahoo_url": "YahooのURL",
      "is_multi_platform": true
    }
  ]
}`;

    for (const model of models) {
        onProgress(`3大モールを ${model} でリサーチ中...`);
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=` + apiKey;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: fullPrompt }] }],
                    generationConfig: {
                        responseMimeType: "application/json"
                    }
                })
            });

            // 404, 503, 429 は次のモデルへ
            if (response.status === 404 || response.status === 503 || response.status === 429) {
                console.warn(`${model} returned status ${response.status}. Trying next...`);
                continue;
            }

            if (!response.ok) {
                const errData = await response.json();
                const msg = errData.error?.message || '';
                if (msg.includes('high demand') || msg.includes('overloaded') || msg.includes('temporary')) {
                    continue;
                }
                throw new Error(msg || 'API Request Failed');
            }

            const data = await response.json();
            let textResponse = data.candidates[0].content.parts[0].text;
            textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
            
            return JSON.parse(textResponse).products;

        } catch (e) {
            console.error(`${model} Error:`, e);

            if (model === models[models.length - 1]) {
                throw new Error('複数のモデルで試行しましたが、マルチモール分析に失敗しました。時間をおいて再度お試しください。');
            }

            continue;
        }
    }
}
