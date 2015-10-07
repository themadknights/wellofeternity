FROM ubuntu:15.04
MAINTAINER david@adverway.com

# Install dependencies
RUN apt-get update && \
    apt-get install -y wget build-essential python-software-properties git

# Install node v4.1.2
RUN cd && wget https://nodejs.org/dist/v4.1.2/node-v4.1.2.tar.gz && \
    tar -xzvf node-v4.1.2.tar.gz && cd node-v4.1.2/ && \
    ./configure && make && make install

# Install gulp globally
RUN npm install -g gulp

# Create working directory
ENV APP_HOME /wellofeternity
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

# Expose ports
EXPOSE 8080
EXPOSE 35729

# Add source code
ADD . $APP_HOME

CMD ["gulp", "dev"]
