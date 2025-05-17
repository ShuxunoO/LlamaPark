import requests
import json
import time
import logging
import sys

# 配置日志
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# API 服务地址
API_URL = "http://127.0.0.1:6006/api/llamachat"

def test_llama_chat_api():
    """测试 LLama Chat API 的功能"""
    logger.info("开始测试 LLama Chat API...")
    
    # 测试用例列表
    test_cases = [
        {
            "name": "正常请求测试",
            "data": {
                "user_addr": "0x123456789abcdef",
                "NFT_ID": "Llama Park #0",
                "messages": "你好，请介绍一下你自己"
            },
            "expected_status": 200
        },
        {
            "name": "多轮对话测试",
            "data": {
                "user_addr": "0x123456789abcdef",
                "NFT_ID": "Llama Park #0",
                "messages": "你喜欢什么颜色？"
            },
            "expected_status": 200
        },
        {
            "name": "不同NFT测试",
            "data": {
                "user_addr": "0x123456789abcdef",
                "NFT_ID": "Llama Park #1",
                "messages": "你有什么特别的能力？"
            },
            "expected_status": 200
        },
        {
            "name": "无效NFT_ID测试",
            "data": {
                "user_addr": "0x123456789abcdef",
                "NFT_ID": "不存在的ID",
                "messages": "你好"
            },
            "expected_status": 500
        },
        {
            "name": "空消息测试",
            "data": {
                "user_addr": "0x123456789abcdef",
                "NFT_ID": "Llama Park #0",
                "messages": ""
            },
            "expected_status": 200
        }
    ]
    
    # 执行测试用例
    for test_case in test_cases:
        logger.info(f"执行测试: {test_case['name']}")
        
        try:
            # 发送请求
            response = requests.post(
                API_URL,
                json=test_case["data"],
                headers={"Content-Type": "application/json"}
            )
            
            # 检查状态码
            if response.status_code == test_case["expected_status"]:
                logger.info(f"测试通过: 状态码 {response.status_code}")
                
                # 检查响应内容
                try:
                    result = response.json()
                    if test_case["expected_status"] == 200:
                        if result["status"] == "success" and "message" in result:
                            logger.info(f"响应成功: {result['message'][:50]}...")
                        else:
                            logger.error(f"响应格式错误: {result}")
                    else:
                        if result["status"] == "error" and "message" in result:
                            logger.info(f"预期的错误响应: {result['message']}")
                        else:
                            logger.error(f"错误响应格式不正确: {result}")
                except json.JSONDecodeError:
                    logger.error(f"返回的不是有效的JSON: {response.text}")
            else:
                logger.error(f"测试失败: 预期状态码 {test_case['expected_status']}, 实际状态码 {response.status_code}")
                logger.error(f"响应内容: {response.text}")
                
        except requests.RequestException as e:
            logger.error(f"请求异常: {str(e)}")
        
        # 在测试之间添加短暂延迟，避免请求过于频繁
        time.sleep(1)
    
    logger.info("测试完成")

def test_performance():
    """测试 API 的性能"""
    logger.info("开始性能测试...")
    
    # 性能测试参数
    num_requests = 5
    test_data = {
        "user_addr": "0x123456789abcdef",
        "NFT_ID": "Llama Park #0",
        "messages": "简单地介绍一下Llama Park"
    }
    
    # 记录开始时间
    start_time = time.time()
    
    # 发送多个请求
    success_count = 0
    response_times = []
    
    for i in range(num_requests):
        logger.info(f"发送请求 {i+1}/{num_requests}")
        req_start = time.time()
        
        try:
            response = requests.post(
                API_URL,
                json=test_data,
                headers={"Content-Type": "application/json"}
            )
            
            req_end = time.time()
            response_time = req_end - req_start
            response_times.append(response_time)
            
            if response.status_code == 200:
                success_count += 1
                logger.info(f"请求成功，响应时间: {response_time:.2f}秒")
            else:
                logger.error(f"请求失败，状态码: {response.status_code}")
                
        except requests.RequestException as e:
            logger.error(f"请求异常: {str(e)}")
        
        # 避免请求过于频繁
        time.sleep(1)
    
    # 计算统计信息
    total_time = time.time() - start_time
    success_rate = (success_count / num_requests) * 100
    
    if response_times:
        avg_response_time = sum(response_times) / len(response_times)
        max_response_time = max(response_times)
        min_response_time = min(response_times)
    else:
        avg_response_time = max_response_time = min_response_time = 0
    
    # 输出性能统计
    logger.info(f"性能测试完成:")
    logger.info(f"总请求数: {num_requests}")
    logger.info(f"成功请求数: {success_count}")
    logger.info(f"成功率: {success_rate:.2f}%")
    logger.info(f"总耗时: {total_time:.2f}秒")
    logger.info(f"平均响应时间: {avg_response_time:.2f}秒")
    logger.info(f"最大响应时间: {max_response_time:.2f}秒")
    logger.info(f"最小响应时间: {min_response_time:.2f}秒")

if __name__ == "__main__":
    # 检查是否指定了特定测试
    if len(sys.argv) > 1 and sys.argv[1] == "performance":
        test_performance()
    else:
        test_llama_chat_api()
        
        # 如果需要同时运行性能测试，取消下面的注释
        # test_performance()
