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
ENV BRIDGE_URL=http://bridge-service:10000
ENV FLUTTER_URL=http://localhost:30012
ENV REACT_URL=http://localhost:30011

EXPOSE 7000

#executa quando o contêiner entrar em execução
CMD ["npm", "start"]

# docker build -t counter-image .
#optional# docker images

# docker run -p 7000:7000 -d --rm --name counter-container --network toei-network counter-image