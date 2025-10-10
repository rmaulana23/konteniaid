import { GoogleGenAI, Modality } from "@google/genai";
import { ProductCategory, AdStyle, ModelGender, AutomotiveModification, CarColor, VehicleType, ColorTone } from '../types';

let ai: GoogleGenAI;

function initAi() {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable is not set");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
}


const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      }
    };
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};

const getPrompt = (category: ProductCategory, adStyle: AdStyle, modelGender?: ModelGender, automotiveModification?: AutomotiveModification, carColor?: CarColor, vehicleType?: VehicleType, customPrompt?: string, customCarColor?: string, colorTone?: ColorTone): string => {
    let basePrompt = '';

    // Logika khusus untuk Fashion & Lifestyle
    if (category === 'fashion_lifestyle') {
        let styleDescription = '';
        switch (adStyle) {
            case 'indoor_studio':
                styleDescription = '1. Studio Editorial Style – clean softbox lighting, minimal gradient background, elegant pose, neutral color tones, fashion catalog aesthetic.';
                break;
            case 'outdoor_golden_hour':
                styleDescription = '2. Urban Lifestyle Style – outdoor street or golden hour city scene, warm lighting, cinematic flares, candid natural posture, trendy vibe.';
                break;
            case 'lifestyle_natural':
                styleDescription = '3. Aesthetic Daily Life Style – cozy indoor environment (home, café, park), soft daylight, natural interaction, minimal props, calm lifestyle atmosphere.';
                break;
            case 'professional_kitchen':
                styleDescription = '4. Professional Kitchen – sleek, modern kitchen setting with stainless steel appliances, marble countertops, and under-cabinet lighting. The model interacts naturally with the environment, creating a sophisticated and clean culinary lifestyle aesthetic.';
                break;
            default:
                styleDescription = 'Studio Editorial Style – clean softbox lighting, minimal gradient background, elegant pose, neutral color tones, fashion catalog aesthetic.';
        }
        
        const genderText = modelGender === 'man' ? 'male model' : 'female model';

        basePrompt = `Transform the uploaded product photo into a professional fashion and lifestyle advertisement mockup. Make the product appear realistically worn or held by a stylish ${genderText}, photographed in the following commercial setting: ${styleDescription}
Ensure the product remains the main focus, well-lit, and clearly visible. Add subtle depth of field, professional lighting, and realistic skin tone.
The overall image should look like a premium ad campaign photo used for brand mockups or social media content.
Ultra-realistic 8K resolution, high dynamic range, editorial photography quality, shallow depth of field, captured with 85mm lens, commercial lighting setup.
Style keywords: cinematic, minimal, realistic textures, clean composition, aesthetic modern branding, professional model photography.
Negative Prompt: no watermark, no text, no logo, no multiple models, no distorted product, no overexposure, no unrealistic background, no cartoon style, no messy composition.`;
    }

    // Logika khusus untuk Otomotif
    else if (category === 'automotive') {
        let styleDescription = '';
        switch (adStyle) {
            case 'indoor_studio':
                styleDescription = '1. Showroom Premium: vehicle displayed in a glossy, minimalist indoor environment with soft reflection on the floor, professional studio lighting, high contrast, metallic highlights, and brand-like luxury presentation.';
                break;
            case 'outdoor_golden_hour':
                styleDescription = '2. Outdoor Action: vehicle captured in motion during golden hour or night street setting, surrounded by cinematic lighting, dust particles, or road reflections, evoking speed and adventure.';
                break;
            case 'cinematic_night':
                styleDescription = '3. Dynamic Motion Blur: vehicle driving on a highway with realistic motion blur, glowing headlights, trail light streaks, and dynamic perspective, showing a sense of power and movement.';
                break;
            case 'japanese_drifting':
                styleDescription = '4. Japanese Drifting: The vehicle is captured mid-drift on a neon-lit street in a Japanese city like Tokyo at night. The scene should be dynamic, with smoke billowing from the tires, motion blur on the background, and a dramatic low-angle perspective to emphasize the action.';
                break;
            case 'city_street':
                styleDescription = '5. City Street: The vehicle is parked realistically on the side of a busy, vibrant city street at dusk. The scene features authentic reflections from streetlights and storefronts on the car\'s body, with pedestrians and traffic blurred in the background to maintain focus on the product.';
                break;
            default:
                styleDescription = '1. Showroom Premium: vehicle displayed in a glossy, minimalist indoor environment with soft reflection on the floor, professional studio lighting, high contrast, metallic highlights, and brand-like luxury presentation.';
        }
        
        let modificationPrompt = '';
        if (automotiveModification && automotiveModification !== 'none') {
            if (vehicleType === 'motor') { // MOTORCYCLE LOGIC
                switch (automotiveModification) {
                    case 'elegant_luxury':
                        modificationPrompt = 'In addition to the scene, the motorcycle must be heavily modified for an elegant, luxury look. This includes a custom-designed performance exhaust, high-end forged wheels, upgraded brakes, and subtle chrome or carbon fiber accents. The overall aesthetic should be clean, premium, and sophisticated.';
                        break;
                    case 'racing_team':
                        modificationPrompt = 'In addition to the scene, the motorcycle must be transformed into a full race bike. This includes a complete aerodynamic racing fairing kit, a high-performance custom exhaust system, lightweight racing wheels with slick tires, and a full-body custom racing team livery. The stance should be aggressive and track-ready.';
                        break;
                }
            } else { // CAR LOGIC (DEFAULT)
                switch (automotiveModification) {
                    case 'elegant_luxury':
                        modificationPrompt = 'In addition to the scene, the vehicle must be heavily modified. The key modification is to add a full custom widebody kit, making the car visibly wider with flared wheel arches. Also, add completely redesigned, aggressive front and rear bumpers, a sleek rear spoiler, large high-end wheels, and lower the car\'s suspension for a clean, stanced look.';
                        break;
                    case 'racing_team':
                        modificationPrompt = 'In addition to the scene, the vehicle must be heavily modified. The main visual change is a full professional widebody race kit, including drastically redesigned aerodynamic bumpers and a large rear wing. Also, apply a full body custom racing team livery, fit it with aggressive racing wheels, and lower the suspension for a track-ready stance.';
                        break;
                }
            }
        }

        let colorPrompt = '';
        if (carColor && carColor !== 'original') {
            let colorDescription = '';
            if (carColor === 'custom' && customCarColor && customCarColor.trim() !== '') {
                colorDescription = customCarColor.trim();
            } else {
                switch (carColor) {
                    case 'metallic_black': colorDescription = 'a deep, glossy metallic black'; break;
                    case 'pearl_white': colorDescription = 'a brilliant, shimmering pearl white'; break;
                    case 'candy_red': colorDescription = 'a vibrant, rich candy red'; break;
                    case 'gunmetal_gray': colorDescription = 'a dark, sleek gunmetal gray'; break;
                    case 'electric_blue': colorDescription = 'a striking, bright electric blue'; break;
                }
            }
            if (colorDescription) {
                colorPrompt = `Furthermore, change the vehicle's paint color to ${colorDescription}. Ensure the new color has realistic reflections and finish.`;
            }
        }

        let driverPrompt = '';
        if (adStyle === 'outdoor_golden_hour' || adStyle === 'cinematic_night' || adStyle === 'japanese_drifting') {
            driverPrompt = `Since the vehicle is depicted in motion, either make the windows slightly dark/tinted for a mysterious look, OR add a photorealistic but non-descript AI person in the driver's seat as if they are driving. Do not add a person for static showroom scenes.`;
        }


        basePrompt = `Generate a professional automotive advertisement based on the uploaded vehicle photo.
${colorPrompt}
${modificationPrompt}
${driverPrompt}
Place the vehicle in the following hyper-realistic scene: ${styleDescription}
Add cinematic tone, soft smoke or mist for atmosphere, lens flares, depth of field, and photorealistic detail.
Composition should emphasize the design, power, and premium quality of the vehicle.
Ultra-realistic 8K, professional automotive lighting setup, crisp reflections, polished chrome and paint textures, magazine-style aesthetic, perfect for advertising.
Negative prompt: no watermark, no text, no logo, cartoon, low-res, blur, deformities, bad composition, unrealistic.`;
    }

    // Logika fallback untuk Makanan & Minuman
    else {
        let styleDetails = '';
        switch (adStyle) {
            case 'indoor_studio':
                styleDetails = "High-end studio setting with professional softbox lighting. Clean reflections, cinematic shadows, and a smooth, minimal backdrop gradient.";
                break;
            case 'outdoor_golden_hour':
                styleDetails = "Outdoor setting during the golden hour. Warm, golden sunlight casting soft highlights and long shadows, creating a beautiful natural bokeh.";
                break;
            case 'cinematic_night':
                styleDetails = "Dramatic night scene with cinematic lighting. Use key lights to highlight the product, creating a premium and mysterious atmosphere against a dark background.";
                break;
            case 'lifestyle_natural':
                styleDetails = "A natural, real-life environment like a cozy kitchen or a café. Use soft, ambient daylight to create a relaxed and authentic atmosphere.";
                break;
        }

        let colorTonePrompt = '';
        if (colorTone && colorTone !== 'natural') {
            switch (colorTone) {
                case 'warm':
                    colorTonePrompt = "The entire image must have a warm color tone, using soft golden light to create a cozy and inviting atmosphere.";
                    break;
                case 'cool':
                    colorTonePrompt = "The entire image must have a cool color tone, using crisp, slightly blueish light to emphasize freshness and a clean, modern aesthetic.";
                    break;
            }
        }

        const dynamicEffects = "For hot food, add subtle steam or smoke. For beverages, add realistic condensation or a dynamic splash. For other products, add complementary floating ingredients or elements.";

        basePrompt = `Generate a photorealistic professional advertisement photo based on the uploaded product image.
Do not change the product itself, but place it in a new, hyper-realistic scene.
IMPORTANT: If the uploaded product is in packaging (e.g., a snack bag, box, or bottle), creatively open the packaging to reveal the contents. Some of the product can be shown spilling out or arranged artfully around the open package to make it look delicious and appealing.
Make the product levitate elegantly in the center.
Surround the levitating product with its key ingredients or related elements, also floating dynamically.
${dynamicEffects}
The scene style is: ${styleDetails}
${colorTonePrompt}
The final image must look like a real, high-end commercial photograph.
Focus on realistic textures, cinematic lighting, and a professional composition.
8K resolution, ultra-realistic, hero shot.
Negative prompt: no watermark, no text, no logos, cartoon, low-res, blur, deformities, extra objects overlapping the product, do not place the product on a plate or in another container.`;
    }

    if (customPrompt && customPrompt.trim() !== '') {
        basePrompt += `\n\nIMPORTANT: Also apply this specific instruction from the user: "${customPrompt.trim()}"`;
    }
    
    return basePrompt;
};


export const generateAdPhotos = async (
  imageFile: File,
  category: ProductCategory,
  adStyle: AdStyle,
  variations: number,
  modelGender?: ModelGender,
  automotiveModification?: AutomotiveModification,
  carColor?: CarColor,
  vehicleType?: VehicleType,
  customPrompt?: string,
  customCarColor?: string,
  colorTone?: ColorTone
): Promise<string[]> => {
  try {
    const genAI = initAi();
    const imagePart = await fileToGenerativePart(imageFile);
    const generatedImages: string[] = [];
    const textPrompt = getPrompt(category, adStyle, modelGender, automotiveModification, carColor, vehicleType, customPrompt, customCarColor, colorTone);

    for (let i = 0; i < variations; i++) {
        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
              parts: [
                imagePart,
                { text: textPrompt },
              ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        const imagePartResponse = response.candidates?.[0]?.content.parts.find(part => part.inlineData);

        if (imagePartResponse?.inlineData) {
            const base64ImageBytes: string = imagePartResponse.inlineData.data;
            const mimeType = imagePartResponse.inlineData.mimeType;
            const imageUrl = `data:${mimeType};base64,${base64ImageBytes}`;
            generatedImages.push(imageUrl);
        }
    }

    if (generatedImages.length !== variations) {
      throw new Error(`Gagal menghasilkan jumlah gambar yang diminta. Diharapkan ${variations}, diterima ${generatedImages.length}. Silakan coba lagi.`);
    }

    return generatedImages;

  } catch (error) {
    console.error("Error generating images with Gemini:", error);
    throw new Error("Terjadi kesalahan saat membuat foto iklan. Silakan coba lagi.");
  }
};