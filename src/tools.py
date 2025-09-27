from strands import tool


@tool(
    name="get_current_time",
    description="Get the current time as a string in the format YYYY-MM-DD HH:MM:SS",
)
def get_current_time() -> str:
    """Get the current time as a string."""
    from datetime import datetime

    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


@tool(
    name="search_gpu",
    description="Search for a GPU specification by name using fuzzy matching. Input should be the name of the GPU to search for.",
)
def search_gpu(name: str) -> str:
    """Search for a GPU specification by name using fuzzy matching."""
    try:
        from dbgpu import GPUDatabase
    except ImportError:
        raise ImportError(
            "dbgpu is required to search for GPU specifications. Run `pip install dbgpu` to install it."
        )
    database = GPUDatabase.default()
    spec = database.search(name)
    return str(spec)
