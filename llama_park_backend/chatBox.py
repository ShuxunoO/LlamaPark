import os
from openai import OpenAI
from http import HTTPStatus
from dashscope import Application

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
    app_id=llama_search_appID,# 替换为实际的应用 ID
    prompt=messages)
    # app_id=llama_search_appID,# 替换为实际的应用 ID
    # prompt='BTC 今天的价格是多少？')

    if response.status_code != HTTPStatus.OK:
        print(f'request_id={response.request_id}')
        print(f'code={response.status_code}')
        print(f'message={response.message}')
        print(f'请参考文档：https://help.aliyun.com/zh/model-studio/developer-reference/error-code')
    else:
        print(response.output.text)

def search_mcp_call(messages):
    response = Application.call(
    # 若没有配置环境变量，可用百炼API Key将下行替换为：api_key="sk-xxx"。但不建议在生产环境中直接将API Key硬编码到代码中，以减少API Key泄露风险。
    api_key=qwen_api_key,
    app_id=llama_draw_appID,# 替换为实际的应用 ID
    prompt=messages)
    # app_id=llama_search_appID,# 替换为实际的应用 ID
    # prompt='BTC 今天的价格是多少？')

    if response.status_code != HTTPStatus.OK:
        print(f'request_id={response.request_id}')
        print(f'code={response.status_code}')
        print(f'message={response.message}')
        print(f'请参考文档：https://help.aliyun.com/zh/model-studio/developer-reference/error-code')
    else:
        print(response.output.text)
