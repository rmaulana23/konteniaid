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
    useMannequin?: 'yes' | 'no'
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
        if (fashionGender === 'custom' && hasCustomModel) {
            modelPrompt = `A separate full-body photo of a person has been uploaded. You MUST use this person as the model. Extract the person from their original background and realistically place them into the generated scene: ${styleDescription}.
The uploaded fashion product MUST be extracted from its original photo and realistically placed ON this model, replacing whatever they were originally wearing. The product's appearance (design, color, details) must be preserved perfectly. It must look completely natural, as if they are actually wearing it, with proper fit, folds, and shadows conforming to their body and pose. Ensure the model's lighting, shadows, scale, and perspective are perfectly blended with the new environment to create a cohesive and believable advertisement.`;
        } else if (useMannequin === 'yes') {
            modelPrompt = `Display the product from the uploaded image on a high-end, realistic, gender-neutral mannequin. The product must be extracted perfectly and remain unchanged. The mannequin should be posed elegantly within the following commercial setting: ${styleDescription}. The product must fit the mannequin perfectly, showing natural drapes and folds.`;
        } else {
            let ethnicityText = '';
            if (modelEthnicity) {
                switch(modelEthnicity) {
                    case 'indonesian':
                        ethnicityText = 'an Indonesian (Southeast Asian)';
                        break;
                    case 'caucasian':
                        ethnicityText = 'a Caucasian';
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
            
            const fullModelDescription = `${ethnicityText} ${ageText} ${genderText}`.trim();
            modelPrompt = `The uploaded fashion product MUST be extracted perfectly and then realistically worn, held, or used by a stylish ${fullModelDescription}.
CRITICAL: The product's design, color, texture, and all details MUST remain IDENTICAL to the original uploaded image. DO NOT change or alter the product itself.
The model should be photographed in the following commercial setting: ${styleDescription}. The product must look like it is naturally part of the model's outfit, fitting them perfectly and conforming to their body's posture, creating realistic folds, creases, and shadows. It must not look digitally pasted on.`;
        }
        
        let poseInstruction = `IMPORTANT: For each image variation generated, you MUST create a completely different and unique pose for the model. Do not repeat poses between variations.`;
        if (variations > 1) {
            poseInstruction += ` To provide a dynamic and varied set of advertising images, it is crucial that each of the ${variations} variations features a unique pose.`;
        }
        categorySpecificDetails = `${modelPrompt}\n\n${poseInstruction}`;
    } else if (category === 'food_beverage') {
      if (foodTheme === 'poster') {
            let posterStyleText = '';
            switch (posterStyle) {
                case 'modern_clean':
                    posterStyleText = 'a modern, clean, and minimalist design aesthetic. Use sans-serif fonts, ample white space, and a clear visual hierarchy.';
                    break;
                case 'bold_energetic':
                    posterStyleText = 'a bold, energetic, and eye-catching design. Use strong typography, vibrant colors, and dynamic layouts.';
                    break;
                case 'elegant_premium':
                    posterStyleText = 'an elegant, premium, and luxurious design. Use serif fonts, a sophisticated color palette (e.g., gold, dark tones), and a refined layout.';
                    break;
            }

            let socialMediaText = '';
            if (socialMediaEntries && socialMediaEntries.length > 0) {
                socialMediaText = 'Include the following social media handles:\n';
                socialMediaEntries.forEach(entry => {
                    socialMediaText += `- ${entry.platform}: ${entry.handle}\n`;
                });
            }

            categorySpecificDetails = `Create a promotional poster for a food/beverage product.
- The product from the uploaded image MUST be the central focus. Extract it perfectly.
- Poster Style: ${posterStyleText}
- Main Title (Large Font): "${productName}"
- Subtitle/Slogan (Smaller Font): "${productSlogan}"
- Call to Action (if provided): "${callToAction}"
- Social Media (if provided): ${socialMediaText}
- The background should be thematic and complementary to the product and poster style.
- All text must be clearly legible and well-integrated into the design.
- DO NOT invent new text elements unless specified.`;
        } else { // image theme
            let styleDescription = '';
            switch (adStyle) {
                case 'indoor_studio':
                    styleDescription = 'a clean, professional indoor studio setting with controlled softbox lighting. The background should be minimal and non-distracting, like a solid color or subtle gradient, to emphasize the product.';
                    break;
                case 'outdoor_golden_hour':
                    styleDescription = 'an outdoor setting during the golden hour (late afternoon) with warm, beautiful, and slightly dramatic lighting. The background could be a rustic table, a picnic scene, or a beautiful natural landscape.';
                    break;
                case 'cinematic_night':
                    styleDescription = 'a dramatic, cinematic night scene. Use strong contrast, deep shadows, and focused lighting (like a spotlight) to create a moody and premium feel. The background could be a dark, elegant bar or a city scene at night.';
                    break;
                case 'lifestyle_natural':
                    styleDescription = 'a natural, lifestyle setting that feels authentic and relatable, such as a cozy home kitchen, a bright cafe, or a casual gathering. The lighting should be soft and natural (e.g., daylight from a window).';
                    break;
            }

            let objectStyleText = objectStyle === 'levitating' 
                ? 'The product should be levitating in the air for a magical and dynamic effect. Add dynamic elements like splashes, steam, or floating ingredients around it.' 
                : 'The product should be placed on a suitable surface (e.g., a wooden table, marble countertop, slate plate) that matches the scene.';

            let modelPrompt = '';
            if (addModelToFood === 'yes') {
                if (modelGender === 'custom' && hasCustomModel) {
                    modelPrompt = `An additional photo of a person has been uploaded. You MUST use this person as the model. Extract the person and place them realistically into the scene, interacting with the food product in a natural way (e.g., holding it, about to eat it, smiling next to it). The scene is: ${styleDescription}.`;
                } else {
                    const ethnicityText = modelEthnicity === 'indonesian' ? 'an Indonesian' : 'a Caucasian';
                    const genderText = modelGender === 'woman' ? 'female model' : 'male model';
                    modelPrompt = `Include a happy and stylish ${ethnicityText} ${genderText} in the scene, interacting naturally with the product. The model should enhance the product, not distract from it.`;
                }
            }
            
            categorySpecificDetails = `Create an advertisement image featuring the food product from the uploaded photo.
- Scene Description: ${styleDescription}
- Product Placement: ${objectStyleText}
- Dynamic Effects: Automatically add relevant dynamic effects like steam for hot food, condensation for cold drinks, splashes for liquids, or floating ingredients to make the image look delicious and appealing.
${modelPrompt}`;
        }
    } else if (category === 'automotive') {
        let styleDescription = '';
        switch (adStyle) {
            case 'indoor_studio':
                styleDescription = 'a professional indoor studio or showroom with perfect, reflective lighting and a clean, minimal background to highlight the vehicle\'s design.';
                break;
            case 'outdoor_golden_hour':
                styleDescription = 'an outdoor action shot on a scenic road (e.g., mountain pass, coastal highway) during the golden hour. The vehicle should be in motion, conveying speed and freedom.';
                break;
            case 'japanese_drifting':
                styleDescription = 'a dynamic Japanese drifting scene at night. The vehicle should be mid-drift on a neon-lit city street or a mountain touge pass, with smoke coming from the tires and a strong sense of motion.';
                break;
            case 'city_street':
                styleDescription = 'a stylish city street scene, either during the day with architectural backgrounds or at night with vibrant city lights and reflections on the vehicle.';
                break;
        }

        let modificationPrompt = `The vehicle is a ${vehicleType}. `;
        if (automotiveModification === 'none') {
            modificationPrompt += 'It should not be modified.';
        } else if (automotiveModification === 'custom') {
            modificationPrompt += 'Apply the following custom modifications:\n';
            if (allBumper === 'yes') modificationPrompt += '- Add a custom front bumper, rear bumper, and side skirts.\n';
            if (spoiler === 'yes') modificationPrompt += '- Add a large rear spoiler/wing.\n';
            if (wideBody === 'yes') modificationPrompt += '- Add a widebody kit with fender flares.\n';
            if (rims === 'yes') modificationPrompt += '- Change the wheels to custom aftermarket rims.\n';
            if (hood === 'yes') modificationPrompt += '- Add a custom hood with vents.\n';
            if (livery !== 'none') modificationPrompt += `- Apply a ${livery.replace('_', ' ')} livery.\n`;
        } else {
            modificationPrompt += `Apply a full ${automotiveModification.replace(/_/g, ' ')} modification style to it.`;
        }

        if (carColor !== 'original') {
            modificationPrompt += `The vehicle's color MUST be changed to ${carColor === 'custom' ? customCarColor : carColor.replace(/_/g, ' ')}.`;
        }

        let personPrompt = '';
        if (hasPerson) {
            if (personMode === 'face_only') {
                personPrompt = 'An image of a person\'s face has been uploaded. Create a full, photorealistic body for this person that matches the style of the scene and vehicle, and place them next to the vehicle in a cool, natural pose (e.g., leaning against it, standing beside it).';
            } else {
                personPrompt = 'A full-body image of a person has been uploaded. Extract this person from their background and place them realistically next to the vehicle in a cool, natural pose.';
            }
        }
        
        let stickerPrompt = hasSticker ? 'A sticker/logo image has been uploaded. Realistically apply this sticker to the side of the vehicle (e.g., on the door or fender).' : '';

        categorySpecificDetails = `Create an advertisement image for the vehicle in the uploaded photo.
- Scene Description: ${styleDescription}
- Vehicle Modifications: ${modificationPrompt}
${stickerPrompt}
${personPrompt}`;
    }

    const basePrompt = `Create ${variations} photorealistic, professional-grade advertisement ${foodTheme === 'poster' ? 'poster' : 'image'}(s) for the product in the uploaded image.`;

    const formatInstruction = `The final image(s) MUST be in a ${photoFormat} aspect ratio.`;
    
    // Assembling the final prompt
    let finalPrompt = `${basePrompt}\n\n${categorySpecificDetails}\n\n${formatInstruction}`;
    
    if (customPrompt) {
        finalPrompt += `\n\nAdditional user instructions: "${customPrompt}"`;
    }

    if (colorTone && colorTone !== 'natural') {
        finalPrompt += `\nApply a ${colorTone} color tone to the final image.`;
    }

    finalPrompt += "\n\nCRITICAL INSTRUCTIONS:\n1. The original product/vehicle from the uploaded image MUST be perfectly extracted and placed in the new scene. DO NOT change its core design, shape, or key details unless modification instructions are given.\n2. The final image must be ultra-realistic, high-resolution, and look like a professional advertisement.\n3. Ensure lighting, shadows, and perspective are perfectly blended for a believable result.";
    
    return finalPrompt;
};

// Fix: Add and export generateAdPhotos function.
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
  forceOpenPackage?: boolean,
  foodTheme?: FoodTheme,
  productName?: string,
  productSlogan?: string,
  posterStyle?: PosterStyle,
  socialMediaEntries?: SocialMediaEntry[],
  callToAction?: string,
  fashionGender?: FashionGender,
  fashionAge?: FashionAge,
  useMannequin?: 'yes' | 'no'
): Promise<{ images: string[], warning?: string }> => {
  const prompt = getPrompt(
    category, adStyle, photoFormat, variations, aestheticStyle, modelGender, modelEthnicity,
    automotiveModification, carColor, vehicleType, customPrompt, customCarColor, colorTone,
    spoiler, wideBody, rims, hood, allBumper, livery, !!stickerFile, !!personImageFile, personMode,
    !!customModelFile, addModelToFood, objectStyle, forceOpenPackage, foodTheme,
    productName, productSlogan, posterStyle, socialMediaEntries, callToAction, fashionGender,
    fashionAge, useMannequin
  );

  const imageParts: Part[] = [await fileToGenerativePart(productImage)];
  
  if (stickerFile) {
    imageParts.push(await fileToGenerativePart(stickerFile));
  }
  if (personImageFile) {
    imageParts.push(await fileToGenerativePart(personImageFile));
  }
  if (customModelFile) {
    imageParts.push(await fileToGenerativePart(customModelFile));
  }
  
  imageParts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: imageParts },
        config: {
            responseModalities: [Modality.IMAGE],
            numberOfImages: variations
        }
    });
    
    const images: string[] = [];
    let warning: string | undefined = undefined;

    if (response.candidates && response.candidates.length > 0) {
        for (const candidate of response.candidates) {
            for (const part of candidate.content.parts) {
                if (part.inlineData) {
                    const base64ImageBytes: string = part.inlineData.data;
                    const imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
                    images.push(imageUrl);
                }
            }
        }
    }

    if (images.length === 0) {
        throw new Error('AI tidak dapat menghasilkan gambar. Coba ubah prompt atau gambar Anda.');
    }
    
    if (images.length < variations) {
        warning = `AI hanya dapat menghasilkan ${images.length} dari ${variations} variasi yang diminta. Ini mungkin karena permintaan Anda terlalu kompleks.`;
    }

    return { images, warning };

  } catch (error: any) {
    console.error("Gemini API error:", error);
    let errorMessage = "Terjadi kesalahan saat berkomunikasi dengan AI. Silakan coba lagi.";
    if (error.message) {
        // Simple check for common safety/policy issues.
        if (error.message.includes('SAFETY')) {
            errorMessage = "Permintaan Anda mungkin melanggar kebijakan keamanan. Coba gunakan prompt yang berbeda.";
        } else {
            errorMessage = `Error dari AI: ${error.message}`;
        }
    }
    throw new Error(errorMessage);
  }
};
