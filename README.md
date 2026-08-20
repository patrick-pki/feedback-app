# 🐳 Event Feedback Hub — Docker Bootcamp

A full-stack feedback collection app, containerized with Docker.

---

## 📋 Prerequisites

- [ ] Git installed
- [ ] Docker installed
- [ ] Docker Compose installed
- [ ] GitHub account

---

## 📁 Project Structure

```
feedback-forge-[your-name]/
├── app/
│   ├── main.py             # Flask backend
│   ├── requirements.txt    # Python dependencies
│   ├── entrypoint.sh       # ⚠️ BROKEN - fix this!
│   ├── static/              # CSS & JavaScript
│   └── templates/           # HTML templates
├── database/
│   └── init.sql             # PostgreSQL seed data
├── Dockerfile               ⬜ YOU WRITE THIS
├── docker-compose.yml       ⬜ YOU WRITE THIS
├── .dockerignore             ⬜ YOU WRITE THIS
├── .env.example              # Environment template
└── .gitignore                # Provided
```

---

## 🚀 Your Tasks

### Task 1: Fix `entrypoint.sh` (`app/entrypoint.sh`)

The file has **3 bugs**:

1. `apt-get` command (will fail in slim image)
2. Windows CRLF line endings
3. No wait for PostgreSQL

**Fix these and commit.**

---

### Task 2: Write `Dockerfile`

Create a `Dockerfile` that:

- Uses Python 3.11 (slim or alpine)
- Copies and installs requirements first (layer caching)
- Copies the application code
- Makes `entrypoint.sh` executable
- Uses `ENTRYPOINT`
- Exposes port 5000

**Build and test:**

```bash
docker build -t feedback-app .
docker run -p 5000:5000 feedback-app
```

---

### Task 3: Write `docker-compose.yml`

Create a `docker-compose.yml` with:

- `postgres` service (`postgres:15` image)
- `app` service (builds from your Dockerfile)
- Environment variables for database connection
- Port mapping (`5000:5000`)
- Custom network
- Volume for PostgreSQL data persistence

**Start everything:**

```bash
docker compose up --build
```

---

### Task 4: Production Readiness

Add to your `docker-compose.yml`:

- Healthcheck for PostgreSQL
- `depends_on` with `condition: service_healthy`
- `restart: unless-stopped`

Create `.dockerignore` to exclude:

- Python cache (`__pycache__/`)
- Environment files (`.env`)
- Git files (`.git/`)
- IDE files (`.vscode/`)

---

## ✅ Testing Before Creating a Pull Request

Before you create a Pull Request, test everything!

### Test Checklist

- [ ] `docker build -t feedback-app .` completes without errors
- [ ] `docker run -p 5000:5000 feedback-app` runs and app is accessible at `http://localhost:5000`
- [ ] `docker compose up --build` starts both app and database
- [ ] You can submit feedback through the web interface
- [ ] Submitted feedback appears in the list
- [ ] Stop containers (`docker compose down`) and restart them — your data is still there
- [ ] `docker compose ps` shows both containers as "healthy"

### If Anything Fails

1. Read the error message carefully
2. Check the logs: `docker compose logs -f`
3. Fix the issue
4. Test again
5. Repeat until everything works

### Only Create a PR When:

- ✅ All tests pass
- ✅ The app works in your browser
- ✅ Data persists after restart
- ✅ Both containers are healthy

---

## 🏆 Bonus Challenges

- Multi-stage Dockerfile
- Image size < 100MB
- Add Redis container

---

## 📝 Submission Checklist

- [ ] `entrypoint.sh` is fixed
- [ ] `Dockerfile` works
- [ ] `docker-compose.yml` works
- [ ] Data persists after restart
- [ ] Healthchecks configured
- [ ] `.dockerignore` added
- [ ] README updated with your explanation
- [ ] All tests passed locally
- [ ] Only then create a Pull Request
- [ ] All changes pushed to GitHub

---

## 📚 Resources

- [Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Best Practices for Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)

---

## ❓ Common Issues

| Problem | Check |
|---|---|
| `apt-get` not found | Remove it or use a different base image |
| CRLF errors | Fix line endings in `entrypoint.sh` |
| Can't connect to DB | `DB_HOST` must be `postgres` (service name) |
| Port in use | Change mapping to `5001:5000` |

---

Good luck! 🐳
