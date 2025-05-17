import os
from openai import OpenAI


def get_response(messages):
    client = OpenAI(
        # 若没有配置环境变量，请用阿里云百炼API Key将下行替换为：api_key="sk-xxx",
        api_key="sk-b14f039a3cba44858a484b64f7b4bddf",
        base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
    )
    # 模型列表：https://help.aliyun.com/zh/model-studio/getting-started/models
    completion = client.chat.completions.create(model="qwen-plus", messages=messages)
    return completion

def process_user_message(messages, user_input):
    """处理用户消息并获取模型回复"""
    # 将用户问题信息添加到messages列表中
    messages.append({"role": "user", "content": user_input})
    completion = get_response(messages)
    assistant_output = completion.choices[0].message.content
    # 将大模型的回复信息添加到messages列表中
    messages.append({"role": "assistant", "content": assistant_output})
    
    # 检查是否完成信息收集
    is_completed = "我已了解您的购买意向" in assistant_output
    
    return messages, assistant_output, is_completed