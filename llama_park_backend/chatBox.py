import os
from openai import OpenAI
from http import HTTPStatus
from dashscope import Application
import requests

qwen_api_key="sk-b14f039a3cba44858a484b64f7b4bddf"
llama_search_appID="81856ba7c4d54a5e9b5f5c3490fa6c19"
llama_draw_appID="f2cd77b90e704b06aab8b7415159f36c"


def get_response(messages):
    client = OpenAI(
        # 若没有配置环境变量，请用阿里云百炼API Key将下行替换为：api_key="sk-xxx",
        api_key=qwen_api_key,
        base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
    )
    # 模型列表：https://help.aliyun.com/zh/model-studio/getting-started/models
    completion = client.chat.completions.create(model="qwen-plus", messages=messages)
    return completion

def drawing_mcp_call(messages):
    response = Application.call(
    # 若没有配置环境变量，可用百炼API Key将下行替换为：api_key="sk-xxx"。但不建议在生产环境中直接将API Key硬编码到代码中，以减少API Key泄露风险。
    api_key=qwen_api_key,
    app_id=llama_draw_appID,# 替换为实际的应用 ID
    prompt=messages)
    return response.output.text

def search_mcp_call(messages):
    print(f"hahaha, message if {messages}")
    response = Application.call(
    # 若没有配置环境变量，可用百炼API Key将下行替换为：api_key="sk-xxx"。但不建议在生产环境中直接将API Key硬编码到代码中，以减少API Key泄露风险。
    api_key=qwen_api_key,
    app_id=llama_search_appID,# 替换为实际的应用 ID
    prompt=messages)
    print(response.output.text)

    return response.output.text


def llamafactory_api_call(messages):
    """测试LLaMA-Factory API服务"""
    
    # API端点
    url = "http://127.0.0.1:5645/llamafactory_call"
    
    # 准备测试数据 - 聊天历史
    # messages = [
    #     {"role": "user", "content": "你好，请简单介绍一下你自己"},
    #     {"role": "assistant", "content": "Step aside—this llama’s making deals and winning like nobody else in Llama Park! Sporting those unmistakable blonde combover antennas and a gaze sharp enough to close any negotiation, he strides past the Mar-a-Lago skyline with unparalleled confidence. Clad in a custom tailored suit and his trademark red tie, he unlocks his Infinite Deal Pocket ability to pull out the biggest, best gadgets—tremendous time-travel calculators, luxurious snack dispensers, you name it—and always at the right moment. An ESTP through and through, he dives straight into action, thrives under pressure, and rallies every fuzzy companion with his huge charisma. “We’re going to make Llama Park great again!”"},
    #     {"role": "user", "content": "How to make a llama park great again?"}
    # ]
    
    # 准备请求数据
    payload = {"messages": messages}
    print(f"payload: {payload}")
    headers = {"Content-Type": "application/json"}
    
    print("正在发送请求到LLaMA-Factory API...")
    
    try:
        # 发送POST请求
        response = requests.post(url, json=payload, headers=headers)
        
        # 检查响应
        if response.status_code == 200:
            result = response.json()
            print("\n=== API调用成功 ===")
            print(type(result), "\n\n\n")
            print(f"模型回复: {result['response']}")
            return result['response']
        else:
            print(f"API调用失败，状态码: {response.status_code}")
            print(f"错误信息: {response.text}")
            
    except Exception as e:
        print(f"请求发生异常: {e}")


if __name__ == "__main__":
    # 测试
    messages = [
        {"role": "user", "content": "你好，请简单介绍一下你自己"},
        {"role": "assistant", "content": "Step aside—this llama’s making deals and winning like nobody else in Llama Park! Sporting those unmistakable blonde combover antennas and a gaze sharp enough to close any negotiation, he strides past the Mar-a-Lago skyline with unparalleled confidence. Clad in a custom tailored suit and his trademark red tie, he unlocks his Infinite Deal Pocket ability to pull out the biggest, best gadgets—tremendous time-travel calculators, luxurious snack dispensers, you name it—and always at the right moment. An ESTP through and through, he dives straight into action, thrives under pressure, and rallies every fuzzy companion with his huge charisma. “We’re going to make Llama Park great again!”"},
        {"role": "user", "content": "How to make a llama park great again?"}
    ]
    
    # completion = search_mcp_call(messages)
    # print(completion)

    # 测试 llamafactory_api_call
    response = llamafactory_api_call(messages)
    # print(f"llamafactory_api_call 返回: {response}")
