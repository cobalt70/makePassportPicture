import { GoogleGenAI, Modality } from "@google/genai";

function base64ToGenerativePart(base64: string, mimeType: string) {
    return {
        inlineData: {
            data: base64.split(',')[1],
            mimeType
        },
    };
}

export const generatePassportPhoto = async (imageBase64: string, additionalPrompt?: string): Promise<string | null> => {
    if (!process.env.API_KEY) {
        throw new Error("API 키가 환경 변수에 설정되지 않았습니다.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const imagePart = base64ToGenerativePart(imageBase64, 'image/png');
        
        let prompt = `이 인물 사진을 전문적인 한국 여권 사진으로 변환해 주세요. 다음 지침을 따라주세요:
**중요**: 사진에 여러 사람이 있는 경우, 카메라에 가장 가깝고 가장 중심에 있는 한 사람만 선택하여 여권 사진을 만들어주세요. 다른 사람들은 결과물에서 완전히 제거해야 합니다.

1.  **배경**: 기존 배경을 완전히 제거하고 단색의 깔끔한 흰색 배경(헥스 코드 #FFFFFF)으로 교체해 주세요.
2.  **인물 보정**: 피부의 잡티나 결점을 자연스럽게 제거하여 깨끗하게 만들어 주세요. 과도하지 않게, 본인의 특징은 유지하면서 피부톤을 개선해주세요.
3.  **표정**: 현재 표정을 유지하되, 부드럽고 자연스러운 미소를 살짝 더해주세요. 치아가 보이지 않는 편안한 표정이어야 합니다.
4.  **규격**: 선택된 인물은 정면을 향하고 중앙에 위치해야 하며, 최종 이미지가 표준 한국 여권 사진 규격에 부합하도록 해주세요.
5.  **최종 결과물**: 어떠한 텍스트나 다른 요소도 추가하지 마세요. 최종 결과물은 보정된 인물 한 명과 흰색 배경만 포함해야 합니다.`;

        if (additionalPrompt && additionalPrompt.trim() !== '') {
            prompt += `\n\n**사용자 추가 요청사항**: "${additionalPrompt}". 이 요청사항을 최우선으로 고려하여 이미지를 수정해 주세요. 만약 요청사항이 여권 규정에 위배될 경우, 규정을 우선적으로 지켜주세요.`;
        }

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
        
        if (!response.candidates?.length || !response.candidates[0].content?.parts?.length) {
            console.error("Invalid response from Gemini API", response);
            throw new Error("AI 모델이 이미지를 반환하지 않았습니다. 안전 설정에 의해 차단되었거나 다른 문제가 발생했을 수 있습니다.");
        }

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                return part.inlineData.data; // Return base64 string
            }
        }

        // If loop finishes without finding an image
        throw new Error("AI 응답에 이미지 데이터가 포함되어 있지 않습니다.");

    } catch (error) {
        console.error("Error generating passport photo with Gemini API:", error);
        if (error instanceof Error && error.message.includes('API key not valid')) {
            throw new Error("API key not valid. Please check your API key.");
        }
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Gemini API 호출 중 오류가 발생했습니다.");
    }
};
