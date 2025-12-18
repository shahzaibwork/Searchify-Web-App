

export const fetchImages = async (query) => {

    const apiKey = process.env.UNSPLASH_KEY; 
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${apiKey}&per_page=30`; // Fetch 50 images
    
    try {
      
      const response = await fetch(url);
      const data = await response.json();
  
      // Extract image URLs from the API response
      const imageUrls = data.results.map(result => result.urls.regular);
      return imageUrls; 
    } catch (error) {
      console.error("Error fetching images:", error);
      return []; 
    }
  }

export const updateProductImageUrls = async (products, imageUrls) => {

    return products.map(product => {

      if (!product.imageUrl.startsWith("https://")) {

        const randomImageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
        product.imageUrl = randomImageUrl;
      }
      return product;
    });
  }