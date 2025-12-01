"""
Meta Llama API Client
Uses HuggingFace Inference API
"""
import requests
from config import config
from utils.logger import setup_logger
from utils.exceptions import APIError

logger = setup_logger(__name__)


class MetaLlamaClient:
    """Meta Llama API Client"""
    
    def __init__(self):
        self.token = config.META_LLAMA_TOKEN
        # Use HuggingFace Router API endpoint (new version)
        self.api_url = "https://router.huggingface.co/v1/chat/completions"
        self.model = "meta-llama/Meta-Llama-3-8B-Instruct"
        
        if not self.token:
            logger.warning("Meta Llama token not configured - story generation will be disabled")
            self.token = None
    
    def generate_story(self, prompt: str, max_tokens: int = 150, temperature: float = 0.7) -> str:
        """
        Generate story
        
        Args:
            prompt: Prompt text
            max_tokens: Maximum number of tokens
            temperature: Temperature parameter (controls creativity)
        
        Returns:
            Generated story text
        
        Raises:
            APIError: API call failed
        """
        if not self.token:
            raise APIError("Meta Llama token not configured")
        
        try:
            # Build prompt (add system prompt for better story)
            full_prompt = f"""Write a short backstory (about 100 words) for a character.

{prompt}

Write a creative and engaging backstory:"""
            
            headers = {
                "Authorization": f"Bearer {self.token}",
                "Content-Type": "application/json"
            }
            
            # Use new Router API format (OpenAI compatible format)
            payload = {
                "model": self.model,
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a creative writer who writes engaging character backstories."
                    },
                    {
                        "role": "user",
                        "content": full_prompt
                    }
                ],
                "max_tokens": max_tokens,
                "temperature": temperature
            }
            
            response = requests.post(
                self.api_url,
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                # Router API return format (OpenAI compatible): {"choices": [{"message": {"content": "..."}}]}
                if "choices" in result and len(result["choices"]) > 0:
                    story = result["choices"][0]["message"]["content"].strip()
                    if story:
                        logger.info(f"Successfully generated story: {len(story)} characters")
                        return story
                    else:
                        raise APIError("Empty response from HuggingFace API")
                else:
                    raise APIError(f"Unexpected response format: {result}")
            elif response.status_code == 503:
                # Model is loading, need to wait
                error_msg = response.json().get("error", "Model is loading")
                logger.warning(f"Model is loading: {error_msg}")
                raise APIError(f"Model is currently loading. Please try again in a few moments.")
            else:
                error_msg = response.json() if response.content else response.text
                logger.error(f"HuggingFace API error (status {response.status_code}): {error_msg}")
                raise APIError(f"HuggingFace API error (status {response.status_code}): {error_msg}")
        
        except requests.exceptions.Timeout:
            logger.error("HuggingFace API request timeout")
            raise APIError("HuggingFace API request timeout")
        except requests.exceptions.RequestException as e:
            logger.error(f"HuggingFace API request failed: {str(e)}")
            raise APIError(f"HuggingFace API request failed: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error in generate_story: {str(e)}", exc_info=True)
            raise APIError(f"Unexpected error in generate_story: {str(e)}")

