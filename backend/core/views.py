# api/views.py
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from openai import OpenAI
from .utils import sysrem as systemPrompt
from .utils.prompts import nodeJs, nextJs, reactJs
from .utils import stripIndents

class aiResponse(APIView):
    
    def post(self, request):
    
        user_prompt = request.data.get("enhanced_prompt", "").strip()
        platformPrompt = request.data.get("platform_prompt", "").strip()
        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=settings.OPENROUTER_API_KEY,  # Use your OpenRouter API key
        )

        stream = client.chat.completions.create(
        model="deepseek/deepseek-r1-0528:free",
        messages=
        [
            {"role": "system", "content": systemPrompt.get_system_prompt()},
            {"role": "user", "content":  platformPrompt},
            {"role": "user", "content": "For all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.\n\nBy default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.\n\nUse icons from lucide-react for logos."},
            {"role": "user", "content": f"{user_prompt}\n\n<-- M391YLV6GngX3Myc2iwMX9lI -->\n\n<-- nwALEkrNSi94GUCOHmx2oDnY -->\n\n### Additional Context ###\n\n<bolt_running_commands>\n</bolt_running_commands>\n\n<file_changes>\nThis section lists all files that have been created, modified, or deleted since the initial project files were provided.\n\nThe information here supersedes the content of corresponding files listed in the <project_files> section.\n\nFor any file path NOT listed below, assume its content is unchanged from the <project_files> listing.\n\nUse this section in conjunction with the <project_files> to:\n  - Accurately understand the latest state of all files\n  - Ensure your suggestions build upon the most recent version of the files\n  - Make informed decisions about changes\n  - Ensure suggestions are compatible with existing code\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n- .bolt/config.json\n</file_changes>"},
        ],
        max_tokens=80000,
        temperature=0.1,# Optional, adjust as needed    
        )
        additionalCode = stream.choices[0].message.content.strip()
        return Response({"additionalCode": additionalCode}, status=200)
        

    # # 🔁 Read streaming chunks
    # for chunk in stream:
    #     if chunk.choices[0].delta.content:
    #         print(chunk.choices[0].delta.content, end="", flush=True)

class promptTemplate(APIView):
    
    def post(self, request):
        
        user_prompt = request.data.get("message", "").strip()
        
        try:
            client = OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=settings.OPENROUTER_API_KEY,  # Use your OpenRouter API key            
            )

            streamMes = client.chat.completions.create(
                model="deepseek/deepseek-r1-0528:free",
                messages=
                [
                    {"role": "user", "content": f"I will give you a prompt inside <prompt> tag. Just answer among the three: \"reactJs\", \"nodeJs\", \"nextJs\". Do not answer anything else. <Prompt> {user_prompt} </Prompt>"},
                ],
                temperature=0.0,  # Optional, adjust as needed
            )
            platform=streamMes.choices[0].message.content.lower().strip()
            streamMes = client.chat.completions.create(
                model="deepseek/deepseek-r1-0528:free",
                messages=
                [
                    {"role": "user", "content": stripIndents.strip_indents(f'''I want you to improve the user prompt that is wrapped in \`<original_prompt>\` tags.

                    IMPORTANT: Only respond with the improved prompt and nothing else!

                    <original_prompt>
                        {user_prompt.strip()}
                    </original_prompt>''')
                    },
                ],
                temperature=0.0,  # Optional, adjust as needed
            )
            enhanced_prompt = streamMes.choices[0].message.content.strip()
            
            if platform == "nodejs":
                return Response({"filesTemplate": nodeJs,"prompt": enhanced_prompt}, status=200)
            elif platform == "nextjs":
                return Response({"filesTemplate": nextJs, "prompt": enhanced_prompt }, status=200)
            elif platform == "reactjs":
                return Response({"filesTemplate": reactJs, "prompt": enhanced_prompt }, status=200)
            else:
                raise ValueError(f"Unknown platform: {platform}")
            
        except Exception as e:
            return Response({"response": e}, status=500)
        
        
        
        
        
    
        # reply = completion.choices[0].message["content"].strip()
        # return Response({"response": reply}, status=200)
        # except Exception as e:
        #     return Response({"response": "AI is currently unavailable. Try again later."}, status=500)