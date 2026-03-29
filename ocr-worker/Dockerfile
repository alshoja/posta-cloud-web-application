# OCR Dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./

RUN apt-get update && \
    apt-get install -y tesseract-ocr tesseract-ocr-eng && \
    rm -rf /var/lib/apt/lists/* && \
    npm install


COPY . .

EXPOSE 6000

CMD ["npm", "run", "start:dev"]