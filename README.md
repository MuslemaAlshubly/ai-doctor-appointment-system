# ai-doctor-appointment-system

## Building and running with Docker

**Note:** On macOS, port 5000 is used by AirPlay Receiver. Use port 5001 instead.
```bash
# Build the Docker image
docker build -t ai-doctor-appointement-system .

# Run the container
docker run -d -p 5001:5000 --name ai-doctor-appointement-system ai-doctor-appointement-system

# Test the application
open http://localhost:5001
# OR
curl http://localhost:5001

# View container logs
docker logs ai-doctor-appointement-system

# Stop and remove the container
docker stop ai-doctor-appointement-system && docker rm ai-doctor-appointement-system
```