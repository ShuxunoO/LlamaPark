import os
import sys
from api_service import app

if __name__ == '__main__':
    # 确保当前文件所在目录添加到路径中
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    # 启动服务器
    app.run(host='0.0.0.0', port=6006)
