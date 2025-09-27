import asyncio
from strands import Agent
from strands.models.ollama import OllamaModel
from strands_tools import calculator

# Ollama
ollama_host_url = "http://localhost:11434"
ollama_model = OllamaModel(host=ollama_host_url, model_id="llama3.1")

# Initialize our agent without a callback handler
agent = Agent(model=ollama_model, tools=[calculator], callback_handler=None)


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


if __name__ == "__main__":
    asyncio.run(main_chat_loop())
