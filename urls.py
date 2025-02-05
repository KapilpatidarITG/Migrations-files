import requests
from bs4 import BeautifulSoup

# Target URL jahan se products scrape karne hain
url = "https://infinitypipeproducts.com/shop/"  # Yahan apna actual URL daalein

# Page se HTML content ko request karein
response = requests.get(url)
soup = BeautifulSoup(response.content, "html.parser")

# Saare <h2> tags jisme class "product-title" ho, unke andar ke <a> tags select karein
products = soup.find_all("h2", class_="product-title")

# Har product se URL aur title extract karein
for product in products:
    link = product.find("a")
    if link:
        product_url = link.get("href")
        product_title = link.get_text(strip=True)
        print(f"Title: {product_title}")
        print(f"URL: {product_url}")
        print("-" * 50)
