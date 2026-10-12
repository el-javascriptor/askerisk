import subprocess
from pathlib import Path
import json
from .custom_types import ToolMessage, InteractionToolCall
import requests
from .browser_tools import search_web

CURRENT_DIR = Path(__file__).parent

class Tool:

    @staticmethod
    def run_command(command: str) -> str:
        """Runs a linux bash command and returns the output."""
        # pass the command to subprocess to run
        try:
            return subprocess.check_output(command, shell=True, text=True, stderr=subprocess.STDOUT)
        
        except subprocess.CalledProcessError as e:

            return f"Could not execute that command. Check your syntax, and make sure you have correct privileges. Error: \n{e.output}"

    @staticmethod
    def brainstorm(thoughts: str) -> str:
        
        return f"Thoughts: \n{thoughts}"

    @staticmethod
    def view_url(url: str) -> str:

        try:
            req = requests.get(url)

            return req.text

        except:

            return "Could not access that webpage's content."

    @staticmethod
    def search_web(query: str) -> str:
        results = search_web(query)
        tool_string = ""

        for result in results:
            tool_string += f"[{result['title']}]({result['url']})\n\t{result['body']}\n"

        return tool_string

    @staticmethod
    def make_display_name(name: str) -> str:

        words = name.split("_")
        
        display_name = ""

        for word in words:
            display_name += word.capitalize()

        return display_name

    @staticmethod
    def function_to_gemini_format(function):
        return {
            "type": "function",
            "name": function["function"]["name"],
            "description": function["function"]["description"],
            "parameters": function["function"]["parameters"]
        }

    @staticmethod
    def get_tools():
        tools = []

        with open(CURRENT_DIR / "../resources/tools.json", "r") as file:
            tools = json.load(file)

        return tools

    @staticmethod
    def gemini_format(ollama_tools):
        tools = []

        for tool in ollama_tools:
            tools.append(Tool.function_to_gemini_format(tool))

        return tools

    @staticmethod
    def run_tool(tool_info: InteractionToolCall):
        if tool_info['tool_called'] == "run_command":
            args = json.loads(tool_info['tool_arguments'])

            return Tool.run_command(args['command'])

        elif tool_info['tool_called'] == "brainstorm":
            args = json.loads(tool_info['tool_arguments'])

            return Tool.brainstorm(args['thoughts'])

        elif tool_info['tool_called'] == "view_url":
            args = json.loads(tool_info['tool_arguments'])

            return Tool.view_url(args['url'])

        elif tool_info['tool_called'] == "search_web":
            args = json.loads(tool_info['tool_arguments'])

            return Tool.search_web(args['query'])

        return ""

    @staticmethod
    def create_tool_message(tool_info: InteractionToolCall, result: str) -> ToolMessage:
        
        new_tool_message: ToolMessage = {
            "type": "function_result",
            "name": tool_info['tool_called'] if tool_info['tool_called'] else "",
            "call_id": tool_info['tool_call_id'] if tool_info['tool_call_id'] else "",
            "result": result
        }

        return new_tool_message
