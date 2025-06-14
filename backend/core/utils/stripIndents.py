from typing import Any, Union, List
from textwrap import dedent


def strip_indents(*args: Union[str, List[str]]) -> str:
    """
    This function mimics the behavior of the TypeScript stripIndents function.
    It can handle both template strings (with embedded values) and regular strings.
    """
    if not args:
        return ""
    
    arg0 = args[0]
    values = args[1:]
    
    if isinstance(arg0, list):
        # Handle template string case
        processed_string = arg0[0]
        for i, value in enumerate(values):
            processed_string += str(value)
            if i < len(arg0) - 1:
                processed_string += arg0[i + 1]
        return _strip_indents(processed_string)
    elif isinstance(arg0, str):
        # Handle regular string case
        return _strip_indents(arg0)
    else:
        raise ValueError("Invalid input to strip_indents")


def _strip_indents(value: str) -> str:
    """
    Helper function to process the string and remove indentation.
    """
    # Split the string into lines, trim each line, and rejoin
    processed_lines = [line.strip() for line in value.split('\n')]
    
    # Join the lines back together
    result = '\n'.join(processed_lines)
    
    # Trim leading whitespace and trailing newlines
    result = result.lstrip()
    result = result.rstrip('\r\n')
    
    return result