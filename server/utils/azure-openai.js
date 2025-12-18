import { AzureOpenAI } from 'openai'
import dotenv from 'dotenv'
        
dotenv.config({
    path: `${process.cwd()}/.env`
}) 

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;  
const apiKey = process.env.AZURE_OPENAI_API_KEY;  
const apiVersion = "2024-05-01-preview";  
const deployment = "gpt-35-turbo"; // This must match your deployment name


const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });  


export const promptOpenAi = async (msgs) => {  

    

    const result = await client.chat.completions.create({  
        messages: msgs,  
        max_tokens: 800,  
        temperature: 0.7,  
        top_p: 0.95,  
        frequency_penalty: 0,  
        presence_penalty: 0,  
        stop: null,
        response_format: { type:  'json_object'}  
    });  


    if(result.choices[0].message.content){
        const parsedResponse = JSON.parse(result.choices[0].message.content)
        return parsedResponse
    }else{
        throw Error("The response from OpenAi not in Json")
    }

    
}  



