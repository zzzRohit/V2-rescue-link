import {string, z} from "zod";
export const reportschema = z.object({
    animalType : z
        .string()
        .trim(),

    description :z
        .string(),  
    phoneNumber : z
        .string()
        .regex(/^\d{10}$/, "Phone number must contain exactly 10 digits")  
        ,
    latitude : z,

    longitude :z,
    imageUrl : z
        .string()
        
    
})