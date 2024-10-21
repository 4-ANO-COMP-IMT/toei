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
ENV VITE_USER_URL=http://localhost:30003/user
ENV VITE_LOGIN_URL=http://localhost:30004/auth
ENV VITE_ARTWORK_URL=http://localhost:30005/artwork
ENV VITE_COUNTER_URL=http://localhost:30007/counter
ENV VITE_QUERY_URL=http://localhost:30008/query

EXPOSE 5173

#executa quando o contêiner entrar em execução
CMD ["npm", "run", "dev"]

# docker build -t react-image .
#optional# docker images

# docker run -p 5173:5173 -d --rm --name react-container --network toei-network react-image