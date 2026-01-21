import { GoogleGenAI, Type } from "@google/genai";
import { MovieMetadata } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchMovieMetadata = async (movieName: string, skipImageGeneration: boolean = false): Promise<MovieMetadata> => {
  // 1. Prepare Text Metadata Request
  const textReq = ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Find details for the movie "${movieName}". Return the summary in Turkish. Provide the official IMDb URL.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Official Turkish title of the movie" },
          originalTitle: { type: Type.STRING, description: "Original title of the movie" },
          year: { type: Type.STRING, description: "Release year" },
          genre: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of genres (in Turkish)"
          },
          director: { type: Type.STRING, description: "Director name" },
          summary: { type: Type.STRING, description: "Short plot summary in Turkish (max 30 words)" },
          emoji: { type: Type.STRING, description: "A single emoji best describing the movie" },
          themeColor: { type: Type.STRING, description: "A hex color code matching the movie poster mood" },
          imdbUrl: { type: Type.STRING, description: "Full URL to the movie's IMDb page" }
        },
        required: ["title", "originalTitle", "year", "genre", "director", "summary", "emoji", "themeColor", "imdbUrl"]
      }
    }
  });

  // 2. Prepare Image Generation Request (Conditional)
  let imageReqPromise = null;
  if (!skipImageGeneration) {
    imageReqPromise = ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `A high quality, cinematic movie poster for the movie "${movieName}". The title "${movieName}" should be prominently displayed and integrated into the poster design. Minimalist, official style, vertical.` }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4"
        }
      }
    });
  }

  // 3. Execute logic
  
  let textResult: PromiseSettledResult<any>;
  let imageResult: PromiseSettledResult<any> | null = null;

  if (imageReqPromise) {
     const results = await Promise.allSettled([textReq, imageReqPromise]);
     textResult = results[0];
     imageResult = results[1];
  } else {
     const result = await Promise.allSettled([textReq]);
     textResult = result[0];
  }

  // Default Fallback
  let metadata: MovieMetadata = {
    title: movieName,
    originalTitle: movieName,
    year: "???",
    genre: ["Bilinmiyor"],
    director: "Bilinmiyor",
    summary: "Film detayları alınamadı, ancak kaydınız oluşturuldu.",
    emoji: "🎬",
    themeColor: "#64748b",
    imdbUrl: `https://www.imdb.com/find?q=${encodeURIComponent(movieName)}`
  };

  // Process Text Response
  if (textResult.status === 'fulfilled' && textResult.value.text) {
    try {
      metadata = { ...metadata, ...JSON.parse(textResult.value.text) };
    } catch (error) {
      console.error("Failed to parse metadata JSON", error);
    }
  } else if (textResult.status === 'rejected') {
    console.error("Text generation failed:", textResult.reason);
  }

  // Process Image Response (Only if requested and successful)
  if (imageResult && imageResult.status === 'fulfilled') {
    const response = imageResult.value;
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          metadata.posterBase64 = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }
  } else if (imageResult && imageResult.status === 'rejected') {
    console.error("Image generation failed:", imageResult.reason);
  }

  return metadata;
};

export const getDailyHoroscope = async (sign: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Sen eski bir Teletext servisisin. ${sign} burcu için günlük film temalı fal bak. 
      Yanıtın SADECE büyük harflerle Türkçe olsun. 
      Sinema terimleri, film klişeleri veya ünlü repliklere gönderme yap. 
      Maksimum 30 kelime olsun. Gizemli ama eğlenceli konuş.`,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Horoscope failed", error);
    return "BUGUN YILDIZLAR SIZIN ICIN NET DEGIL. YARIN TEKRAR DENEYINIZ.";
  }
};

export const getMovieRecommendation = async (watchedMovies: string[]): Promise<{title: string, reason: string}> => {
  try {
    const prompt = watchedMovies.length > 0
      ? `Kullanıcının sevdiği filmler: ${watchedMovies.join(', ')}.
         Bu zevke sahip birine izlemediği, kaliteli ve nokta atışı TEK BİR FİLM öner.
         Yanıt JSON olsun: { "title": "FILM ADI", "reason": "NEDEN BU FILMI SECITIGINIZI ACIKLAYAN KISA, ETKILEYICI, TELETEXT REHBERI AGZIYLA YAZILMIS BIR CUMLE. (MAX 15 KELIME, HEP BÜYÜK HARF)" }`
      : `Bana herkesin izlemesi gereken kült, kaliteli veya çok popüler tek bir film öner.
         Yanıt JSON olsun: { "title": "FILM ADI", "reason": "NEDEN BU FILMI SECITIGINIZI ACIKLAYAN KISA, ETKILEYICI, TELETEXT REHBERI AGZIYLA YAZILMIS BIR CUMLE. (MAX 15 KELIME, HEP BÜYÜK HARF)" }`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { 
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    reason: { type: Type.STRING }
                },
                required: ["title", "reason"]
            }
        }
    });

    return JSON.parse(response.text);
  } catch (e) {
    console.error(e);
    return { title: "THE MATRIX", reason: "SISTEM HATASI. KLASIKLERE DONUS YAPILDI. MAVI HAP MI KIRMIZI HAP MI?" };
  }
};