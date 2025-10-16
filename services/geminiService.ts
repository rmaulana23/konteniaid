import { GoogleGenAI, Modality } from "@google/genai";
import { ProductCategory, AdStyle, ModelGender, AutomotiveModification, CarColor, VehicleType, ColorTone, LiveryStyle, PhotoFormat, AestheticStyle, ModelEthnicity, ObjectStyle } from '../types';

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
    kidsAgeRange?: string,
    addModelToFood?: 'yes' | 'no',
    objectStyle?: ObjectStyle
): string => {
    let categorySpecificDetails = '';
    let styleText = 'profesional';

    // Logika khusus untuk Fashion & Lifestyle
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
                case 'man':
                    genderText = 'male model';
                    break;
                case 'woman':
                    genderText = 'female model';
                    break;
                case 'kids':
                    const ageText = kidsAgeRange && kidsAgeRange.trim() !== '' 
                        ? `age around ${kidsAgeRange.trim()}` 
                        : 'age around 6-10 years old';
                    genderText = `child model (boy or girl, ${ageText}, looking happy and natural)`;
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

    // Logika khusus untuk Otomotif
    else if (category === 'automotive') {
        let styleDescription = '';
        switch (adStyle) {
            case 'indoor_studio':
                styleDescription = '1. Showroom Premium: vehicle displayed in a glossy, minimalist indoor environment with soft reflection on the floor, professional studio lighting, high contrast, metallic highlights, and brand-like luxury presentation.';
                styleText = 'Showroom Premium';
                break;
            case 'outdoor_golden_hour':
                styleDescription = '2. Outdoor Action: vehicle captured in motion during golden hour or night street setting, surrounded by cinematic lighting, dust particles, or road reflections, evoking speed and adventure.';
                styleText = 'Aksi Outdoor';
                break;
            case 'japanese_drifting':
                styleDescription = '4. Japanese Drifting: The vehicle is captured mid-drift on a neon-lit street in a Japanese city like Tokyo at night. The scene should be dynamic, with smoke billowing from the tires, motion blur on the background, and a dramatic low-angle perspective to emphasize the action.';
                styleText = 'Japanese Drifting';
                break;
            case 'city_street':
                styleDescription = '5. City Street: The vehicle is parked realistically on the side of a busy, vibrant city street at dusk. The scene features authentic reflections from streetlights and storefronts on the car\'s body, with pedestrians and traffic blurred in the background to maintain focus on the product.';
                styleText = 'City Street';
                break;
            default:
                styleDescription = '1. Showroom Premium: vehicle displayed in a glossy, minimalist indoor environment with soft reflection on the floor, professional studio lighting, high contrast, metallic highlights, and brand-like luxury presentation.';
                 styleText = 'Showroom Premium';
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
                    case 'lowrider_style':
                        modificationPrompt = 'In addition to the scene, the motorcycle must be heavily modified into a Lowrider style. The key features are large-diameter spoked wheels (wire wheels) with thick, high-profile tires. Include custom extended handlebars (like ape hangers), a low-slung custom seat, and plenty of chrome details on the engine and exhaust. The suspension should appear lowered, giving it a classic lowrider stance.';
                        break;
                }
            } else { // CAR LOGIC (DEFAULT)
                switch (automotiveModification) {
                    case 'elegant_luxury':
                        modificationPrompt = 'In addition to the scene, the vehicle must be heavily modified. The key modification is to add a full custom widebody kit, making the car visibly wider with flared wheel arches. Also, add completely redesigned, aggressive front and rear bumpers, a sleek rear spoiler, large high-end wheels, and lower the car\'s suspension for a clean, stanced look.';
                        break;
                    case 'racing_team':
                        modificationPrompt = 'In addition to the scene, transform the vehicle into a full-blown professional race car. The most critical change is a full-body, vibrant "racing team" livery, absolutely covered from top to bottom in numerous prominent, colorful sponsor logos, similar to a NASCAR or GT race car. The livery must be dense with graphics, stripes, and include a clear race number. Also, apply a full professional widebody race kit with drastically redesigned aerodynamic bumpers and a large rear wing, fit it with aggressive racing wheels, and lower the suspension for a track-ready stance.';
                        break;
                    case 'off_road_look':
                        modificationPrompt = 'In addition to the scene, the vehicle must be heavily modified into a rugged off-road machine. This includes fitting large, aggressive all-terrain or mud-terrain tires with a knobby tread pattern. The suspension must be visibly lifted, showing off heavy-duty shocks. Add a front bull bar or winch bumper, a roof rack, and multiple bright auxiliary LED lights (like a light bar on the roof or pods on the bumper). The overall stance should be high and capable.';
                        break;
                    case 'rally_art':
                        modificationPrompt = 'In addition to the scene, transform the vehicle into an authentic rally car. This includes applying a full-body \'Rally Art\' style livery, covered in numerous prominent sponsor logos (like \'Pirelli\', \'Sparco\', \'Mobil 1\'). Fit it with smaller, multi-spoke rally wheels and appropriate tires. Add mud flaps behind the wheels. Importantly, the car should have a light layer of realistic dirt, dust, or mud splatter, as if it has just completed a rally stage, to enhance the authenticity.';
                        break;
                    case 'custom':
                        const customMods: string[] = [];
                        if (allBumper === 'yes') customMods.push('completely replace the original front and rear bumpers and side skirts with a new, aggressive custom design. The new parts must look drastically different from the stock version');
                        if (spoiler === 'yes') customMods.push('a custom rear spoiler (choose a style that fits the car, e.g., ducktail, wing, or lip spoiler)');
                        if (wideBody === 'yes') customMods.push('a custom widebody kit with flared wheel arches');
                        if (rims === 'yes') customMods.push('large, high-end custom aftermarket wheels/rims');
                        if (hood === 'yes') customMods.push('a custom hood, for example one with vents or a scoop');
                        
                        let partsPrompt = '';
                        if (customMods.length > 0) {
                            partsPrompt = `Apply the following custom parts: ${customMods.join(', ')}, and lower the car's suspension for a clean, stanced look.`;
                        }

                        let liveryPrompt = '';
                        if (livery && livery !== 'none') {
                            switch (livery) {
                                case 'racing_team':
                                    liveryPrompt = 'Apply a full-body professional racing team livery. The design should feature bold sponsor logos (use generic or fictional brands like \'Nitto\', \'Advan\', \'Brembo\'), dynamic racing stripes, and a prominent race number. The look should be clean and authentic to a real circuit race car.';
                                    break;
                                case 'drift_style':
                                    liveryPrompt = 'Apply a vibrant, aggressive drift-style livery. This should be a mix of street and race aesthetics, featuring contrasting sharp-angled graphics, slanted sponsor logos, and possibly a two-tone color scheme. The vibe should be energetic and eye-catching, typical of drift event cars.';
                                    break;
                            }
                        }

                        let stickerPrompt = '';
                        if (hasSticker) {
                            stickerPrompt = 'A separate image of a logo has been uploaded. Apply this logo as a realistic sponsor sticker onto the side of the car. It must look like a real vinyl decal, conforming to the car\'s body panels and affected by the scene\'s lighting and reflections.';
                        }
                        
                        const allMods = [partsPrompt, liveryPrompt, stickerPrompt].filter(Boolean).join(' ');
                        if (allMods) {
                            modificationPrompt = `In addition to the scene, the vehicle must be modified. ${allMods} Ensure all modifications are integrated seamlessly and look realistic.`;
                        }
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
        // Only add a generic AI driver if a specific person has NOT been uploaded.
        if (!hasPerson && (adStyle === 'outdoor_golden_hour' || adStyle === 'japanese_drifting')) {
            driverPrompt = `Since the vehicle is depicted in motion, either make the windows slightly dark/tinted for a mysterious look, OR add a photorealistic but non-descript AI person in the driver's seat as if they are driving. Do not add a person for static showroom scenes.`;
        }
        
        let personPrompt = '';
        if (hasPerson) {
            if (personMode === 'face_only') {
                personPrompt = `A separate image containing a person's face has been uploaded. You MUST generate a realistic, complete body for this face and integrate the person seamlessly into the scene. The person's pose should be natural and contextually appropriate for the car and the scene style (e.g., sitting in the driver's seat, leaning against the car, or standing next to it). The generated body, clothing, and proportions must look photorealistic and match the overall aesthetic of the advertisement.`;
            } else { // 'full_body'
                personPrompt = `A separate image containing a full-body person has been uploaded. You MUST extract this person from their original background and place them realistically into the generated scene with the vehicle. Ensure the person's lighting, shadows, scale, and perspective are perfectly blended with the new environment to create a cohesive and believable image. The person should be interacting naturally with the car.`;
            }
        }


        categorySpecificDetails = `${colorPrompt}
${modificationPrompt}
${driverPrompt}
${personPrompt}
Place the vehicle in the following hyper-realistic scene: ${styleDescription}
Add cinematic tone, soft smoke or mist for atmosphere, lens flares, depth of field, and photorealistic detail.
Composition should emphasize the design, power, and premium quality of the vehicle.
Ultra-realistic 8K, professional automotive lighting setup, crisp reflections, polished chrome and paint textures, magazine-style aesthetic, perfect for advertising.
Negative prompt: no watermark, no text, no logo, cartoon, low-res, blur, deformities, bad composition, unrealistic.`;
    }

    // Logika fallback untuk Makanan & Minuman
    else {
        let styleDetails = '';
        let presentationInstruction = `Product Presentation Rules: The uploaded product is the hero. If the product is in a snack bag or similar packaging, you have the creative freedom to open it to reveal the contents. However, for sealed products like bottles or cans, you MUST keep the packaging professional and closed. Enhance it with condensation or splashes instead. The AI should intelligently decide if opening the package is appropriate for the specific product to make it look its best.`;

        let modelPrompt = '';
        if (addModelToFood === 'yes') {
            if (modelGender === 'custom' && hasCustomModel) {
                modelPrompt = `A separate full-body photo of a person has been uploaded. You MUST use this person as the model. Extract the person from their original background and realistically place them into the generated scene. The model should be interacting with the food product in a natural, appealing way (e.g., holding it, about to eat it, presenting it with a smile). The uploaded food product must be the main focus, positioned believably with the model. Ensure the model's lighting, shadows, scale, and perspective are perfectly blended with the new environment to create a cohesive and believable food advertisement.`;
            } else {
                let ethnicityText = '';
                if (modelGender !== 'custom' && modelEthnicity) {
                    switch(modelEthnicity) {
                        case 'indonesian': ethnicityText = 'an Indonesian (Southeast Asian)'; break;
                        case 'caucasian': ethnicityText = 'a Caucasian'; break;
                    }
                }
                let genderText = '';
                switch (modelGender) {
                    case 'man': genderText = 'male model'; break;
                    case 'woman': genderText = 'female model'; break;
                    case 'kids':
                        const ageText = kidsAgeRange && kidsAgeRange.trim() !== '' ? `age around ${kidsAgeRange.trim()}` : 'age around 6-10 years old';
                        genderText = `child model (boy or girl, ${ageText}, looking happy and natural)`;
                        break;
                    default: genderText = 'female model'; // Fallback
                }
                const fullModelDescription = `${ethnicityText} ${genderText}`.trim();
                modelPrompt = `Incorporate a photorealistic, stylish ${fullModelDescription} into the scene. The model should be interacting naturally and appealingly with the food product, as if endorsing it in a high-end advertisement. Examples of interaction: holding the product elegantly, smiling while about to take a bite, or presenting it towards the camera. The model should enhance the product, not distract from it. The food product must remain the primary focus.`;
            }
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
        
        // LOGIKA BARU BERDASARKAN GAYA OBJEK
        if (objectStyle === 'surface') {
            switch (aestheticStyle) {
                case 'cafe_minimalist':
                    styleDetails = "Place the product naturally on a clean, minimalist cafe table. Use soft, bright, natural daylight from a nearby window. The background should be a slightly blurred, aesthetic cafe interior. Add minimal props like a small plant or a cup. The focus is on a clean, bright, and inviting atmosphere.";
                    styleText = 'Kafe Minimalis';
                    break;
                case 'dramatic_spotlight':
                    styleDetails = "Place the product on a dark, textured surface like slate or dark wood. Use a single, dramatic spotlight from above to highlight the product's texture and form, creating deep shadows. The background should be completely dark and out of focus. This style creates a premium, moody, and sophisticated look.";
                    styleText = 'Sorotan Dramatis';
                    break;
                case 'warm_rustic':
                    styleDetails = "Place the product on a rustic wooden table or surface. Surround it with natural, complementary elements like whole ingredients or rustic fabrics. Use warm, soft, ambient lighting to create a cozy, homemade, and authentic feel. The composition should be natural and slightly imperfect.";
                    styleText = 'Gaya Rustik Hangat';
                    break;
            }
            categorySpecificDetails = `${presentationInstruction}
${modelPrompt}
The product should be presented aesthetically on a surface, NOT floating.
The scene style is: ${styleDetails}
${colorTonePrompt}
The final image must look like a real, high-end commercial photograph.
Focus on realistic textures, professional lighting, and a beautiful composition.
8K resolution, ultra-realistic, hero shot.
Negative prompt: no watermark, no text, no logos, cartoon, low-res, blur, deformities, floating product.`;

        } else { // LOGIKA UNTUK GAYA MELAYANG
            switch (adStyle) {
                case 'indoor_studio':
                    styleDetails = "High-end studio setting with professional softbox lighting. Clean reflections, cinematic shadows, and a smooth, minimal backdrop gradient.";
                    styleText = 'Studio Profesional';
                    break;
                case 'outdoor_golden_hour':
                    styleDetails = "Outdoor setting during the golden hour. Warm, golden sunlight casting soft highlights and long shadows, creating a beautiful natural bokeh.";
                    styleText = 'Outdoor Golden Hour';
                    break;
                case 'cinematic_night':
                    styleDetails = "Dramatic night scene with cinematic lighting. Use key lights to highlight the product, creating a premium and mysterious atmosphere against a dark background.";
                    styleText = 'Sinematik Malam Hari';
                    break;
                case 'lifestyle_natural':
                    styleDetails = "A natural, real-life environment like a cozy kitchen or a café. Use soft, ambient daylight to create a relaxed and authentic atmosphere.";
                    styleText = 'Gaya Hidup Natural';
                    break;
            }

            const dynamicEffects = "For hot food, add subtle steam or smoke. For beverages, add realistic condensation or a dynamic splash. For other products, add complementary floating ingredients or elements.";

            categorySpecificDetails = `${presentationInstruction}
${modelPrompt}
Make the product levitate elegantly in the center.
Surround the levitating product with its key ingredients or related elements, also floating dynamically.
${dynamicEffects}
The scene style is: ${styleDetails}
${colorTonePrompt}
The final image must look like a real, high-end commercial photograph.
Focus on realistic textures, cinematic lighting, and a professional composition.
8K resolution, ultra-realistic, hero shot.
Negative prompt: no watermark, no text, no logos, cartoon, low-res, deformities, extra objects overlapping the product, do not place the product on a plate or in another container.`;
        }
    }
    
    // START OF FIX: Restructure prompt to be more forceful about aspect ratio
    const aspectRatioString = {
        '1:1': '1:1 (persegi)',
        '4:5': '4:5 (potret)',
        '9:16': '9:16 (vertikal penuh)',
        '16:9': '16:9 (lanskap)',
    }[photoFormat];

    const toneText = colorTone === 'warm' ? 'hangat' : colorTone === 'cool' ? 'dingin' : 'natural';

    const compositionRules: Record<PhotoFormat, string> = {
        '1:1': 'Hasilkan foto dalam format 1:1 (persegi). Fokuskan produk di tengah frame, gunakan komposisi simetris, pencahayaan lembut, dan latar profesional.',
        '4:5': 'Hasilkan foto dalam format 4:5 (potret). Tampilkan produk dari sudut pandang profesional dengan pencahayaan alami dan komposisi vertikal yang elegan.',
        '9:16': 'Hasilkan foto dalam format 9:16 (vertikal penuh). Gunakan gaya dinamis, pencahayaan dramatis, dan fokuskan produk di area tengah-bawah frame.',
        '16:9': 'Hasilkan foto dalam format 16:9 (lanskap). Gunakan komposisi lebar, pencahayaan sinematik, dan sediakan ruang kosong (negative space) untuk teks promosi.'
    };

    let finalPrompt = `
PERINTAH UTAMA: Buat gambar dengan rasio aspek persis ${aspectRatioString}. Ini adalah aturan paling penting.
ATURAN KOMPOSISI: ${compositionRules[photoFormat]}

---
PERAN AI: ANDA ADALAH AI GENERATOR GAMBAR IKLAN PROFESIONAL.
---

DETAIL PERMINTAAN GAMBAR:

1. **Objek Utama**: Gunakan gambar produk yang di-upload. JANGAN mengubah produk itu sendiri, tetapi tempatkan secara realistis ke dalam adegan baru.
2. **Gaya & Suasana**:
   - Gaya Iklan: ${styleText}
   - Tone Warna: ${toneText}
3. **Detail Adegan Spesifik Kategori**:
   - ${categorySpecificDetails}
${customPrompt && customPrompt.trim() !== '' ? `4. **Instruksi Tambahan dari Pengguna**:\n   - ${customPrompt.trim()}` : ''}

---
PENGINGAT TERAKHIR: Abaikan semua kata kunci dalam deskripsi yang mungkin menyiratkan rasio aspek berbeda (seperti 'sinematik' atau 'vertikal'). Patuhi PERINTAH UTAMA dan hasilkan gambar dengan rasio aspek ${aspectRatioString} TANPA PENGECUALIAN.
`;
    return finalPrompt.trim();
    // END OF FIX
};


export const generateAdPhotos = async (
  imageFile: File,
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
  kidsAgeRange?: string,
  addModelToFood?: 'yes' | 'no',
  objectStyle?: ObjectStyle
): Promise<{ images: string[]; warning: string | null }> => {
  try {
    const genAI = initAi();

    const textPrompt = getPrompt(
      category, adStyle, photoFormat, aestheticStyle, modelGender, modelEthnicity, automotiveModification, carColor,
      vehicleType, customPrompt, customCarColor, colorTone, spoiler,
      wideBody, rims, hood, allBumper, livery, !!stickerFile,
      !!personImageFile, personMode, !!customModelFile, kidsAgeRange,
      addModelToFood, objectStyle
    );

    // Prepare all image parts once
    const imagePart = await fileToGenerativePart(imageFile);
    const imageParts = [imagePart];

    if (stickerFile) {
      const stickerImagePart = await fileToGenerativePart(stickerFile);
      imageParts.push(stickerImagePart);
    }
    if (personImageFile) {
      const personImagePart = await fileToGenerativePart(personImageFile);
      imageParts.push(personImagePart);
    }
    if (customModelFile) {
      const customModelPart = await fileToGenerativePart(customModelFile);
      imageParts.push(customModelPart);
    }

    const contentParts = [...imageParts, { text: textPrompt }];

    // Create an array of promises to run image generation in parallel
    const generationPromises = Array.from({ length: variations }, () =>
      genAI.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: contentParts,
        },
        config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
          // Add a random seed to ensure each generation is unique
          seed: Math.floor(Math.random() * 1000000),
        },
      })
    );
    
    const responses = await Promise.all(generationPromises);

    const generatedImages: string[] = [];
    let safetyBlockCount = 0;

    for (const response of responses) {
      const imagePartResponse = response.candidates?.[0]?.content.parts.find(part => part.inlineData);

      if (imagePartResponse?.inlineData) {
        const base64ImageBytes: string = imagePartResponse.inlineData.data;
        const mimeType = imagePartResponse.inlineData.mimeType;
        const imageUrl = `data:${mimeType};base64,${base64ImageBytes}`;
        generatedImages.push(imageUrl);
      } else {
        // Log the reason for failure for debugging
        console.warn("Gemini response did not contain an image part:", JSON.stringify(response, null, 2));
        if (response.candidates?.[0]?.finishReason === 'SAFETY') {
            safetyBlockCount++;
        }
      }
    }

    let warning: string | null = null;
    if (generatedImages.length < variations) {
      const failedCount = variations - generatedImages.length;
      if (safetyBlockCount > 0) {
        warning = `Berhasil membuat ${generatedImages.length} gambar. Gagal membuat ${failedCount} gambar lainnya karena filter keamanan AI. Coba sesuaikan prompt atau gunakan gambar lain.`;
      } else {
        warning = `Berhasil membuat ${generatedImages.length} gambar. Gagal membuat ${failedCount} gambar lainnya karena kesalahan. Silakan coba lagi.`;
      }
    }

    return { images: generatedImages, warning };

  } catch (error) {
    console.error("Error generating images with Gemini:", error);
    // Throw a generic message for unexpected errors. The partial success case is handled above.
    throw new Error("Terjadi kesalahan tak terduga saat membuat foto iklan. Silakan coba lagi.");
  }
};