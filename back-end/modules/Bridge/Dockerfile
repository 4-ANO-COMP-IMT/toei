#alpine: imagem Linux "pequena"
FROM node:alpine

# um diretório no sistema de arquivos do contêiner para os comandos a seguir
WORKDIR /app

#copia o arquivo package.json para poder executar npm install
COPY package.json .

#instala as dependências
RUN npm install

#copia todo o conteúdo .local para a imagem
COPY . .


#cria variável de ambiente
ENV ALLOWED_URLS=http://user-clusterip-service:3000,http://login-clusterip-service:4000,http://artwork-clusterip-service:5000,http://query-clusterip-service:8000,http://counter-clusterip-service:7000
#                             user,                               login,                                artwork,                            query,                                counter

EXPOSE 10000

#executa quando o contêiner entrar em execução
CMD ["npm", "start"]

# docker network create toei-network
#optional# docker network ls

# docker build -t bridge-image .
#optional# docker images

# docker run -p 10000:10000 -d --rm --name bridge-container --network toei-network bridge-image