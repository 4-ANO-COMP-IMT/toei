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

EXPOSE 5173

#executa quando o contêiner entrar em execução
CMD ["npm", "run", "dev"]

# docker build -t react-image .
#optional# docker images

# docker run -p 5173:5173 -d --rm --name react-container --network toei-network react-image