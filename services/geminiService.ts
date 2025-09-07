import { GoogleGenAI, Modality } from "@google/genai";

function base64ToGenerativePart(base64: string, mimeType: string) {
    return {
        inlineData: {
            data: base64.split(',')[1],
            mimeType
        },
    };
}

export const generatePassportPhoto = async (imageBase64: string, apiKey: string): Promise<string | null> => {
    if (!apiKey) {
        throw new Error("API 키가 제공되지 않았습니다.");
    }
    const ai = new GoogleGenAI({ apiKey });

    try {
        const imagePart = base64ToGenerativePart(imageBase64, 'image/png');
        
        const prompt = `이 인물 사진을 전문적인 한국 여권 사진으로 변환해 주세요. 다음 지침을 따라주세요:
1.  **배경**: 기존 배경을 완전히 제거하고 단색의 깔끔한 흰색 배경(헥스 코드 #FFFFFF)으로 교체해 주세요.
2.  **인물 보정**: 피부의 잡티나 결점을 자연스럽게 제거하여 깨끗하게 만들어 주세요. 과도하지 않게, 본인의 특징은 유지하면서 피부톤을 개선해주세요.
3.  **표정**: 현재 표정을 유지하되, 부드럽고 자연스러운 미소를 살짝 더해주세요. 치아가 보이지 않는 편안한 표정이어야 합니다.
4.  **규격**: 인물은 정면을 향하고 중앙에 위치해야 하며, 최종 이미지가 표준 한국 여권 사진 규격에 부합하도록 해주세요.
5.  **최종 결과물**: 어떠한 텍스트나 다른 요소도 추가하지 마세요. 최종 결과물은 보정된 인물과 흰색 배경만 포함해야 합니다.`;

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
        if (error instanceof Error && error.message.includes('API key not valid')) {
            throw new Error("API key not valid. Please check your API key.");
        }
        throw new Error("Gemini API 호출 중 오류가 발생했습니다.");
    }
};