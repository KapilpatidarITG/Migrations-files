import requests
from bs4 import BeautifulSoup
import json

# List of URLs to scrape
urls = [
    "https://infinitypipeproducts.com/product/80191-quick-coupler-universal-socket/",
    "https://infinitypipeproducts.com/product/80221-coupler-plug-industrial/"
    "https://infinitypipeproducts.com/product/82600-two-way-outlet-y-adapter-npt-x-npt/"
]

def extract_product_data(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')

        # Locate the form containing product data
        form = soup.find('form', class_='variations_form cart')
        if not form:
            return {"error": "No form found"}

        # Extract data attributes
        product_id = form.get('data-product_id')
        variations_data = form.get('data-product_variations')

        # Parse variations JSON
        variations = json.loads(variations_data)

        # Collect the required information
        products = []
        for variation in variations:
            products.append({
                "SKU": variation.get("sku"),
                "Price": variation.get("display_price"),
                "Image": variation.get("image", {}).get("src"),
                "Attributes": variation.get("attributes"),
                "Stock": variation.get("is_in_stock"),
            })

        return {
            "Product ID": product_id,
            "Variations": products
        }

    except Exception as e:
        return {"error": str(e)}

# Scrape data for all URLs
results = []
for url in urls:
    print(f"Scraping: {url}")
    product_data = extract_product_data(url)
    results.append({"URL": url, "Data": product_data})

# Save results to a JSON file
with open(' product_data.json', 'w') as f:
    json.dump(results, f, indent=4)

print("Scraping completed. Data saved to product_data.json")
