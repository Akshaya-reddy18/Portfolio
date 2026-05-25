# Running the backend in Docker

This project includes a `Dockerfile` that builds an image containing the backend (FastAPI) and required system libraries (gfortran, BLAS/LAPACK) so SciPy and related ML libraries install cleanly.

Build the image from repository root:

```bash
docker build -t akshaya-digital-twin:latest .
```

Run the container:

```bash
docker run -p 8000:8000 akshaya-digital-twin:latest
```

Notes:
- The Dockerfile installs `backend/requirements.txt` into the image. If you change requirements, rebuild the image.
- For deploy platforms (Render, Fly, etc.) you can use this Dockerfile for a reproducible runtime that avoids source builds for SciPy.
