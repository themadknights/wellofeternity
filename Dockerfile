FROM node:4.1.2
MAINTAINER david.morcillo@gmail.com

# Install gulp globally
RUN npm install -g gulp surge

# Create working directory
ENV APP_HOME /wellofeternity
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

# Expose ports
EXPOSE 8080
EXPOSE 35729

# Add source code
ADD . $APP_HOME

ENTRYPOINT ["npm"]

CMD ["run", "dev"]
