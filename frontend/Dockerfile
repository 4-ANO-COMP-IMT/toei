FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

# Instala as dependências necessárias
RUN apt-get update && \
    apt-get install -y curl git wget unzip libgconf-2-4 gdb libstdc++6 libglu1-mesa fonts-droid-fallback python3 && \
    apt-get clean

ENV DEBIAN_FRONTEND=dialog
ENV PUB_HOSTED_URL=https://pub.flutter-io.cn
ENV FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn

# Baixa o Flutter SDK do repositório do Flutter no GitHub
RUN git clone https://github.com/flutter/flutter.git /usr/local/flutter

# Define o caminho do ambiente Flutter
ENV PATH="/usr/local/flutter/bin:/usr/local/flutter/bin/cache/dart-sdk/bin:${PATH}"

# Executa o flutter doctor
RUN flutter doctor

# Habilita o Flutter web
RUN flutter channel master
RUN flutter upgrade
RUN flutter config --enable-web

# Cria variáveis de ambiente
ENV USER_URL=http://localhost:30003/user
ENV LOGIN_URL=http://localhost:30004/auth
ENV ARTWORK_URL=http://localhost:30005/artwork
ENV COUNTER_URL=http://localhost:30007/counter
ENV QUERY_URL=http://localhost:30008/query

# Copia os arquivos para o contêiner e instala as dependências
RUN mkdir /app/
COPY . /app/
WORKDIR /app

# Instala as dependências do Flutter
RUN flutter pub get

# Compila o aplicativo Flutter para a web
RUN flutter build web

# Expõe a porta que o aplicativo irá rodar
EXPOSE 9001

# Comando para servir os arquivos gerados
CMD ["sh", "-c", "cd /app/build/web && python3 -m http.server 9001"]