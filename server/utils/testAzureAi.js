import { promptOpenAi } from './azure-openai.js';

const schema = {
    product: "product name in string",
    maxPrice : { currency: "currency here", value: "price value in numbers here"  }
  }

const msgs = [
    {
      "role": "system",
      "content": `The user will describe what they want to shop for. Extract the product name with the brand if mentioned and maximum price they are willing to spend. 
      If the query doesn't mention a maximum price, set it to null. 
      Output the result as a JSON object according to this schema: ${JSON.stringify(schema)} and dont right anything else as the result that you 
      provide will be later parsed using JSON.parse( )
      `
    }
    
  ];

const response = await promptOpenAi(msgs, "Show me Lenovo gaming laptops under 1000$")


console.log(response)
console.log("response in object: ", response.product)