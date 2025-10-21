


import { GoogleGenAI, Modality, Part } from "@google/genai";
import { ProductCategory, AdStyle, ModelGender, AutomotiveModification, CarColor, VehicleType, ColorTone, LiveryStyle, PhotoFormat, AestheticStyle, ModelEthnicity, ObjectStyle, FoodTheme, PosterStyle, SocialMediaEntry, FashionGender, FashionAge } from '../types';

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
    variations: number,
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
    forceOpenPackage?: boolean,
    foodTheme?: FoodTheme,
    productName?: string,
    productSlogan?: string,
    posterStyle?: PosterStyle,
    socialMediaEntries?: SocialMediaEntry[],
    callToAction?: string,
    fashionGender?: FashionGender,
    fashionAge?: FashionAge,
    useMannequin?: 'yes' | 'no',
    variationDetails?: { index: number; total: number }
): string => {
    let categorySpecificDetails = '';

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
        
        let modelPrompt = '';
        if (fashionGender === 'custom' && hasCustomModel) {
            modelPrompt = `A separate full-body photo of a person has been uploaded. You MUST use this person as the model. Extract the person from their original background and realistically place them into the generated scene: ${styleDescription}.
The uploaded fashion product MUST be extracted from its original photo and realistically placed ON this model, replacing whatever they were originally wearing. The product's appearance (design, color, details) must be preserved perfectly. It must look completely natural, as if they are actually wearing it, with proper fit, folds, and shadows conforming to their body and pose. Ensure the model's lighting, shadows, scale, and perspective are perfectly blended with the new environment to create a cohesive and believable advertisement.`;
        } else if (useMannequin === 'yes') {
            modelPrompt = `Display the product from the uploaded image on a high-end, realistic, gender-neutral mannequin. The product must be extracted perfectly and remain unchanged.
CRITICAL OUTFIT COMPLETION REQUIREMENT: The uploaded product is likely only one part of an outfit (e.g., a shirt or pants). You MUST intelligently generate the missing clothing items to create a complete, stylish, and modest outfit.
- If the uploaded product is a top (like a t-shirt, blouse, or jacket), you must generate appropriate bottoms (like pants, a skirt, or shorts).
- If the uploaded product is bottoms (like pants or a skirt), you must generate an appropriate top (like a shirt or blouse).
- The generated clothing must complement the uploaded product in style and color, creating a cohesive look suitable for a fashion catalog.
CRITICAL MANNEQUIN STYLE: The mannequin itself must be presented in a modest, elegant, and professional pose within the following commercial setting: ${styleDescription}.
The product must fit the mannequin perfectly, showing natural drapes and folds.`;
        } else {
            let ethnicityText = '';
            if (modelEthnicity) {
                switch(modelEthnicity) {
                    case 'indonesian':
                        ethnicityText = 'an Indonesian model with authentic Southeast Asian features (e.g., tan skin, dark hair)';
                        break;
                    case 'caucasian':
                        ethnicityText = 'a Caucasian model (e.g., fair skin, potentially lighter hair color)';
                        break;
                }
            }

            let ageText = fashionAge === 'adult' ? 'adult' : 'child';
            let genderText = fashionGender === 'man' ? 'male model' : 'female model';

            if (ageText === 'child') {
              genderText = fashionGender === 'man' 
                  ? 'male child model (boy, age around 8-12, looking happy and natural)' 
                  : 'female child model (girl, age around 8-12, looking happy and natural)';
            }
            
            const fullModelDescription = `${ageText} ${genderText}`.trim();
            modelPrompt = `The uploaded fashion product MUST be realistically worn, held, or used by a professional ${fullModelDescription}.
CRITICAL ETHNICITY REQUIREMENT: The model MUST be ${ethnicityText}. Their appearance, including facial features, skin tone, and hair, must strictly and accurately represent this ethnicity. This is the most important instruction.
CRITICAL PRODUCT REQUIREMENT: The product's design, color, texture, and all details MUST remain IDENTICAL to the original uploaded image. DO NOT change or alter the product itself.
The model should be photographed in the following commercial setting: ${styleDescription}. The product must look like it is naturally part of the model's outfit, fitting them perfectly and conforming to their body and pose.`;
        }
        categorySpecificDetails = modelPrompt;
        
        // Add sitting pose requirement for the 3rd variation when 3 variations are requested.
        if (variationDetails && variations === 3 && variationDetails.index === 3) {
            categorySpecificDetails += `
CRITICAL POSE REQUIREMENT: For this specific variation, the model MUST be in a sitting pose (e.g., sitting on a chair, a bench, or steps). This is a mandatory instruction for this image.`;
        }

    } else if (category === 'food_beverage') {
        if (foodTheme === 'poster') {
            let socialMediaText = '';
            if (socialMediaEntries && socialMediaEntries.length > 0) {
                socialMediaText = `Include the following social media handles: ${socialMediaEntries.map(e => `${e.platform}: ${e.handle}`).join(', ')}.`;
            }
            let callToActionText = callToAction ? `Include a call to action button with the text: "${callToAction}".` : '';

            let posterStyleText = '';
            switch (posterStyle) {
                case 'modern_clean': posterStyleText = 'a modern, clean, minimalist design with sans-serif fonts and a balanced layout.'; break;
                case 'bold_energetic': posterStyleText = 'a bold, energetic design with dynamic typography and vibrant colors.'; break;
                case 'elegant_premium': posterStyleText = 'an elegant, premium design with sophisticated script or serif fonts and a luxurious feel.'; break;
            }

            categorySpecificDetails = `Create a promotional poster for a product.
- Main Title (Product Name): "${productName}"
- Subtitle (Slogan/Promo): "${productSlogan}"
- Visual Style: The poster must have ${posterStyleText} The product from the uploaded image must be the central focus, extracted perfectly and placed in a visually appealing composition on the poster. Do not alter the product's appearance.
- Additional Elements: ${socialMediaText} ${callToActionText} The overall tone should be professional and eye-catching.`;
        } else {
            let styleDescription = '';
            switch (adStyle) {
                case 'indoor_studio': styleDescription = 'clean studio shot with soft lighting and a minimal, neutral background.'; break;
                case 'outdoor_golden_hour': styleDescription = 'outdoor shot during golden hour with warm, cinematic lighting.'; break;
                case 'cinematic_night': styleDescription = 'dramatic night scene with cinematic lighting and a moody atmosphere.'; break;
                case 'lifestyle_natural': styleDescription = 'natural lifestyle setting, like a cozy cafe or home kitchen, with soft daylight.'; break;
            }
            
            let objectStyleText = objectStyle === 'levitating' 
                ? `CRITICAL DYNAMIC EFFECT: The main product from the uploaded image MUST be levitating in the center of the scene. Furthermore, you must intelligently identify the core ingredients of the food/beverage and generate photorealistic representations of those ingredients levitating and dynamically arranged around the main product. For example, if it's a coffee drink, add floating coffee beans and milk splashes. If it's a burger, add floating lettuce, tomato slices, and cheese. The entire composition must look like a high-end, dynamic commercial advertisement with a sense of motion.`
                : 'The product should be placed on a suitable surface (e.g., wooden table, marble countertop) within the scene.';
            
            if (addModelToFood === 'yes') {
                 let ethnicityText = modelEthnicity === 'indonesian' ? 'an Indonesian model' : 'a Caucasian model';
                 let genderText = modelGender === 'man' ? 'male model' : 'female model';
                 if (modelGender === 'custom' && hasCustomModel) {
                    objectStyleText = `A separate photo of a person has been uploaded. You MUST use this person as the model. Extract them and place them realistically into a scene with the following style: ${styleDescription}. The food product must be naturally interacting with the model (e.g., being held, eaten, or on a table in front of them).`;
                 } else {
                    objectStyleText = `The scene should include a professional ${genderText} who is ${ethnicityText}. The model should be interacting naturally with the food product in a scene with the following style: ${styleDescription}.`;
                 }
            }
            let forceOpenPackageText = forceOpenPackage ? 'If the product is in packaging, it MUST be shown open with the contents visible and appealing.' : '';
            
            categorySpecificDetails = `The product from the uploaded image must be perfectly extracted and placed in a new photorealistic commercial advertisement scene. The product itself must not be altered.
Scene description: A high-end commercial photo featuring the product. The style should be a ${styleDescription}
${objectStyleText}
${forceOpenPackageText}
The final image should look professional, appetizing, and high-resolution. Automatically add dynamic effects appropriate for the food/beverage, like steam, splashes, or condensation, if suitable.`;
        }
    } else if (category === 'automotive') {
        let styleDescription = '';
        switch (adStyle) {
            case 'indoor_studio': styleDescription = 'a professional indoor car showroom with polished floors and dramatic studio lighting.'; break;
            case 'outdoor_golden_hour': styleDescription = 'an outdoor action shot on a scenic road during golden hour, with motion blur to suggest speed.'; break;
            case 'japanese_drifting': styleDescription = 'a dynamic Japanese drifting scene at night on a mountain pass or city circuit, with tire smoke and neon lights.'; break;
            case 'city_street': styleDescription = 'a stylish shot on a city street, perhaps with rain-slicked pavement reflecting city lights.'; break;
        }

        let modificationDetails = '';
        if (automotiveModification !== 'none' && automotiveModification !== 'custom') {
            modificationDetails = `The vehicle MUST be modified in an '${automotiveModification}' style.`;
        } else if (automotiveModification === 'custom' && vehicleType === 'mobil') {
            const mods = [];
            if (allBumper === 'yes') mods.push('a custom front bumper, rear bumper, and side skirts');
            if (spoiler === 'yes') mods.push('a large rear spoiler');
            if (wideBody === 'yes') mods.push('a widebody kit');
            if (rims === 'yes') mods.push('custom aftermarket rims');
            if (hood === 'yes') mods.push('a custom hood, possibly with vents');
            if (mods.length > 0) {
                modificationDetails = `The vehicle MUST be modified with ${mods.join(', ')}.`;
            }
        }
        
        let colorDetails = carColor === 'original' ? 'The original color of the vehicle must be preserved.' : `The vehicle's color MUST be changed to ${carColor === 'custom' ? customCarColor : carColor}.`;
        
        let liveryDetails = '';
        if (livery !== 'none') {
            liveryDetails = `The vehicle must have a ${livery} livery.`;
            if (hasSticker) {
                liveryDetails += ' A separate sticker/logo image has been uploaded; it MUST be realistically applied to the vehicle as part of the livery.'
            }
        }
        
        let personDetails = '';
        if (hasPerson) {
            if (personMode === 'face_only') {
                personDetails = `A separate photo of a person's face has been uploaded. You MUST generate a realistic body for this person and place them next to the vehicle in a natural pose that fits the scene.`;
            } else {
                personDetails = `A separate full-body photo of a person has been uploaded. You MUST extract this person from their original background and realistically place them next to the vehicle.`;
            }
        }

        categorySpecificDetails = `Create a photorealistic commercial advertisement featuring the vehicle from the uploaded image. The vehicle must be perfectly extracted and placed into a new scene.
Scene Description: ${styleDescription}
${modificationDetails}
${colorDetails}
${liveryDetails}
${personDetails}
The final image must be high-resolution, dynamic, and look like a professional car advertisement.`;
    }

    const colorToneText = colorTone && colorTone !== 'natural' ? `The overall color tone of the final image should be ${colorTone}.` : '';
    const variationText = variationDetails && variationDetails.total > 1 ? ` This is variation ${variationDetails.index} of ${variationDetails.total}. Generate a slightly different camera angle or composition for each variation.` : '';
    
    // Add clean image instruction, except for posters.
    let cleanImageInstruction = '';
    if (!(category === 'food_beverage' && foodTheme === 'poster')) {
        cleanImageInstruction = `3.  **Clean Image**: The final image MUST be a clean photograph. It MUST NOT contain any text, letters, numbers, dates, logos, watermarks, or any other graphic overlays. The only exception is text that is naturally part of the product itself in the original photo.`;
    }

    const finalPrompt = `
Task: Create a professional advertisement photo based on an uploaded product image.
Image Format: The final image aspect ratio MUST be ${photoFormat}.

Core Instructions:
1.  **Product Integrity**: The original product from the uploaded image is the hero. It MUST be perfectly extracted from its background. DO NOT change, alter, or redraw the product in any way. Its design, details, colors, and branding must remain identical.
2.  **Photorealism**: The final image must be photorealistic, with lighting, shadows, and reflections that make the product look naturally integrated into the new scene. Avoid an "edited" or "photoshopped" look.
${cleanImageInstruction}

Category-Specific Instructions:
${categorySpecificDetails}

Additional Instructions:
- ${colorToneText}
- ${customPrompt ? `User's custom request: "${customPrompt}".` : ''}
${variationText}
`;

    return finalPrompt.trim();
};

export const generateAdPhotos = async (
    productImage: File,
    category: ProductCategory,
    adStyle: AdStyle,
    variations: number,
    photoFormat: PhotoFormat,
    aestheticStyle: AestheticStyle,
    modelGender: ModelGender,
    modelEthnicity: ModelEthnicity,
    automotiveModification: AutomotiveModification,
    carColor: CarColor,
    vehicleType: VehicleType,
    customPrompt: string,
    customCarColor: string,
    colorTone: ColorTone,
    spoiler: 'yes' | 'no',
    wideBody: 'yes' | 'no',
    rims: 'yes' | 'no',
    hood: 'yes' | 'no',
    allBumper: 'yes' | 'no',
    livery: LiveryStyle,
    stickerFile: File | null,
    personFile: File | null,
    personMode: 'full_body' | 'face_only' | undefined,
    customModelFile: File | null,
    addModelToFood: 'yes' | 'no',
    objectStyle: ObjectStyle | undefined,
    forceOpenPackage: boolean | undefined,
    foodTheme: FoodTheme,
    productName: string,
    productSlogan: string,
    posterStyle: PosterStyle,
    socialMediaEntries: SocialMediaEntry[],
    callToAction: string,
    fashionGender: FashionGender,
    fashionAge: FashionAge,
    useMannequin: 'yes' | 'no'
): Promise<{ images: string[], warning: string | null }> => {

    const generatedImages: string[] = [];
    let warning: string | null = null;
    
    const modelName = 'gemini-2.5-flash-image';

    const imageParts: Part[] = [];

    const productPart = await fileToGenerativePart(productImage);
    imageParts.push(productPart);

    if (customModelFile) {
        const modelPart = await fileToGenerativePart(customModelFile);
        imageParts.push(modelPart);
    }
    
    if (stickerFile && category === 'automotive') {
        const stickerPart = await fileToGenerativePart(stickerFile);
        imageParts.push(stickerPart);
    }
    
    if (personFile && category === 'automotive') {
        const personPart = await fileToGenerativePart(personFile);
        imageParts.push(personPart);
    }

    const generationPromises = [];

    for (let i = 0; i < variations; i++) {
        const prompt = getPrompt(
            category,
            adStyle,
            photoFormat,
            variations,
            aestheticStyle,
            modelGender,
            modelEthnicity,
            automotiveModification,
            carColor,
            vehicleType,
            customPrompt,
            customCarColor,
            colorTone,
            spoiler,
            wideBody,
            rims,
            hood,
            allBumper,
            livery,
            !!stickerFile,
            !!personFile,
            personMode,
            !!customModelFile,
            addModelToFood,
            objectStyle,
            forceOpenPackage,
            foodTheme,
            productName,
            productSlogan,
            posterStyle,
            socialMediaEntries,
            callToAction,
            fashionGender,
            fashionAge,
            useMannequin,
            { index: i + 1, total: variations }
        );

        const textPart = { text: prompt };
        const allParts = [...imageParts, textPart];
        
        const promise = ai.models.generateContent({
            model: modelName,
            contents: { parts: allParts },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        }).then(response => {
            for (const part of response.candidates?.[0]?.content?.parts || []) {
                if (part.inlineData) {
                    const base64ImageBytes: string = part.inlineData.data;
                    const imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
                    return imageUrl;
                }
            }
            return null;
        }).catch(err => {
            console.error(`Error generating variation ${i + 1}:`, err);
            warning = "Beberapa variasi gambar gagal dibuat. Ini mungkin karena permintaan yang terlalu kompleks atau batasan keamanan AI.";
            return null;
        });
        generationPromises.push(promise);
    }

    const results = await Promise.all(generationPromises);

    for (const imageUrl of results) {
        if (imageUrl) {
            generatedImages.push(imageUrl);
        }
    }

    if (generatedImages.length === 0 && variations > 0) {
        throw new Error("Gagal menghasilkan gambar. Silakan coba lagi dengan prompt yang berbeda atau gambar yang lebih jelas.");
    }
    
    return { images: generatedImages, warning };
};