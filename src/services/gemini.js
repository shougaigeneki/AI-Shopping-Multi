// src/services/gemini.js

export async function callGeminiResearch(apiKey, theme, onProgress) {
    const model = 'gemini-3-flash-preview';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=` + apiKey;

    const prompt = `あなたは「物を買わない主義」の買い物図鑑の編集長です。
テーマ「${theme}」に合う、Amazon・楽天・Yahooの3大モールすべてで評価の高い「一生モノ」の逸品を 5〜8件 選定してください。

以下の情報をJSON形式で出力してください。Amazon、楽天、Yahooの検索結果URLをそれぞれ生成してください。

JSON構造：
{
  "products": [
    {
      "name": "商品名",
      "rating": "数",
      "judgment": "採用 または 不採用",
      "reason": "詳細な理由",
      "pros": "メリット",
      "fatal_flaws": "欠点",
      "long_term_concerns": "懸念事項",
      "fake_review_risk": "サクラ度や評価の信憑性",
      "amazon_url": "Amazonの検索URL",
      "rakuten_url": "楽天市場の検索URL",
      "yahoo_url": "Yahooショッピングの検索URL"
    }
  ]
}`;

    onProgress('3大モールの在庫と評判を調査中...');

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
        let text = data.candidates[0].content.parts[0].text;
        
        // どんなにお喋りなレスポンスでも、最初の { から最後の } までを抜き出す
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
            text = text.substring(start, end + 1);
        }
        
        return JSON.parse(text).products;

    } catch (e) {
        console.error('Gemini Error:', e);
        throw new Error('分析に失敗しました。');
    }
}
