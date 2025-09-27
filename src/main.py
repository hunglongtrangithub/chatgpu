import asyncio
from strands import Agent
from strands.models.ollama import OllamaModel
from strands_tools import calculator
from src.tools import get_current_time, search_gpu

# Ollama
ollama_host_url = "http://localhost:11434"
ollama_model = OllamaModel(host=ollama_host_url, model_id="llama3.1")

# System prompt
system_prompt = """
You are a helpful AI assistant, who only answers questions using the provided tools.
Available tools:
1. calculator: A tool for performing mathematical calculations.
2. get_current_time: A tool for getting the current time.
3. search_gpu: A tool for searching GPU specifications by name.
If you don't know the answer, just say you don't know. Do not try to make up an answer.
"""

# Initialize our agent without a callback handler
agent = Agent(
    system_prompt=system_prompt,
    model=ollama_model,
    tools=[calculator, get_current_time, search_gpu],
    callback_handler=None,
)


# Main chat loop
async def main_chat_loop():
    print("Welcome to the Ollama Agent chat! Type 'exit' to quit.")
    while True:
        user_input = input("You: ").strip()
        if user_input.lower() == "exit":
            print("Goodbye!")
            break
        print("Agent: ", end="", flush=True)
        async for event in agent.stream_async(user_input):
            # if "event" in event:
            #     print(f"\nEvent: {event['event']}")
            # if "current_tool_use" in event:
            #     tool = event["current_tool_use"]
            #     print(
            #         f"\nAgent is using tool: {tool['name']} with input: {tool['input']}",
            #         end="\n",
            #         flush=True,
            #     )
            if "data" in event:
                print(f"{event['data']}", end="", flush=True)
        print()  # New line after agent response


if __name__ == "__main__":
    asyncio.run(main_chat_loop())
