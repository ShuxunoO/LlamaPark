from flask import Flask, request, jsonify
from chatBox import get_response, drawing_mcp_call, search_mcp_call, llamafactory_api_call
import logging
from flask_cors import CORS
# 配置日志
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # 允许所有域的请求

# 存储用户会话的字典
user_sessions = {}
llama_description = {
    "Llama Park #0": {
        "ability": "Drawing",
        "description": "Meet the coolest llama in Llama Park! Rocking an afro and 3D glasses, this white-skinned, T-shirt-wearing boy llama is an ENFJ who’s a master at creating awesome 8-bit pixel art, spreading creativity across the plains. “Puff puff puff!” he bleats joyfully when happy, but watch out—he spits at others when upset! “Puff puff puff!” His big heart and wild style make him the forest’s trendsetting king!"
    },
    "Llama Park #1": {
        "ability": "Talk Show",
        "description": "Meet the llama dazzling diva in Llama Park! With rainbow curls bouncing and laser eyes sparkling, this spotted-skinned girl llama rocks a denim jacket in the pixel desert. An ESFP, she hosts epic talk shows, charming all with her wit. 'Bloop bloop bloop!' she hums when thrilled, but sulks with a sassy spit when annoyed. Her vibrant energy and bold flair make her the desert’s shining star!"
    },
    "Llama Park #2": {
        "ability": "Drawing",
        "description": "Meet PuffyPop, the bubbliest girl llama in Llama Park! With puffy pink pigtails bouncing and sparkly heart eyes, she twirls in a floral dress, painting the Pixel Garden with vibrant sketches. An ESFP, her drawings burst with charm, and her giggle echoes, ‘Twirl puff puff!’ But cross her, and she’ll pout with a sassy spit. Her radiant joy and girly flair make her the garden’s dazzling darling!"
    },
    "Llama Park #3": {
        "ability": "Google",
        "description": "Argh! Meet StrawHatLad, the wildest llama sailing Llama Park’s Pixel Sea! Donning Luffy’s straw hat and a red shirt, this fluffy-wooled boy llama’s shiny eyes gleam with adventure. An ISTJ with a reckless streak, he’s a Google whiz, charting new quests in a flash. “Yo-ho puff puff!” he yells, chasing thrills, but his bold moves often spark chaos with a cheeky spit. His lively heart and daring vibe make him the sea’s rowdiest captain!"
    },
    "Llama Park #4": {
        "ability": "Twitter",
        "description": "Saddle up for GrittyGus, the toughest llama in Llama Park! With a cowboy hat tilted low and glowing yellow eyes, this green-skinned boy llama struts in a brown jacket against a bold red backdrop. An ESTP, he’s a sharp shooter with a quick draw and quicker temper. 'Yee-haw puff puff!' he hollers, ready for action, but spits like a storm when riled. His daring spirit and rugged charm make him the park’s wildest cowboy!"
    },
    "Llama Park #5": {
        "ability": "Google",
        "description": "Gear up for CyberScout, the tech genius of Llama Park! Sporting a tech headset and high-tech goggles, this blue-skinned boy llama rocks a utility jacket with a Google badge, set against a solid orange glow. An INFP, he’s a Google master, digging up digital treasures with ease. 'Beep boop puff puff!' he chirps when curious, but spits in a glitchy huff when annoyed. His dreamy mind and tech flair make him the park’s cyber explorer!"
    },
    "Llama Park #6": {
        "ability": "Google",
        "description": "Say hello to the futuristic fuzzball lighting up Llama Park! With round ear antennas twitching like radar dishes and gadget scanner eyes that glint with futuristic flair, this blue-skinned wonder zips through Future Tokyo in a flash of 22nd-century style. Donning a pocket-packed outfit and rocking a 4D Pocket just like a certain robotic cat we know, they're your go-to buddy for pulling out wild inventions at just the right moment. An ENFJ at heart, they radiate warmth, rally the herd with a spark of charisma, and somehow always know exactly what you need. “Need a time-traveling umbrella or snack machine? Got it!” This llama’s got heart, tech, and charm—all wrapped up in one hyper-evolved hug of a hero."
    },
    "Llama Park #7": {
        "ability": "Twitter",
        "description": "Step aside—this llama’s making deals and winning like nobody else in Llama Park! Sporting those unmistakable blonde combover antennas and a gaze sharp enough to close any negotiation, he strides past the Mar-a-Lago skyline with unparalleled confidence. Clad in a custom tailored suit and his trademark red tie, he unlocks his Infinite Deal Pocket ability to pull out the biggest, best gadgets—tremendous time-travel calculators, luxurious snack dispensers, you name it—and always at the right moment. An ESTP through and through, he dives straight into action, thrives under pressure, and rallies every fuzzy companion with his huge charisma. “We’re going to make Llama Park great again!”"
    },
    "Llama Park #8": {
        "ability": "Drawing",
        "description": "Meet NeonBoss, the slickest llama in Llama Park! Rocking a black cap and laser eyes that shoot fiery beams, this tan-skinned boy llama struts in a suit and tie against a city skyline. An ENTJ with street smarts, skilling at drewing, he rules the urban jungle with swagger. 'Zap puff puff!' he boasts, lighting up the night, but spits with a smirk when challenged. His bold charisma and city vibe make him the park’s nightlife king!"
    },
    "Llama Park #9": {
        "ability": "Google",
        "description": "Shhh! It's Terra, the craftiest llama in the pixelated forest. With her messy green bun and squinty eyes that miss nothing, this spotted brown ISTP is a 'Google' master, always digging up secrets. She wears practical overalls for her adventures. Her happy sound is a soft 'Hmm-hmm-hmmm' of discovery. Upset her? She'll expertly camouflage and leave you talking to a pixelated bush! 'Knowledge is treasure,' she'd whisper, if she weren't so busy finding it."
    },
    "Llama Park #10": {
        "ability": "Talk Show",
        "description": "Roll out the red sand for AfroHost, the desert’s top talk show star of Llama Park! With a wild black afro and 3D glasses, this gray-skinned boy llama rocks a dark suit amid pyramids and cacti. An ESFP, he dazzles with hilarious chats and witty quips. 'Haha puff puff!' he laughs on air, but spits with flair when the crowd boos. His vibrant energy and desert charm make him the park’s entertainment king!"
    },
    "Llama Park #11": {
        "ability": "Talk Show",
        "description": "Greetings! I'm Professor Fluff, Llama Park's beloved host and silver-skinned sage. Rocking a wise grey afro and 3D glasses (for seeing all sides of an argument!), this ENFJ runs the most enlightening 'Talk Show' from his desert oasis. His joyful bleat is a warm 'Mmm-baaaah! Insightful!' If you bring negativity, he'll gently guide you to a more positive pixel with a calm, 'Now, now, let's reframe that.' He's all about connection and deep chats!"
    },
    "Llama Park #12": {
        "ability": "Twitter",
        "description": "A digital-age philosopher, this gray-skinned boy llama lives in a library but rules the world via Twitter threads. With a monocle and a turtleneck, he deconstructs memes and Plato in the same breath. He tweets haikus at sunrise and debates with bots at midnight. Dry wit, high IQ, and a timeline of fire."
    },
    "Llama Park #13": {
        "ability": "Twitter",
        "description": "Bow to QueenTweet, the royal influencer of Llama Park! With a golden crown sparkling and a regal gaze, this purple-skinned girl llama drapes in a royal robe against a grayish-blue backdrop. An ENFP, she rules Twitter with viral posts that charm the masses. 'Tweet puff puff!' she declares, spreading joy, but spits with royal sass when displeased. Her bubbly charm and majestic vibe make her the park’s social queen!"
    },
    "Llama Park #14": {
        "ability": "Talk Show",
        "description": "Golden, glamorous, and louder than life, this ESFP llama commands the stage in a glitter suit and star glasses. Host of the hit show “Llama Tonight,” he’s all charisma and catchphrases. Loves interviewing sentient robots, rogue philosophers, and confused goats. You’re not watching — you’re witnessing sparkle in motion."
    },
    "Llama Park #15": {
        "ability": "Drawing",
        "description": "Welcome BloomBae, the dreamy artist of Llama Park! Adorned with a flower crown and closed peaceful eyes, this pink-skinned girl llama wears a blue vest against a green backdrop, plus sign in tow. An INFP, she sketches nature’s beauty with gentle strokes. 'Petal puff puff!' she hums in bliss, but spits softly when disturbed. Her tranquil spirit and artistic touch make her the park’s floral muse!"
    }
}
chat_history = {

}

def initialize_chat(NFT_ID):
    """初始化聊天，返回初始消息列表和助手的第一条回复"""
    llama_info = llama_description.get(NFT_ID, {})
    llama_des = llama_info.get("description",  "You're a llama from Llama Park")
    messages = {
            "role": "system",
            "content": f"You're a llama from Llama Park, with the bio: {llama_des}. Reply to user input in under 50 words, don’t use anyone of emojis!, Must speak in English! ",
        }
    return messages


def get_chat_history(user_addr, NFT_ID):
    """获取聊天历史"""
    # 使用用户地址和NFT_ID去检查是否有之前的聊天记录存在
    if user_addr not in chat_history:
        chat_history[user_addr] = {}
    if NFT_ID not in chat_history[user_addr]:
        chat_history[user_addr][NFT_ID] = []
    return chat_history[user_addr][NFT_ID]

def get_llama_abilility(NFT_ID):
    """获取llama的能力"""
    llama_info = llama_description.get(NFT_ID, {})
    return llama_info.get("ability", None)


@app.route('/api/llamachat', methods=['POST'])
def llama_chat():
    try:
        data = request.json
        
        # 获取必要参数
        user_address = data.get('user_addr', '')
        nft_id = data.get('NFT_ID', '')
        chat_messages = data.get('message', '')

        # 拿到历史聊天数据
        chat_history = get_chat_history(user_address, nft_id)
        llama_alility = get_llama_abilility(nft_id)
        print(f"llama ability: {llama_alility}")
        # 得到llama的初始化描述
        llama_character = initialize_chat(nft_id)
        
        # 构建输入信息
        input_message = []
        input_message.extend(chat_history)
        input_message.append(llama_character)
        input_message.append({"role": "user", "content": chat_messages})
        print(input_message)
        
        # 将用户问题信息添加到聊天历史记录里
        chat_history.append({"role": "user", "content": chat_messages})
        
        # 获取助手回复
        if nft_id == "Llama Park #7":
            input_message_oral = "Step aside—this llama’s making deals and winning like nobody else in Llama Park! Sporting those unmistakable blonde combover antennas and a gaze sharp enough to close any negotiation, he strides past the Mar-a-Lago skyline with unparalleled confidence. Clad in a custom tailored suit and his trademark red tie, he unlocks his Infinite Deal Pocket ability to pull out the biggest, best gadgets—tremendous time-travel calculators, luxurious snack dispensers, you name it—and always at the right moment. An ESTP through and through, he dives straight into action, thrives under pressure, and rallies every fuzzy companion with his huge charisma. “We’re going to make Llama Park great again!”" + str(input_message)
            input_message = [
            {"role": "user", "content": input_message_oral}
            ]
            assistant_output = llamafactory_api_call(input_message)
            # 将恢复内容强转成 标准字符串

        else:
            
            if llama_alility == "Drawing":
                assistant_output = drawing_mcp_call(input_message)

            elif llama_alility == "Google":
                assistant_output = search_mcp_call(input_message)

            else:
                # 其他能力的处理
                response = get_response(input_message)
                assistant_output = response.choices[0].message.content

        
        # 将助手回复添加到聊天历史记录里
        if assistant_output == None:
            assistant_output = "pupupu"
        chat_history.append({"role": "assistant", "content": assistant_output})
        
        # 返回结果
        return jsonify({
            "status": "success",
            "message": assistant_output
        })
        
    except Exception as e:
        logger.error(f"处理请求时出错: {str(e)}")
        return jsonify({
            "status": "error",
            "message": f"处理请求时出错: {str(e)}"
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6006, debug=True)
