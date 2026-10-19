import time
from ddgs import DDGS
from typing import List
from .custom_types import WebResult
import logging

def search_web(query: str) -> List[WebResult]:

    # the following loops the code 5 times unless successful
    # (5 attempts max, basically)
    
    for i in range(5):
        try:
            with DDGS() as ddgs:
                raw_results = ddgs.text(query, max_results=10)

                web_results: List[WebResult] = []
                
                for result in raw_results:

                    web_result: WebResult = {
                        "title": result["title"],
                        "url": result["href"],
                        "body": result["body"]
                    }

                    web_results.append(web_result)

                return web_results

        except Exception as e:
            
            logger = logging.getLogger(__name__)
            logger.exception(f"Web search failed")

            if i == 4: raise RuntimeError("Gave up search after 5 attempts. Search service may be currently unavailable.")

        time.sleep(0.1)

    return []

