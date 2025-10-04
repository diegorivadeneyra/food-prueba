FROM golang:1.21
RUN apt-get update && apt-get install -y default-mysql-client
WORKDIR /app
COPY go.mod ./
COPY go.sum ./
RUN go mod download
COPY . .
RUN go build -o ms-orders .
EXPOSE 8002
CMD ["sh", "-c", "until mysql -h db-orders -u root -ppassword -e 'SELECT 1'; do sleep 2; done && ./ms-orders"]
