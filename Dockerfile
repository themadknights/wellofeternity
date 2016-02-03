FROM ultrayoshi/node-gulp-surge
MAINTAINER david.morcillo@gmail.com

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
