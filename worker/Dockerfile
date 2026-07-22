FROM gcc:14


WORKDIR /worker


COPY . .


RUN apt update && apt install -y cmake


RUN cmake -B build


RUN cmake --build build


CMD ["./build/minecraft_worker"]