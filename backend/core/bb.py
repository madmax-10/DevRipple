from openai import OpenAI
import utils.sysrem as systemPrompt
from utils.prompts import nodeJs,nextJs,reactJs


# print(nodeJs.lower().strip()==reactJs.lower().strip())
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="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"  # Use your OpenRouter API key
)

streamMes = client.chat.completions.create(
    model="deepseek/deepseek-r1-0528:free",
    messages=
    [
        {"role": "system", "content": f"I will give you a prompt inside <prompt> tag. Just answer among the three: \"reactJs\", \"nodeJs\", \"nextJs\". Do not answer anything else. <Prompt> Create a todo app with node js. </Prompt>"},
    ],
    temperature=0.0,  # Optional, adjust as needed
)
platformPrompt=None
platform=streamMes.choices[0].message.content.lower().strip()
if platform == "nodejs":
    platformPrompt = nodeJs
elif platform == "nextjs":
    platformPrompt = nextJs
elif platform == "reactjs":
    platformPrompt = reactJs
else:
    raise ValueError(f"Unknown platform: {platform}")

stream = client.chat.completions.create(
    model="deepseek/deepseek-r1-0528:free",
    messages=
    [
        {"role": "system", "content": systemPrompt.get_system_prompt()},
        {"role": "user", "content":  platformPrompt},
        {"role": "user", "content": "For all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.\n\nBy default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.\n\nUse icons from lucide-react for logos."},
        {"role": "user", "content": "Create a music listening app with next.js.\n\n<-- M391YLV6GngX3Myc2iwMX9lI -->\n\n<-- nwALEkrNSi94GUCOHmx2oDnY -->\n\n### Additional Context ###\n\n<bolt_running_commands>\n</bolt_running_commands>\n\n<file_changes>\nThis section lists all files that have been created, modified, or deleted since the initial project files were provided.\n\nThe information here supersedes the content of corresponding files listed in the <project_files> section.\n\nFor any file path NOT listed below, assume its content is unchanged from the <project_files> listing.\n\nUse this section in conjunction with the <project_files> to:\n  - Accurately understand the latest state of all files\n  - Ensure your suggestions build upon the most recent version of the files\n  - Make informed decisions about changes\n  - Ensure suggestions are compatible with existing code\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n- .bolt/config.json\n</file_changes>"},
    ],
    max_tokens=80000,
    temperature=0.1,# Optional, adjust as needed
    stream=True,  # 🔥 Key line
   
)

# 🔁 Read streaming chunks
for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
