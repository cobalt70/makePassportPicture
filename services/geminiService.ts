
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

function base64ToGenerativePart(base64: string, mimeType: string) {
    return {
        inlineData: {
            data: base64.split(',')[1],
            mimeType
        },
    };
}

export const generatePassportPhoto = async (imageBase64: string): Promise<string | null> => {
    try {
        const imagePart = base64ToGenerativePart(imageBase64, 'image/png');
        
        const prompt = `이 인물 사진을 전문적인 한국 여권 사진으로 변환해 주세요. 기존 배경을 완전히 제거하고 단색의 흰색 배경(헥스 코드 #FFFFFF)으로 교체해 주세요. 인물은 정면을 향하고 중앙에 위치해야 하며, 표정은 자연스러워야 합니다. 최종 이미지가 표준 한국 여권 사진 규격에 부합하도록 해주세요. 어떠한 텍스트나 다른 요소도 추가하지 마세요. 최종 결과물은 사람과 흰색 배경만 포함해야 합니다.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    imagePart,
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                return part.inlineData.data; // Return base64 string
            }
        }
        return null;
    } catch (error) {
        console.error("Error generating passport photo with Gemini API:", error);
        throw new Error("Gemini API 호출 중 오류가 발생했습니다.");
    }
};
