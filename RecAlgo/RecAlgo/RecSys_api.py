import json
import requests
import lmstudio as lms
import pandas as pd
from dotenv import load_dotenv
import os
from fastapi import FastAPI
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List


load_dotenv()
primary_api_key = os.getenv("PRIMARY_API_KEY")
fallback_api_key = os.getenv("FALLBACK_API_KEY")


df = pd.read_csv(r"D:\My Engineering\TE_MiniProject\EcommWebApp-main_v2_priyanshu\EcommWebApp-main\RecAlgo\RecAlgo\NewDataset2_reindexed.csv")


current_structured_query = " "
taxonomy = {
    "Shoes": {
        "sub_categories": {
            "Sneakers": {"brands": ["Nike", "Adidas", "Puma", "Reebok"]},
            "Formal Shoes": {"brands": ["Bata", "Hush Puppies", "Woodland", "Red Tape"]},
            "Boots": {"brands": ["Timberland", "Dr. Martens", "Red Wing", "Wolverine"]},
            "Sandals": {"brands": ["Bata", "Relaxo", "Paragon", "Liberty"]}
        }
    },
    "Clothing": {
        "sub_categories": {
            "T-Shirts": {"brands": ["Nike", "Adidas", "Levi's", "H&M"]},
            "Jeans": {"brands": ["Levi's", "Wrangler", "Lee", "Pepe Jeans"]},
            "Shirts": {"brands": ["Allen Solly", "Van Heusen", "Park Avenue", "Peter England"]},
            "Jackets": {"brands": ["The North Face", "Patagonia", "Columbia", "Zara"]}
        }
    },
    "Electronics": {
        "sub_categories": {
            "Laptops": {"brands": ["Dell", "HP", "Lenovo", "Asus"]},
            "Smartphones": {"brands": ["Samsung", "Xiaomi", "OnePlus", "Realme"]},
            "Tablets": {"brands": ["Apple", "Samsung", "Microsoft", "Lenovo"]},
            "Headphones": {"brands": ["Bose", "Sony", "Sennheiser", "JBL"]}
        }
    }
}

rules = """
Rules:
1. For the "category" field, search for an exact (case-insensitive) match against the taxonomy keys ("Shoes", "Clothing", "Electronics"). If found, set "category" to that value; otherwise, use an empty string.
2. For the "sub_category" field, if the query contains one or more exact matches (case-insensitive) for the sub-categories under the identified category, output them as a list; if none are found, output an empty list.
3. For the "brand" field, output an object with keys "include" and "exclude". Only use allowed brands from the taxonomy for the identified sub-category. For any brand mentioned without negation, add it to "include". For any brand mentioned with negation (e.g., "not Nike"), add just the brand name ("Nike") to "exclude". If no brand is mentioned, both lists should be empty.
4. For the "color" field, output an object with keys "include" and "exclude". Allowed colors: red, blue, white, black, brown, tan. If a color is mentioned in a positive context, add it to "include". If a color is negated (e.g., "not red"), add the color ("red") to "exclude". If no color is mentioned, both lists should be empty.
5. For the "price" field, output an object that may include "min" and/or "max". Interpret:
   - "under X rupees" as {"max": X}
   - "over X rupees" as {"min": X}
   - "between X rupees and Y rupees" as {"min": X, "max": Y}
   If no price condition is provided, use {}.
6. For any field not specified, use an empty string for "category", an empty list for "sub_category", empty lists for both "include" and "exclude" in "brand" and "color", and {} for "price".
"""

examples = [
    {
        "query": "I want blue or black Adidas sneakers under 50000 rupees",
        "structured": {
            "category": "Shoes",
            "sub_category": ["Sneakers"],
            "brand": {"include": ["Adidas"], "exclude": []},
            "color": {"include": ["blue", "black"], "exclude": []},
            "price": {"max": 50000}
        }
    },
    {
        "query": "I do not want red shoes but I prefer Nike ones",
        "structured": {
            "category": "Shoes",
            "sub_category": [],
            "brand": {"include": ["Nike"], "exclude": []},
            "color": {"include": [], "exclude": ["red"]},
            "price": {}
        }
    },
    {
        "query": "Show me HP laptops over 100000 rupees",
        "structured": {
            "category": "Electronics",
            "sub_category": ["Laptops"],
            "brand": {"include": ["HP"], "exclude": []},
            "color": {"include": [], "exclude": []},
            "price": {"min": 100000}
        }
    },
    {
        "query": "Nike or Adidas sneakers",
        "structured": {
            "category": "Shoes",
            "sub_category": ["Sneakers"],
            "brand": {"include": ["Nike", "Adidas"], "exclude": []},
            "color": {"include": [], "exclude": []},
            "price": {}
        }
    }
]
examples_str = json.dumps(examples, indent=2)

def create_initial_prompt(user_query):
    return f"""
    You are a helpful assistant that converts free-form user queries into a structured JSON query.
    Output only the final JSON object and nothing else.
    Do not include any chain-of-thought, explanation, or reasoning.
  
    Taxonomy:
    {json.dumps(taxonomy, indent=2)}
  
    {rules}
  
    Examples:
    {examples_str}
  
    Now, convert the following user query into a structured JSON query:
    User Query: {user_query}
    """

def create_update_prompt(user_query):
    return f"""
    You are a helpful assistant that updates a structured JSON query based on new user requirements.
    Below is the current structured query:
    {json.dumps(current_structured_query, indent=2)}
  
    User: "{user_query}"
  
    Update the structured query accordingly.
    Output only the final JSON object and nothing else.
    """

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    prompt: str
    index: int

@app.post("/query")
def query_products(request: QueryRequest):
    global current_structured_query
    if request.index == 0:
        initial_prompt = create_initial_prompt(request.prompt)
        structured_query = create_structured_query(initial_prompt)
    else:
        update_prompt = create_update_prompt(request.prompt)
        structured_query = create_structured_query(update_prompt)
    
    current_structured_query = structured_query
    result_df = filter_products(structured_query)
    return {"product_ids": result_df["product_id"].tolist()}

def send_query(model, content):
    primary_key = f"Bearer {primary_api_key}"
    fallback_key = f"Bearer {fallback_api_key}"
    url = "https://openrouter.ai/api/v1/chat/completions"
    
    payload = json.dumps({
        "model": model,
        "messages": [
            {"role": "user", "content": content}
        ],
    })
    
    headers_primary = {
        "Authorization": primary_key,
        "Content-Type": "application/json",
    }
    headers_fallback = {
        "Authorization": fallback_key,
        "Content-Type": "application/json",
    }
    
    try:
        response = requests.post(url, headers=headers_primary, data=payload)
        if response.status_code != 200:
            print("Primary API key failed with status code:", response.status_code)
            try:
                error_info = response.json()
                print("Error details:", error_info)
            except Exception:
                print("No JSON error details available.")
            raise Exception("Primary key request failed")
        else:
            return response
    except Exception as e:
        print("Primary API key encountered an error:", e)
        print("Falling back to secondary API key.")
        response = requests.post(url, headers=headers_fallback, data=payload)
        if response.status_code != 200:
            print("Fallback API key also failed with status code:", response.status_code)
            raise Exception("Both API keys failed")
        return response

def create_structured_query(content):
    model1 = "qwen/qwen-2.5-72b-instruct:free"
    model2 = "microsoft/phi-3-medium-128k-instruct:free"
    model3 = "meta-llama/llama-3-8b-instruct:free"
    model4 = "qwen2.5-7b-instruct-mlx"

    try:
        response = send_query(model1, content)
        if response.status_code == 200:
            structured_text = response.json()['choices'][0]['message']['content']
            return json.loads(structured_text)
    except:
        pass
    
    try:
        response = send_query(model2, content)
        if response.status_code == 200:
            structured_text = response.json()['choices'][0]['message']['content']
            return json.loads(structured_text)
    except:
        pass
    
    try:
        response = send_query(model3, content)
        if response.status_code == 200:
            structured_text = response.json()['choices'][0]['message']['content']
            return json.loads(structured_text)
    except:
        pass
    
    try:
        model = lms.llm(model4)
        result = model.respond(content)
        return json.loads(result.content)
    except:
        return {}

def filter_products(structured_query, min_candidates: int = 3):
    filtered_df = df.copy()
    
    def check_termination(filtered):
        return len(filtered) <= min_candidates

    # 1. Filter by Category
    if structured_query.get("category"):
        filtered_df = filtered_df[filtered_df["category"].str.lower() == structured_query["category"].lower()]
        if check_termination(filtered_df):
            return filtered_df.head(min_candidates)
    
    # 2. Filter by Sub-Category
    if structured_query.get("sub_category"):
        sub_cats = [s.lower() for s in structured_query["sub_category"]]
        filtered_df = filtered_df[filtered_df["sub_category"].str.lower().isin(sub_cats)]
        if check_termination(filtered_df):
            return filtered_df.head(min_candidates)
    
    # 3. Filter by Price
    price_filter = structured_query.get("price", {})
    if price_filter:
        if "min" in price_filter:
            filtered_df = filtered_df[filtered_df["price"] >= price_filter["min"]]
        if "max" in price_filter:
            filtered_df = filtered_df[filtered_df["price"] <= price_filter["max"]]
        if check_termination(filtered_df):
            return filtered_df.head(min_candidates)
    
    # 4. Filter by Excludes
    brand_excludes = structured_query.get("brand", {}).get("exclude", [])
    if brand_excludes:
        brand_excludes = [b.lower() for b in brand_excludes]
        filtered_df = filtered_df[~filtered_df["brand"].str.lower().isin(brand_excludes)]
    
    color_excludes = structured_query.get("color", {}).get("exclude", [])
    if color_excludes:
        color_excludes = [c.lower() for c in color_excludes]
        filtered_df = filtered_df[~filtered_df["color"].str.lower().isin(color_excludes)]
    
    if check_termination(filtered_df):
        return filtered_df.head(min_candidates)
    
    # 5. Filter by Color Includes
    color_includes = structured_query.get("color", {}).get("include", [])
    if color_includes:
        color_includes = [c.lower() for c in color_includes]
        filtered_df = filtered_df[filtered_df["color"].str.lower().isin(color_includes)]
        if check_termination(filtered_df):
            return filtered_df.head(min_candidates)
    
    # 6. Filter by Brand Includes
    brand_includes = structured_query.get("brand", {}).get("include", [])
    if brand_includes:
        brand_includes = [b.lower() for b in brand_includes]
        filtered_df = filtered_df[filtered_df["brand"].str.lower().isin(brand_includes)]
        if check_termination(filtered_df):
            return filtered_df.head(min_candidates)
    
    # Final sorting
    if len(filtered_df) > min_candidates:
        filtered_df = filtered_df.groupby('rating', group_keys=False).apply(
            lambda x: x.sample(frac=1, random_state=43))
        filtered_df = filtered_df.sort_values(by='rating', ascending=False)
    
    return filtered_df.head(min_candidates)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
