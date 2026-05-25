FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       build-essential \
       gfortran \
       libopenblas-dev \
       liblapack-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python deps early to leverage layer caching
COPY backend/requirements.txt ./backend/requirements.txt
RUN python -m pip install --upgrade pip setuptools wheel
RUN pip install -r backend/requirements.txt

# Copy the repository
COPY . /app

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
