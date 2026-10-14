FROM openproject-fa-build-base:18.0.0-d0d7ca836aa5
WORKDIR /app
COPY source.tar /tmp/openproject-source.tar
RUN tar -xf /tmp/openproject-source.tar -C /app && rm /tmp/openproject-source.tar
ENV BUNDLE_WITHOUT=""
ENV RAILS_ENV=test
ENV DISABLE_SPRING=1
RUN bundle config set --local without '' && bundle install --jobs=8 --retry=3
RUN printf 'test:\n  adapter: postgresql\n  encoding: unicode\n  url: <%%= ENV.fetch("DATABASE_URL") %%>\n' > config/database.yml
