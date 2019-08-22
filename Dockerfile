FROM node:12

ENV DEBIAN_FRONTEND=noninteractive

COPY . /usr/local/gen3-statics
RUN useradd -m -s /bin/bash gen3 \
  && chown -R gen3: /usr/local/gen3-statics

USER gen3

WORKDIR /usr/local/gen3-statics
RUN /bin/rm -rf node_modules \
    && npm ci \
    && npm run compile \
    && chmod a+rx dockerStart.sh

USER gen3
EXPOSE 4000

ENTRYPOINT [ "npm", "run", "go", "--" ] 
