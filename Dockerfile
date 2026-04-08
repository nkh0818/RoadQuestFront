
FROM nginx:stable-alpine
COPY dist /usr/share/nginx/html

# 3. 80번 포트 열기
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]