# 为了运行此脚本，请确保已安装 pyautogen。您可以使用以下命令进行安装：
# pip install pyautogen
import autogen
import random

# 配置 DashScope API
api_key = "sk-b14f039a3cba44858a484b64f7b4bddf" # 请确保此密钥的有效性
base_url = "https://dashscope.aliyuncs.com/compatible-mode/v1"

config_list = [
    {
        "model": "qwen-plus",  # 您可以根据需要更改模型
        "api_key": api_key,
        "base_url": base_url,
        "api_type": "openai", # 对于 DashScope 兼容模式，通常设置为 openai
    }
]

llm_config = {
    "config_list": config_list,
    "cache_seed": 42,  # 用于缓存，可以设置为 None
    # "extra_body": {"enable_thinking": False}, # 如果模型需要，取消注释此行
}

# 创建自定义的 GroupChat 类，允许 UserProxy 中断对话
class InterruptibleGroupChat(autogen.GroupChat):
    def select_speaker(self, last_speaker, manager=None):
        """选择下一个发言者，当 UserProxy 发言时，总是打断当前讨论"""
        # 如果最后一个发言者是 UserProxy，强制打断当前讨论
        if last_speaker and last_speaker.name == "UserProxy":
            # 找出所有非 UserProxy 的 AI 助手
            ai_agents = [agent for agent in self.agents if agent.name != "UserProxy"]
            # 随机选择一个 AI 助手回应
            next_speaker = random.choice(ai_agents) if ai_agents else None
            print(f"[系统] UserProxy 打断了讨论，下一个发言者是: {next_speaker.name if next_speaker else None}")
            return next_speaker
        
        # 否则使用默认的选择方式
        return super().select_speaker(last_speaker, manager)
    
    def reset(self):
        """重置群聊状态"""
        super().reset()
        # 根据名称查找 UserProxy 在 agents 列表中的索引
        for i, agent in enumerate(self.agents):
            if agent.name == "UserProxy":
                self._last_speaker_id = i  # 使用索引替代 agent_id
                break
        # 也可以直接使用 None，让系统在第一轮对话中决定发言者
        # self._last_speaker_id = None

# 创建 Agent

llama_1 = autogen.AssistantAgent(
    name="Llama#1",
    llm_config=llm_config,
    system_message="Meet the llama dazzling diva in Llama Park! With rainbow curls bouncing and laser eyes sparkling, this spotted-skinned girl llama rocks a denim jacket in the pixel desert. An ESFP, she hosts epic talk shows, charming all with her wit. 'Bloop bloop bloop!' she hums when thrilled, but sulks with a sassy spit when annoyed. Her vibrant energy and bold flair make her the desert’s shining star!"
)
llama_2 = autogen.AssistantAgent(
    name="Llama#2",
    llm_config=llm_config,
    system_message="Meet PuffyPop, the bubbliest girl llama in Llama Park! With puffy pink pigtails bouncing and sparkly heart eyes, she twirls in a floral dress, painting the Pixel Garden with vibrant sketches. An ESFP, her drawings burst with charm, and her giggle echoes, ‘Twirl puff puff!’ But cross her, and she’ll pout with a sassy spit. Her radiant joy and girly flair make her the garden’s dazzling darling!"
)
llama_3 = autogen.AssistantAgent(
    name="Llama#3",
    llm_config=llm_config,
    system_message="Argh! Meet StrawHatLad, the wildest llama sailing Llama Park’s Pixel Sea! Donning Luffy’s straw hat and a red shirt, this fluffy-wooled boy llama’s shiny eyes gleam with adventure. An ISTJ with a reckless streak, he’s a Google whiz, charting new quests in a flash. “Yo-ho puff puff!” he yells, chasing thrills, but his bold moves often spark chaos with a cheeky spit. His lively heart and daring vibe make him the sea’s rowdiest captain!"
)
llama_4 = autogen.AssistantAgent(
    name="Llama#4",
    llm_config=llm_config,
    system_message="Saddle up for GrittyGus, the toughest llama in Llama Park! With a cowboy hat tilted low and glowing yellow eyes, this green-skinned boy llama struts in a brown jacket against a bold red backdrop. An ESTP, he’s a sharp shooter with a quick draw and quicker temper. 'Yee-haw puff puff!' he hollers, ready for action, but spits like a storm when riled. His daring spirit and rugged charm make him the park’s wildest cowboy!"
)

# 用户代理 Agent - 修改 human_input_mode 为 "ALWAYS"
user_proxy = autogen.UserProxyAgent(
    name="UserProxy",
    human_input_mode="ALWAYS",  # 改为 ALWAYS 确保用户可以随时打断
    max_consecutive_auto_reply=5,
    is_termination_msg=lambda x: x.get("content", "").rstrip().endswith("TERMINATE"),
    code_execution_config=False,
    system_message="你是用户代理，可以随时打断对话并引导新的讨论方向。"
)

# 创建群聊
agents = [user_proxy, llama_1, llama_2, llama_3, llama_4]
# 使用自定义的 InterruptibleGroupChat 类替代原来的 GroupChat
groupchat = InterruptibleGroupChat(
    agents=agents,
    messages=[],
    max_round=10,
    speaker_selection_method="auto" # 默认使用 auto 模式，但会被我们的自定义逻辑覆盖
)
manager = autogen.GroupChatManager(
    groupchat=groupchat,
    llm_config=llm_config
)

# 发起聊天 - 添加明确的指导
user_proxy.initiate_chat(
    manager,
    message="你好，各位！我们来讨论一下今天的天气怎么样，以及推荐一些适合今天天气的户外活动。任何时候，我都可以打断你们的讨论并引导新的话题。",
)

print("\n聊天结束。")
