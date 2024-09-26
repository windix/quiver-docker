FROM python:3.12-alpine

ENV QUIVER_DIR=/mnt/quiver

WORKDIR /app

COPY Pipfile Pipfile.lock ./

RUN pip install pipenv && pipenv install --deploy --ignore-pipfile

COPY . .

RUN touch crontab.tmp \
    && echo '*/5 * * * * /app/run.sh' >> crontab.tmp \
    && crontab crontab.tmp \
    && rm -rf crontab.tmp

# CMD ["./run.sh"]
# CMD ["/usr/sbin/crond", "-f", "-d", "0"]

CMD ./run.sh ; /usr/sbin/crond -f -d 0
