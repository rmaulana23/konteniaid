
import { GoogleGenAI, Modality, Part } from "@google/genai";
import { ProductCategory, AdStyle, ModelGender, AutomotiveModification, CarColor, VehicleType, ColorTone, LiveryStyle, PhotoFormat, AestheticStyle, ModelEthnicity, ObjectStyle, FoodTheme, PosterStyle, SocialMediaEntry } from '../types';

// Fix: Initialize the GoogleGenAI client.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

// Fix: Completed the getPrompt function and added a return statement.
const getPrompt = (
    category: ProductCategory, 
    adStyle: AdStyle, 
    photoFormat: PhotoFormat,
    aestheticStyle?: AestheticStyle,
    modelGender?: ModelGender, 
    modelEthnicity?: ModelEthnicity,
    automotiveModification?: AutomotiveModification, 
    carColor?: CarColor, 
    vehicleType?: VehicleType, 
    customPrompt?: string, 
    customCarColor?: string, 
    colorTone?: ColorTone,
    spoiler?: 'yes' | 'no',
    wideBody?: 'yes' | 'no',
    rims?: 'yes' | 'no',
    hood?: 'yes' | 'no',
    allBumper?: 'yes' | 'no',
    livery?: LiveryStyle,
    hasSticker?: boolean,
    hasPerson?: boolean,
    personMode?: 'full_body' | 'face_only',
    hasCustomModel?: boolean,
    addModelToFood?: 'yes' | 'no',
    objectStyle?: ObjectStyle,
    addFoodEffects?: 'yes' | 'no',
    forceOpenPackage?: boolean,
    foodTheme?: FoodTheme,
    productName?: string,
    productSlogan?: string,
    posterStyle?: PosterStyle,
    socialMediaEntries?: SocialMediaEntry[],
    callToAction?: string
): string => {
    let categorySpecificDetails = '';
    let styleText = 'profesional';

    if (category === 'fashion_lifestyle') {
        let styleDescription = '';
        switch (adStyle) {
            case 'indoor_studio':
                styleDescription = '1. Studio Editorial Style – clean softbox lighting, minimal gradient background, elegant pose, neutral color tones, fashion catalog aesthetic.';
                styleText = 'Studio Editorial';
                break;
            case 'outdoor_golden_hour':
                styleDescription = '2. Urban Lifestyle Style – outdoor street or golden hour city scene, warm lighting, cinematic flares, candid natural posture, trendy vibe.';
                styleText = 'Urban Lifestyle';
                break;
            case 'lifestyle_natural':
                styleDescription = '3. Aesthetic Daily Life Style – cozy indoor environment (home, café, park), soft daylight, natural interaction, minimal props, calm lifestyle atmosphere.';
                styleText = 'Aesthetic Daily Life';
                break;
            case 'professional_kitchen':
                styleDescription = '4. Professional Kitchen – sleek, modern kitchen setting with stainless steel appliances, marble countertops, and under-cabinet lighting. The model interacts naturally with the environment, creating a sophisticated and clean culinary lifestyle aesthetic.';
                styleText = 'Dapur Profesional';
                break;
            default:
                styleDescription = 'Studio Editorial Style – clean softbox lighting, minimal gradient background, elegant pose, neutral color tones, fashion catalog aesthetic.';
                styleText = 'Studio Editorial';
        }
        
        let modelPrompt = '';
        if (modelGender === 'custom' && hasCustomModel) {
            modelPrompt = `A separate full-body photo of a person has been uploaded. You MUST use this person as the model. Extract the person from their original background and realistically place them into the generated scene: ${styleDescription}. The uploaded fashion product must be realistically placed ON this model, replacing whatever they were originally wearing. Ensure the model's lighting, shadows, scale, and perspective are perfectly blended with the new environment to create a cohesive and believable advertisement.`;
        } else {
            let ethnicityText = '';
            if (modelGender !== 'custom' && modelEthnicity) {
                switch(modelEthnicity) {
                    case 'indonesian':
                        ethnicityText = 'an Indonesian (Southeast Asian)';
                        break;
                    case 'caucasian':
                        ethnicityText = 'a Caucasian';
                        break;
                }
            }

            let genderText = '';
            switch (modelGender) {
                case 'adult_woman':
                    genderText = 'adult female model';
                    break;
                case 'adult_man':
                    genderText = 'adult male model';
                    break;
                case 'child_woman':
                    genderText = 'female child model (girl, age around 8-12, looking happy and natural)';
                    break;
                case 'child_man':
                    genderText = 'male child model (boy, age around 8-12, looking happy and natural)';
                    break;
                default:
                    genderText = 'female model'; // Fallback
            }
            
            const fullModelDescription = `${ethnicityText} ${genderText}`.trim();
            modelPrompt = `Make the product appear realistically worn or held by a stylish ${fullModelDescription}, photographed in the following commercial setting: ${styleDescription}`;
        }

        categorySpecificDetails = `${modelPrompt}
Ensure the product remains the main focus, well-lit, and clearly visible. Add subtle depth of field, professional lighting, and realistic skin tone.
The overall image should look like a premium ad campaign photo used for brand mockups or social media content.
Ultra-realistic 8K resolution, high dynamic range, editorial photography quality, shallow depth of field, captured with 85mm lens, commercial lighting setup.
Style keywords: cinematic, minimal, realistic textures, clean composition, aesthetic modern branding, professional model photography.
Negative Prompt: no watermark, no text, no logo, no multiple models, no distorted product, no overexposure, no unrealistic background, no cartoon style, no messy composition.`;
    }
    else if (category === 'automotive') {
        let styleDescription = '';
        switch (adStyle) {
            case 'indoor_studio':
                styleDescription = '1. Showroom Premium: vehicle displayed in a glossy, minimalist indoor environment with soft reflection on the floor, professional studio lighting, high contrast, metallic highlights, and brand-like luxury presentation.';
                styleText = 'Showroom Premium';
                break;
            case 'outdoor_golden_hour':
                styleDescription = '2. Outdoor Action: dynamic shot of the vehicle on a scenic road during golden hour, with motion blur, dramatic lighting, and a sense of speed and freedom. The surrounding environment should complement the vehicle, like a mountain pass or coastal highway.';
                styleText = 'Outdoor Action';
                break;
            case 'japanese_drifting':
                 styleDescription = '3. Japanese Drifting: vehicle captured mid-drift on a wet city street at night, with neon lights reflecting on the pavement, smoke coming from the tires, and a cinematic, high-energy underground racing aesthetic.';
                styleText = 'Japanese Drifting';
                break;
            case 'city_street':
                styleDescription = '4. City Street: vehicle parked elegantly on a stylish urban street, perhaps in front of modern architecture or a classic building, creating a sophisticated lifestyle shot with natural city lighting and reflections.';
                styleText = 'City Street';
                break;
            default:
                styleDescription = 'Showroom Premium: vehicle displayed in a glossy, minimalist indoor environment with soft reflection on the floor, professional studio lighting, high contrast, metallic highlights, and brand-like luxury presentation.';
                styleText = 'Showroom Premium';
        }
        
        let modificationPrompt = '';
        if (automotiveModification !== 'none' && automotiveModification !== 'custom') {
            modificationPrompt = `Apply a professional ${automotiveModification} modification to the vehicle.`;
        } else if (automotiveModification === 'custom') {
            const customMods: string[] = [];
            if (allBumper === 'yes') customMods.push('custom front and rear bumpers and side skirts');
            if (spoiler === 'yes') customMods.push('a large rear spoiler');
            if (wideBody === 'yes') customMods.push('a widebody kit');
            if (rims === 'yes') customMods.push('custom aftermarket rims');
            if (hood === 'yes') customMods.push('a custom hood with vents');
            if (livery !== 'none') customMods.push(`a ${livery} livery`);
            if (customMods.length > 0) {
                modificationPrompt = `Apply the following custom modifications: ${customMods.join(', ')}.`;
            }
        }

        let colorPrompt = '';
        if (carColor !== 'original' && carColor !== 'custom') {
            colorPrompt = `Change the vehicle's color to ${carColor.replace(/_/g, ' ')}.`;
        } else if (carColor === 'custom' && customCarColor) {
            colorPrompt = `Change the vehicle's color to ${customCarColor}.`;
        }
        
        let stickerPrompt = '';
        if (hasSticker) {
            stickerPrompt = 'A separate sticker/logo image has been uploaded. Realistically place this sticker on the vehicle\'s body, like on the side door or hood, ensuring it follows the contours of the car.';
        }
        
        let personPrompt = '';
        if (hasPerson && personMode === 'full_body') {
            personPrompt = 'A separate photo of a person has been uploaded. Realistically place this person next to the vehicle in a natural pose that fits the scene. The person should look like the owner or a model. Ensure their lighting, shadows, and scale match the environment perfectly.';
        } else if (hasPerson && personMode === 'face_only') {
            personPrompt = 'A separate photo of a person\'s face has been uploaded. Generate a full, stylish body for this person and place them realistically next to the vehicle in a natural pose. The generated body must match the provided face. Ensure lighting, shadows, and scale are perfect.';
        }

        categorySpecificDetails = `Create an ultra-realistic 8K commercial photograph of the uploaded ${vehicleType}.
The scene should be: ${styleDescription}
${modificationPrompt}
${colorPrompt}
${stickerPrompt}
${personPrompt}
${customPrompt || ''}
The final image must look like a professional automotive advertisement. Focus on realistic reflections, lighting, and textures. High dynamic range, cinematic quality, captured with a 50mm lens.
Negative Prompt: no watermark, no text, no logo (unless a sticker is provided), no distorted vehicle, no unrealistic proportions, blurry, cartoonish.`;
    }
    else if (category === 'food_beverage') {
        if (foodTheme === 'poster') {
            let posterStyleText = '';
            switch(posterStyle) {
                case 'modern_clean':
                    posterStyleText = 'a modern, clean, and minimalist style. Use a simple color palette, sans-serif fonts, and a lot of white space.';
                    break;
                case 'bold_energetic':
                    posterStyleText = 'a bold, energetic, and eye-catching style. Use vibrant colors, dynamic typography, and strong graphic elements.';
                    break;
                case 'elegant_premium':
                    posterStyleText = 'an elegant, premium, and luxurious style. Use dark tones, serif or script fonts, and sophisticated imagery.';
                    break;
            }

            const socialMediaText = socialMediaEntries && socialMediaEntries.length > 0 && socialMediaEntries.some(e => e.handle.trim()) 
                ? `Include icons and text for the following social media handles: ${socialMediaEntries.filter(e => e.handle.trim()).map(e => `${e.platform}: @${e.handle}`).join(', ')}.`
                : '';

            categorySpecificDetails = `Create a promotional poster for a product. The main subject is the uploaded food/beverage image.
Product Name: ${productName}
Slogan/Promo: ${productSlogan}
Poster Style: Design the poster in ${posterStyleText}
${callToAction ? `Call to Action Button Text: "${callToAction}"` : ''}
${socialMediaText}
The uploaded product image MUST be the central focus. Remove its original background and place it attractively on the poster. The overall design should be professional and ready for printing or social media.

CRITICAL INSTRUCTIONS FOR TEXT:
- All text elements (Product Name, Slogan, Call to Action, Social Media handles) MUST be perfectly clear, legible, and easy to read.
- There must be ABSOLUTELY NO spelling errors or typos. Double-check every word against the provided text.
- The text should be well-integrated into the design but have enough contrast to stand out. Do not place text over busy parts of the image without a proper background, outline, or shadow.

Negative Prompt: distorted text, unreadable fonts, spelling errors, typos, messy layout, poor composition, blurry product image.`;
        } else { // 'image' theme
            let styleDescription = '';
            let objectPrompt = '';
            if (objectStyle === 'levitating') {
                 styleDescription = `The main subject is the uploaded food/beverage item, which should be levitating in the center of the frame. The background should be a minimal ${adStyle.replace(/_/g, ' ')} setting.`;
                 if (addFoodEffects === 'yes') {
                    objectPrompt = 'Add dynamic, high-speed photography effects like liquid splashes, floating ingredients, or a gentle cloud of steam/smoke around the levitating product to create a sense of motion and freshness.';
                 }
            } else { // surface
                switch(aestheticStyle) {
                    case 'cafe_minimalist':
                        styleDescription = `The product is placed on a clean surface in a minimalist cafe setting. Use soft, natural daylight, with subtle background elements like a wooden table, a simple ceramic plate, or a hint of green plant life. The focus is entirely on the product.`;
                        break;
                    case 'dramatic_spotlight':
                        styleDescription = `The product is presented on a dark surface with a single, dramatic spotlight from above. This creates high contrast, deep shadows, and highlights the product's texture. The background should be completely black or very dark grey.`;
                        break;
                    case 'warm_rustic':
                        styleDescription = `The product is set on a rustic wooden surface, surrounded by warm, cozy elements like a linen napkin, vintage cutlery, or scattered spices. The lighting should be warm, like golden hour sunlight, creating a comfortable and inviting atmosphere.`;
                        break;
                }
                if (addFoodEffects === 'yes') {
                   objectPrompt = 'Add subtle, realistic effects like a gentle wisp of steam (for hot items), condensation droplets (for cold items), or a sprinkle of powdered sugar/spices on the surface around the product.';
                }
            }
            
            let packagePrompt = '';
            if (forceOpenPackage) {
                packagePrompt = 'IMPORTANT: The uploaded image shows a product in its packaging. You MUST generate an image of the product *outside* of its packaging, ready to be consumed. For example, if it is a bag of chips, show the chips in a bowl. If it is a bottle of soda, show the soda in a glass with ice.';
            }

            let modelPrompt = '';
            if (addModelToFood === 'yes' && modelGender) {
                if (modelGender === 'custom' && hasCustomModel) {
                    modelPrompt = `A separate photo of a person has been uploaded. Realistically place this person in the scene, interacting naturally with the food/beverage product (e.g., holding it, about to take a bite). The person should look happy and satisfied. Blend their lighting, shadows, and scale perfectly.`;
                } else {
                    const ethnicityText = modelEthnicity === 'indonesian' ? 'an Indonesian' : 'a Caucasian';
                    const genderText = modelGender === 'woman' ? 'female model' : 'male model';
                    modelPrompt = `Include a stylish ${ethnicityText} ${genderText} in the scene, interacting naturally and happily with the product. The model should not be the main focus but should enhance the product's appeal.`;
                }
            }

            categorySpecificDetails = `Create an ultra-realistic 8K commercial photograph of the uploaded food/beverage product.
${packagePrompt}
Scene Description: ${styleDescription}
Effects: ${objectPrompt}
Model: ${modelPrompt}
${customPrompt || ''}
The final image should look like a premium food advertisement. Emphasize textures, colors, and freshness. Use a shallow depth of field, captured with a macro lens for detail.
Negative Prompt: no watermark, no text, no logo, unrealistic colors, messy composition, distorted product.`;
        }
    }

    const finalPrompt = `ASPECT RATIO: ${photoFormat}.
${categorySpecificDetails}
TONE: The overall color tone should be ${colorTone}.`;
    
    return finalPrompt;
};

// Fix: Implemented and exported generateAdPhotos function
export const generateAdPhotos = async (
    productImage: File,
    category: ProductCategory,
    adStyle: AdStyle,
    variations: number,
    photoFormat: PhotoFormat,
    aestheticStyle?: AestheticStyle,
    modelGender?: ModelGender,
    modelEthnicity?: ModelEthnicity,
    automotiveModification?: AutomotiveModification,
    carColor?: CarColor,
    vehicleType?: VehicleType,
    customPrompt?: string,
    customCarColor?: string,
    colorTone?: ColorTone,
    spoiler?: 'yes' | 'no',
    wideBody?: 'yes' | 'no',
    rims?: 'yes' | 'no',
    hood?: 'yes' | 'no',
    allBumper?: 'yes' | 'no',
    livery?: LiveryStyle,
    stickerFile?: File | null,
    personImageFile?: File | null,
    personMode?: 'full_body' | 'face_only',
    customModelFile?: File | null,
    addModelToFood?: 'yes' | 'no',
    objectStyle?: ObjectStyle,
    addFoodEffects?: 'yes' | 'no',
    forceOpenPackage?: boolean,
    foodTheme?: FoodTheme,
    productName?: string,
    productSlogan?: string,
    posterStyle?: PosterStyle,
    socialMediaEntries?: SocialMediaEntry[],
    callToAction?: string
): Promise<{ images: string[]; warning?: string }> => {
    try {
        const imageParts: Part[] = [];

        const mainImagePart = await fileToGenerativePart(productImage);
        imageParts.push(mainImagePart);
        
        if (customModelFile) {
            imageParts.push(await fileToGenerativePart(customModelFile));
        }
        if (stickerFile) {
            imageParts.push(await fileToGenerativePart(stickerFile));
        }
        if (personImageFile) {
            imageParts.push(await fileToGenerativePart(personImageFile));
        }
        
        const prompt = getPrompt(
            category, adStyle, photoFormat, aestheticStyle, modelGender, modelEthnicity, 
            automotiveModification, carColor, vehicleType, customPrompt, customCarColor, 
            colorTone, spoiler, wideBody, rims, hood, allBumper, livery, !!stickerFile, 
            !!personImageFile, personMode, !!customModelFile, addModelToFood, objectStyle, 
            addFoodEffects, forceOpenPackage, foodTheme, productName, productSlogan, 
            posterStyle, socialMediaEntries, callToAction
        );

        const allParts: Part[] = [...imageParts, { text: prompt }];
        const generatedImages: string[] = [];
        let warning: string | undefined = undefined;

        const generationPromises = Array(variations).fill(0).map(() => 
            ai.models.generateContent({
                model: 'gemini-2.5-flash-image',
                contents: { parts: allParts },
                config: {
                    responseModalities: [Modality.IMAGE],
                },
            }).catch(e => {
                console.error("Gemini API call failed for one variation:", e);
                return null;
            })
        );
        
        const results = await Promise.all(generationPromises);
        
        results.forEach(response => {
            if (response && response.candidates && response.candidates[0].content.parts) {
                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        const base64ImageBytes: string = part.inlineData.data;
                        const imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
                        generatedImages.push(imageUrl);
                    }
                }
            }
        });

        if (generatedImages.length === 0 && variations > 0) {
            throw new Error("Gagal menghasilkan gambar dari AI. Layanan mungkin sedang sibuk atau input tidak sesuai. Silakan coba lagi.");
        } else if (generatedImages.length < variations) {
            warning = `Hanya berhasil membuat ${generatedImages.length} dari ${variations} variasi yang diminta.`;
        }
        
        return { images: generatedImages, warning };

    } catch (e: any) {
        console.error("Error in generateAdPhotos:", e);
        throw new Error(e.message || "Terjadi kesalahan yang tidak diketahui saat menghasilkan gambar.");
    }
};
