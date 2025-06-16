FROM nginx:alpine
# Hapus isi default nginx
RUN rm -rf /usr/share/nginx/html/*
# Copy hasil build React/Vite ke folder web nginx
COPY pawpaw-fe-main/dist/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
