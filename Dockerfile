# 使用官方Node.js的Docker镜像作为基础镜像
FROM node:20

# 设置工作目录
WORKDIR /usr/src/app

# 复制package.json和package-lock.json（如果存在）
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制项目文件到工作目录
COPY . .

# 暴露端口
EXPOSE 3000

# 定义环境变量
ENV PORT 3000

# 运行应用
CMD ["webpack", "serve"]