import asyncio
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig

async def main():
    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(
            url="https://www.amazon.com/s?k=iphone",
        )
        print(result.markdown)  # Show the first 300 characters of extracted text

if __name__ == "__main__":
    asyncio.run(main())