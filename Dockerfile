FROM quay.io/cdis/nodejs-base:master

COPY . /usr/local/gen3-statics
RUN chown -R gen3:gen3 /usr/local/gen3-statics

USER gen3

WORKDIR /usr/local/gen3-statics
RUN /bin/rm -rf node_modules \
    && npm ci \
    && npm run compile

USER gen3
EXPOSE 4000

ENTRYPOINT [ "npm", "run", "go", "--" ] 
