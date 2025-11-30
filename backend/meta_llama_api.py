import os
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")
def story_generator(prompt):
    client = InferenceClient(
        model="meta-llama/Meta-Llama-3-8B-Instruct",
        token=HF_TOKEN
    )

    result = client.chat_completion(
        messages=[
            {"role": "user", "content": prompt},
        ],
        max_tokens=150,   # length of generation
        temperature=0.7   # how creative the AI can be
    )
    #print(result.choices[0].message["content"])  #used for testing