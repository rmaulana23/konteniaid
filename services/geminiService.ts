import { GoogleGenAI, Modality } from "@google/genai";
import { ProductCategory, AdStyle, ModelGender, AutomotiveModification, CarColor, VehicleType, ColorTone, LiveryStyle, PhotoFormat, AestheticStyle, ModelEthnicity, ObjectStyle, FoodTheme, PosterStyle } from '../types';

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
    addModelToFood?: 'yes' | 'no',
    objectStyle?: ObjectStyle,
    addFoodEffects?: 'yes' | 'no',
    forceOpenPackage?: boolean,
    foodTheme?: FoodTheme,
    productName?: string,
    productSlogan?: string,
    posterStyle?: PosterStyle,
    socialMediaHandle?: string
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
        if (category === 'food_beverage' && foodTheme === 'poster') {
            styleText = 'Poster Promosi';
            let posterStyleDetails = '';

            const defaultStyle = `
- Layout & Style:
  - The overall design MUST be clean, modern, and minimalistic.
  - Use a simple, elegant color palette (e.g., pastel tones or a monochrome scheme) that complements the product.
  - Typography: Use a bold, clean, sans-serif font for the headline ("${productName}") and a lighter weight of the same font for the slogan ("${productSlogan}").
  - The layout must be vertical (9:16 aspect ratio), with ample negative space to create a sophisticated feel.
  - Add simple geometric shapes or lines in the background to enhance the modern aesthetic.
  - Include placeholder elements: a small area for a logo (top right).
  - Add a simple, solid-colored call-to-action button like 'ORDER NOW' at the bottom.`;

            switch (posterStyle) {
                case 'modern_clean':
                    posterStyleDetails = defaultStyle;
                    break;
                case 'bold_energetic':
                    posterStyleDetails = `
- Layout & Style:
  - The design must be bold, dynamic, and energetic, aimed at grabbing attention.
  - Use a vibrant, high-contrast color palette with bright colors.
  - Typography: Use a very bold, impactful, and playful font for the headline ("${productName}"). For the slogan ("${productSlogan}"), use a contrasting handwritten or brush-style font.
  - Incorporate dynamic background elements like abstract shapes, sunburst patterns, or paint splatters.
  - The layout must be vertical (9:16 aspect ratio) and feel very active and full, but not cluttered.
  - Include placeholder elements: a small area for a logo.
  - The call-to-action button ('ORDER NOW') must be large, bright, and impossible to miss.`;
                    break;
                case 'elegant_premium':
                    posterStyleDetails = `
- Layout & Style:
  - The aesthetic must be elegant, luxurious, and premium.
  - Use a dark, moody color palette (e.g., deep blues, blacks, maroons) with metallic accents (gold, silver, or bronze).
  - Typography: Use a sophisticated serif or a classy script font for the headline ("${productName}"). The slogan ("${productSlogan}") should be in a clean, light sans-serif font for contrast.
  - The background should be subtly textured, like dark marble, rich wood, or a soft-focused luxury setting.
  - Add subtle lighting effects like a soft spotlight on the product or a gentle glow behind it.
  - The layout must be vertical (9:16 aspect ratio), clean, and centered, conveying a sense of quality and prestige.
  - Include minimalist placeholder elements: a small, elegant logo area.
  - The call-to-action button ('ORDER NOW') should be understated but elegant, perhaps with a metallic border.`;
                    break;
                default:
                    posterStyleDetails = defaultStyle;
                    break;
            }

            let socialMediaInstruction = '';
            if (socialMediaHandle && socialMediaHandle.trim() !== '') {
                // Remove "@" if user types it, as we add it in the prompt.
                const handle = socialMediaHandle.trim().replace(/^@/, '');
                socialMediaInstruction = `
- Social Media Element (CRITICAL):
  - At the bottom of the poster, you MUST include a small, universally recognizable Instagram logo icon.
  - Next to the Instagram icon, display this exact text: "@${handle}".
  - Ensure this element is clean, legible, and placed tastefully in a corner (e.g., bottom left), matching the overall poster style. Do NOT add any other social media icons.`;
            }


            categorySpecificDetails = `Create a vibrant promotional poster for "${productName}" using the uploaded product image as the main visual.
            
- Main Visual:
  - The uploaded product image MUST be the hero element, perfectly cut out and placed centrally.
  - Surround the product with dynamic, photorealistic effects that match the product (e.g., liquid splashes, flying ingredients, steam). The effects should complement the chosen style.

- Text Elements (CRITICAL):
  - At the top, display the headline: "${productName}".
  - Below the headline, add the main promotional tagline: "${productSlogan}".
  - All text must be clearly legible, well-integrated, and have a professional design quality that matches the chosen style.

${posterStyleDetails}

${socialMediaInstruction}

- Quality Keywords:
  - Modern 3D render, C4D style, commercial poster, hyper-realistic, professional ad layout, modern food photography, clean composition.
  
- Negative Prompt:
  - no watermark, no blurry text, no distorted product, do not change the product from the uploaded image, no messy layout, no generic stock photo elements, no other social media icons except Instagram if requested.`;

        } else { // Logic for 'image' theme (existing logic)
            let styleDetails = '';
            let presentationInstruction = '';

            if (forceOpenPackage) {
                presentationInstruction = `Product Presentation Rules: CRITICAL INSTRUCTION - For this image, you MUST open the product's packaging to reveal the contents inside. For example, if it's a snack bag, show the bag torn open with the chips attractively spilling out onto the surface. If it's a box of cookies, show the box open with a few cookies visible or placed next to it. The goal is a dynamic, appealing shot that shows the actual product.`;
            } else {
                presentationInstruction = `Product Presentation Rules: CRITICAL INSTRUCTION - For this image, the product packaging MUST remain closed and sealed. Present it in a clean, professional, and heroic manner. Do NOT open the package. You can enhance it with effects like water condensation for drinks or place it on an elegant surface, but the packaging itself must be intact.`;
            }

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
                            genderText = `child model (boy or girl, age around 6-10 years old, looking happy and natural)`;
                            break;
                        default: genderText = 'female model'; // Fallback
                    }
                    const fullModelDescription = `${ethnicityText} ${genderText}`.trim();
                    modelPrompt = `Incorporate a photorealistic, stylish ${fullModelDescription} into the scene. The model should be interacting naturally and appealingly with the food product, as if endorsing it in a high-end advertisement. Examples of interaction: holding the product elegantly, smiling while about to take a bite, or presenting it towards the camera. The model should enhance the product, not distract from it. The food product must remain the primary focus.`;
                }
            }
            
            // UNIFIED LOGIC FOR FOOD STYLES
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
                default:
                    // Fallback for 'none' or other cases, defaulting to a clean studio.
                    styleDetails = "High-end studio setting with professional softbox lighting. Clean reflections, cinematic shadows, and a smooth, minimal backdrop gradient.";
                    styleText = 'Studio Profesional';
                    break;
            }

            let placementInstruction = '';
            let negativePromptExtras = '';

            if (objectStyle === 'surface') {
                placementInstruction = `Product Placement: The product must be presented aesthetically on a relevant surface (like a table, counter, or stand) that fits the scene. It must NOT be floating.`;
                negativePromptExtras = ', floating product';
            } else { // levitating
                placementInstruction = `Product Placement: Make the product levitate elegantly in the center of the frame.`;
                negativePromptExtras = ', do not place the product on a plate or in another container';
            }
            
            let effectsInstruction = '';
            if (addFoodEffects === 'yes') {
                effectsInstruction = `Dynamic Effects: To make the image more dynamic and appealing, add professional photorealistic effects. For hot food, add subtle steam. For beverages, add realistic condensation or a dynamic liquid splash. For other products, add complementary ingredients (like fruit pieces, chocolate chunks, etc.) floating or scattered artfully around the main product.`;
            } else {
                effectsInstruction = `Dynamic Effects: The presentation must be clean, simple, and static. Do NOT add any extra dynamic elements like splashes, floating ingredients, or artificial steam.`;
            }

            categorySpecificDetails = `${presentationInstruction}
${modelPrompt}
${placementInstruction}
${effectsInstruction}
The scene style is: ${styleDetails}
The final image must look like a real, high-end commercial photograph.
Focus on realistic textures, professional lighting, and a beautiful composition.
8K resolution, ultra-realistic, hero shot.
Negative prompt: no watermark, no text, no logos, cartoon, low-res, deformities${negativePromptExtras}.`;
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
   ${category !== 'food_beverage' ? `- Tone Warna: ${toneText}` : ''}
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
  addModelToFood?: 'yes' | 'no',
  objectStyle?: ObjectStyle,
  addFoodEffects?: 'yes' | 'no',
  forceOpenPackage?: boolean, // This can be removed or kept for other potential uses
  foodTheme?: FoodTheme,
  productName?: string,
  productSlogan?: string,
  posterStyle?: PosterStyle,
  socialMediaHandle?: string
): Promise<{ images: string[]; warning: string | null }> => {
  try {
    if (!process.env.API_KEY) {
      throw new Error("API key not found. Please select a valid API key to continue.");
    }
    const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Prepare all image parts once
    const imagePart = await fileToGenerativePart(imageFile);
    const staticImageParts = [imagePart];

    if (stickerFile) {
      const stickerImagePart = await fileToGenerativePart(stickerFile);
      staticImageParts.push(stickerImagePart);
    }
    if (personImageFile) {
      const personImagePart = await fileToGenerativePart(personImageFile);
      staticImageParts.push(personImagePart);
    }
    if (customModelFile) {
      const customModelPart = await fileToGenerativePart(customModelFile);
      staticImageParts.push(customModelPart);
    }
    
    // Create an array of promises, each with a potentially different prompt
    const generationPromises = Array.from({ length: variations }, (_, i) => {
      // For the food category, if more than one variation is requested,
      // and it's an 'image' theme, force the first one to have an open package.
      const shouldForceOpenPackage = category === 'food_beverage' && foodTheme === 'image' && variations > 1 && i === 0;

      const textPrompt = getPrompt(
        category, adStyle, photoFormat, aestheticStyle, modelGender, modelEthnicity, automotiveModification, carColor,
        vehicleType, customPrompt, customCarColor, colorTone, spoiler,
        wideBody, rims, hood, allBumper, livery, !!stickerFile,
        !!personImageFile, personMode, !!customModelFile,
        addModelToFood, objectStyle, addFoodEffects, shouldForceOpenPackage,
        foodTheme, productName, productSlogan, posterStyle, socialMediaHandle
      );

      const contentParts = [...staticImageParts, { text: textPrompt }];
      
      return genAI.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: contentParts,
        },
        config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
          // Add a random seed to ensure each generation is unique
          seed: Math.floor(Math.random() * 1000000),
        },
      });
    });
    
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

  } catch (error: any) {
    console.error("Error generating images with Gemini:", error);
    
    // Check for specific, user-friendly error messages
    if (error.message && (error.message.includes('RESOURCE_EXHAUSTED') || error.message.includes('quota'))) {
        throw new Error("Anda telah melebihi kuota API Anda saat ini. Pastikan penagihan (billing) telah diaktifkan untuk proyek Anda dan coba lagi.");
    }
    if (error.message && error.message.includes('API key not valid')) {
        throw new Error("API Key yang Anda gunakan tidak valid. Silakan pilih API key yang benar dan coba lagi.");
    }

    // Generic fallback
    throw new Error("Terjadi kesalahan tak terduga saat membuat foto iklan. Silakan coba lagi.");
  }
};