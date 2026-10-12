from ddgs import DDGS
from typing import List
from .custom_types import WebResult

def search_web(query: str) -> List[WebResult]:
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

