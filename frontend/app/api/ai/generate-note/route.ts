import { NextRequest } from 'next/server'
import { GoogleGenAI } from '@google/genai'

export async function POST(request: NextRequest) {
  const { image_base64, mime_type, crop } = await request.json()

  if (!image_base64 || !mime_type) {
    return Response.json({ error: '画像データが必要です' }, { status: 400 })
  }

  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    return Response.json({ error: 'GEMINI_API_KEY が設定されていません' }, { status: 500 })
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
    const cropLabel = crop ? `「${crop}」` : '作物'
    const prompt = `あなたは農家です。この画像は${cropLabel}の成長記録です。
この作物の現在の状態について、支援者に向けて日本語で2〜3文の短いコメントを書いてください。
温かみのある農家らしい口調で、具体的な観察（葉の色・大きさ・生育状況など）を含めてください。
コメントのみを返してください。前置きや説明は不要です。`

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            { inlineData: { data: image_base64, mimeType: mime_type } },
          ],
        },
      ],
    })

    const note = response.text?.trim() ?? ''
    return Response.json({ note })
  } catch (e) {
    console.error('[generate-note] error:', e)
    const msg = e instanceof Error ? e.message : String(e)
    return Response.json({ error: msg }, { status: 500 })
  }
}
