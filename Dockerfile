# Use official Python image
FROM python:3.13.5-slim-bookworm

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy project
COPY . /app/

# Collect static files (optional, for production)
# RUN python university_erp_backend/manage.py collectstatic --noinput

# Expose port 8000
EXPOSE 8000

# Run the Django app
CMD ["python", "university_erp_backend/manage.py", "runserver", "0.0.0.0:8000"] 